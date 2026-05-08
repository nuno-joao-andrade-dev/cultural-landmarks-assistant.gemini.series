#!/bin/bash
# Script to stop all workshop processes on ports 3000, 3001, and 8000

PORTS=(3000 3001 8000)

for PORT in "${PORTS[@]}"; do
  PID=$(lsof -t -i :$PORT)
  if [ -n "$PID" ]; then
    echo "Stopping process on port $PORT (PID: $PID)..."
    kill -9 $PID 2>/dev/null
  else
    echo "Port $PORT is already free."
  fi
done

echo "Done."
