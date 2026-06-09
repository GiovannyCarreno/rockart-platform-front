#!/bin/sh
set -e

cleanup() {
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup TERM INT EXIT

echo "Iniciando app principal en :5174..."
node /app/server.mjs /app/main/dist 5174 &

echo "Iniciando editor frontend en :5173..."
node /app/server.mjs /app/editor/dist 5173 &

echo "Frontends listos:"
echo "  App principal:    http://localhost:5174"
echo "  Editor frontend:  http://localhost:5173"
wait
