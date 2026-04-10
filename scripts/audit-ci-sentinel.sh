#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-5500}"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && ps -p "${SERVER_PID}" >/dev/null 2>&1; then
    kill "${SERVER_PID}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

python3 -m http.server "${PORT}" --directory "${ROOT_DIR}" >/tmp/gamedev-ai-guide-audit-server.log 2>&1 &
SERVER_PID="$!"

for _ in {1..20}; do
  if curl -sf "http://localhost:${PORT}" >/dev/null; then
    break
  fi
  sleep 0.5
done

MODE="sentinel" \
FAIL_ON_THRESHOLD="1" \
LIGHTHOUSE_TIMEOUT_SEC="240" \
LIGHTHOUSE_MAX_WAIT_FOR_LOAD_MS="60000" \
BASE_URL="http://localhost:${PORT}" \
bash "${ROOT_DIR}/scripts/audit-mobile.sh"
