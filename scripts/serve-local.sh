#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5500}"

existing_pid="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN || true)"
if [[ -n "${existing_pid}" ]]; then
  existing_cmd="$(ps -p "${existing_pid}" -o command= || true)"
  if [[ "${existing_cmd}" == *"python3 -m http.server"* || "${existing_cmd}" == *"python -m http.server"* ]]; then
    echo "Stopping existing local server on port ${PORT} (PID ${existing_pid})..."
    kill "${existing_pid}"
  else
    echo "Port ${PORT} is already in use by another process:"
    echo "  ${existing_cmd}"
    echo "Stop it first, or run: PORT=5501 npm run serve"
    exit 1
  fi
fi

echo "Serving local site at http://localhost:${PORT}"
exec python3 -m http.server "${PORT}"
