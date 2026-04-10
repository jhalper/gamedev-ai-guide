#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PAGES=(
  "omniverse/index.html"
  "vr-report-tracker/index.html"
  "vr-report-tracker-static/index.html"
)

missing=0

for page in "${PAGES[@]}"; do
  full_page="${ROOT_DIR}/${page}"

  if [[ ! -f "${full_page}" ]]; then
    echo "ERROR: Missing page: ${page}"
    missing=1
    continue
  fi

  while IFS= read -r ref; do
    [[ -z "${ref}" ]] && continue

    asset_rel="${ref#./}"
    asset_path="${ROOT_DIR}/$(dirname "${page}")/${asset_rel}"

    if [[ ! -f "${asset_path}" ]]; then
      echo "ERROR: ${page} references missing asset ${ref}"
      missing=1
    fi
  done < <(grep -oE '\./assets/index-[A-Za-z0-9_-]+\.(js|css)' "${full_page}" | sort -u)
done

if [[ "${missing}" -ne 0 ]]; then
  echo "Asset reference validation failed."
  exit 1
fi

echo "Asset reference validation passed."
