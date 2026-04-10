#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUDGET_FILE="${ROOT_DIR}/audits/performance-budget.json"
PORT="${PORT:-5500}"
BASE_URL="${BASE_URL:-http://localhost:${PORT}}"
MODE="${MODE:-full}" # full | sentinel
FAIL_ON_THRESHOLD="${FAIL_ON_THRESHOLD:-0}"
LIGHTHOUSE_TIMEOUT_SEC="${LIGHTHOUSE_TIMEOUT_SEC:-180}"
LIGHTHOUSE_MAX_WAIT_FOR_LOAD_MS="${LIGHTHOUSE_MAX_WAIT_FOR_LOAD_MS:-45000}"

# Threshold defaults (Balanced profile).
THRESHOLD_PERFORMANCE="${THRESHOLD_PERFORMANCE:-80}"
THRESHOLD_LCP_MS="${THRESHOLD_LCP_MS:-3000}"
THRESHOLD_INP_MS="${THRESHOLD_INP_MS:-250}"
THRESHOLD_CLS="${THRESHOLD_CLS:-0.1}"
THRESHOLD_TBT_MS="${THRESHOLD_TBT_MS:-300}"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is required to parse Lighthouse reports."
  exit 1
fi

if [[ ! -f "${BUDGET_FILE}" ]]; then
  echo "ERROR: Missing budget file at ${BUDGET_FILE}"
  exit 1
fi

if ! curl -sf "${BASE_URL}" >/dev/null; then
  echo "ERROR: Could not reach ${BASE_URL}. Start the local server first."
  exit 1
fi

RUN_ID="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="${ROOT_DIR}/audits/runs/${RUN_ID}-${MODE}"
mkdir -p "${OUT_DIR}/reports"

INDEX_FILE="${OUT_DIR}/route-index.tsv"
FAILED_FILE="${OUT_DIR}/failed-routes.log"
touch "${INDEX_FILE}" "${FAILED_FILE}"

echo "Mobile audit mode: ${MODE}"
echo "Output directory: ${OUT_DIR}"

mapfile -t PAGES < <(
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const mode = process.argv[2];
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const key = mode === 'sentinel' ? 'sentinel_routes' : 'full_routes';
    (data[key] || []).forEach(route => console.log(route));
  " "${BUDGET_FILE}" "${MODE}"
)

if [[ "${#PAGES[@]}" -eq 0 ]]; then
  echo "ERROR: No pages found for mode ${MODE} in ${BUDGET_FILE}"
  exit 1
fi

for route in "${PAGES[@]}"; do
  safe_name="${route//\//_}"
  safe_name="${safe_name%.html}"
  out_json="${OUT_DIR}/reports/${safe_name}.json"
  url="${BASE_URL}/${route}"
  status="ok"
  reason=""

  echo "Running Lighthouse mobile audit for ${route}"
  if command -v timeout >/dev/null 2>&1; then
    if ! timeout "${LIGHTHOUSE_TIMEOUT_SEC}s" npx --yes lighthouse "${url}" \
      --preset=perf \
      --form-factor=mobile \
      --screenEmulation.mobile=true \
      --throttling-method=simulate \
      --max-wait-for-load="${LIGHTHOUSE_MAX_WAIT_FOR_LOAD_MS}" \
      --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
      --no-enable-error-reporting \
      --quiet \
      --output=json \
      --output-path="${out_json}"; then
      status="failed"
      reason="timeout_or_lighthouse_error"
    fi
  else
    if ! npx --yes lighthouse "${url}" \
      --preset=perf \
      --form-factor=mobile \
      --screenEmulation.mobile=true \
      --throttling-method=simulate \
      --max-wait-for-load="${LIGHTHOUSE_MAX_WAIT_FOR_LOAD_MS}" \
      --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
      --no-enable-error-reporting \
      --quiet \
      --output=json \
      --output-path="${out_json}"; then
      status="failed"
      reason="lighthouse_error"
    fi
  fi

  if [[ "${status}" != "ok" ]]; then
    echo "${route}: ${reason}" | tee -a "${FAILED_FILE}"
    rm -f "${out_json}"
  fi

  printf '%s\t%s\t%s\t%s\n' "${route}" "${safe_name}" "${status}" "${reason}" >> "${INDEX_FILE}"
done

SUMMARY_FILE="${OUT_DIR}/summary.md"
THRESHOLD_FILE="${OUT_DIR}/threshold-results.json"

set +e
node - <<'NODE' "${OUT_DIR}" "${SUMMARY_FILE}" "${THRESHOLD_FILE}" "${THRESHOLD_PERFORMANCE}" "${THRESHOLD_LCP_MS}" "${THRESHOLD_INP_MS}" "${THRESHOLD_CLS}" "${THRESHOLD_TBT_MS}"
const fs = require('fs');
const path = require('path');

