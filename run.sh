#!/bin/bash

echo "Starting hypatIA Development Environment..."

# Kill any existing processes
pkill -f "tsx\|vite\|node" 2>/dev/null || true

# Start backend
echo "Starting backend server on port 3001..."
cd /home/runner/workspace
tsx server/index.ts > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend
if curl -s http://localhost:3001/health; then
    echo "Backend is running!"
else
    echo "Backend failed to start. Checking logs:"
    cat backend.log
fi

# Start frontend
echo "Starting frontend on port 3000..."
cd /home/runner/workspace/client
vite --host 0.0.0.0 --port 3000 > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Frontend available at: http://localhost:3000"
echo "Backend API at: http://localhost:3001"

# Show running processes
echo "Running processes:"
ps aux | grep -E "(tsx|vite)" | grep -v grep

wait