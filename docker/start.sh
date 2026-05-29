#!/bin/bash
set -e

cleanup() {
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup SIGTERM SIGINT EXIT

echo "Iniciando API IOPaint en :8080..."
iopaint start --model=lama --device=cuda --host=0.0.0.0 --port 8080 &

echo "Iniciando app principal en :5174..."
serve -s /app/main/dist -l 5174 &

echo "Iniciando editor IOPaint (UI) en :5173..."
serve -s /app/editor/dist -l 5173 &

echo "Stack listo:"
echo "  App:    http://localhost:5174"
echo "  Editor: http://localhost:5173"
echo "  IOPaint API: http://localhost:8080"
wait