const outDir = process.argv[2];
const summaryPath = process.argv[3];
const thresholdPath = process.argv[4];
const thresholds = {
  performance: Number(process.argv[5]),
  lcp: Number(process.argv[6]),
  inp: Number(process.argv[7]),
  cls: Number(process.argv[8]),
  tbt: Number(process.argv[9])
};

const reportsDir = path.join(outDir, 'reports');
const indexPath = path.join(outDir, 'route-index.tsv');
const indexRows = fs.readFileSync(indexPath, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [route, safeName, status, reason] = line.split('\t');
    return { route, safeName, status, reason: reason || '' };
  });

const rows = [];
const checks = [];

function metricValue(audits, id) {
  const entry = audits[id];
  if (!entry || entry.numericValue == null) {
    return null;
  }
  return Number(entry.numericValue);
}

for (const entry of indexRows) {
  const file = `${entry.safeName}.json`;
  const fullPath = path.join(reportsDir, file);

  if (entry.status !== 'ok' || !fs.existsSync(fullPath)) {
    const row = {
      route: entry.route,
      report: path.join('reports', file),
      performance: null,
      lcp: null,
      inp: null,
      cls: null,
      tbt: null,
      pass: {
        performance: false,
        lcp: false,
        inp: false,
        cls: false,
        tbt: false
      },
      error: entry.reason || 'missing_report',
      overallPass: false
    };
    rows.push(row);
    checks.push(row);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const audits = data.audits || {};
  const categories = data.categories || {};

  const perfScoreRaw = categories.performance && categories.performance.score != null
    ? Number(categories.performance.score) * 100
    : null;
  const perfScore = perfScoreRaw == null ? null : Math.round(perfScoreRaw);
  const lcp = metricValue(audits, 'largest-contentful-paint');
  const inp = metricValue(audits, 'interaction-to-next-paint');
  const cls = metricValue(audits, 'cumulative-layout-shift');
  const tbt = metricValue(audits, 'total-blocking-time');

  const pass = {
    performance: perfScore != null ? perfScore >= thresholds.performance : false,
    lcp: lcp != null ? lcp <= thresholds.lcp : false,
    inp: inp != null ? inp <= thresholds.inp : true,
    cls: cls != null ? cls <= thresholds.cls : false,
    tbt: tbt != null ? tbt <= thresholds.tbt : false
  };

  const row = {
    route: entry.route,
    report: path.join('reports', file),
    performance: perfScore,
    lcp,
    inp,
    cls,
    tbt,
    pass,
    overallPass: pass.performance && pass.lcp && pass.cls && pass.tbt && pass.inp
  };

  rows.push(row);
  checks.push(row);
}

const md = [];
md.push('# Mobile Audit Summary');
md.push('');
md.push(`Thresholds: Performance >= ${thresholds.performance}, LCP <= ${thresholds.lcp}ms, INP <= ${thresholds.inp}ms, CLS <= ${thresholds.cls}, TBT <= ${thresholds.tbt}ms`);
md.push('');
md.push('| Route | Perf | LCP ms | INP ms | CLS | TBT ms | Status |');
md.push('|---|---:|---:|---:|---:|---:|---|');

for (const row of rows) {
  const status = row.overallPass ? 'PASS' : 'FAIL';
  const perf = row.error ? `${row.performance ?? 'n/a'} (${row.error})` : `${row.performance ?? 'n/a'}`;
  md.push(`| ${row.route || '(unknown)'} | ${perf} | ${row.lcp != null ? Math.round(row.lcp) : 'n/a'} | ${row.inp != null ? Math.round(row.inp) : 'n/a'} | ${row.cls != null ? row.cls.toFixed(3) : 'n/a'} | ${row.tbt != null ? Math.round(row.tbt) : 'n/a'} | ${status} |`);
}

md.push('');
md.push('## Report Files');
for (const row of rows) {
  md.push(`- ${row.report}`);
}

fs.writeFileSync(summaryPath, md.join('\n'));
fs.writeFileSync(thresholdPath, JSON.stringify({ thresholds, results: checks }, null, 2));

const failed = checks.filter(c => !c.overallPass).length;
if (failed > 0) {
  process.exitCode = 2;
}
NODE

node_exit=$?
set -e

if [[ "${node_exit}" -eq 2 ]]; then
  echo "One or more routes failed thresholds."
  if [[ "${FAIL_ON_THRESHOLD}" == "1" ]]; then
    exit 1
  fi
fi

echo "Summary written: ${SUMMARY_FILE}"
echo "Threshold result JSON: ${THRESHOLD_FILE}"
echo "Failed routes log: ${FAILED_FILE}"
