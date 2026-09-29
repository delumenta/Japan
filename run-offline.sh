#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
python3 -m http.server 8765 >/tmp/japan-offline-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
sleep 1
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:8765/index.html" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "http://localhost:8765/index.html"
fi
echo "Japan offline server running at http://localhost:8765/index.html"
echo "Press Ctrl+C to stop it."
wait "$SERVER_PID"
