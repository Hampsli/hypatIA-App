#!/bin/bash

echo "🚀 Starting hypatIA Application"
echo "================================"

# Kill any existing processes
pkill -f "tsx\|vite" 2>/dev/null || true

# Start backend server
echo "📡 Starting backend server on port 3001..."
cd /home/runner/workspace
tsx server/http-server.ts &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server on port 3000..."
cd client
vite --host 0.0.0.0 --port 3000 --config vite.config.ts &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Application started successfully!"
echo "📋 Backend API: http://localhost:3001"
echo "🌐 Frontend App: http://localhost:3000" 
echo ""
echo "🔍 Test endpoints:"
echo "   Health Check: curl http://localhost:3001/health"
echo "   Frontend: Open http://localhost:3000 in browser"
echo ""
echo "📝 Application Features:"
echo "   ✓ Modern landing page with minimalist design"
echo "   ✓ Complete authentication with email/password and OTP"
echo "   ✓ Comprehensive profile form (5 sections)"
echo "   ✓ Assessment carousel with 3 power skills questions"
echo "   ✓ Dashboard with Assessment, Training, Mentorship sections"
echo ""
echo "🧪 Test User Registration:"
echo '   curl -X POST http://localhost:3001/api/auth/register \'
echo '     -H "Content-Type: application/json" \'
echo '     -d '"'"'{"name":"María González","email":"maria@test.com","password":"password123","age":28,"currentRole":"Desarrolladora"}"'"'"
echo ""

# Keep both processes running
wait