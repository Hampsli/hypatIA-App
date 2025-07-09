#!/bin/bash

# Start the backend server in the background
echo "Starting backend server..."
cd /home/runner/workspace
tsx server/index.ts &
BACKEND_PID=$!

# Give the backend a moment to start
sleep 2

# Start the frontend development server
echo "Starting frontend server..."
cd client
vite --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

echo "Backend running on port 3001"
echo "Frontend running on port 3000"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Wait for both processes
wait