const { spawn } = require('child_process');

console.log('🚀 hypatIA with Full Logging');
console.log('============================');
console.log('');
console.log('📊 Logging Legend:');
console.log('🔵 Backend incoming requests');
console.log('🟡 Frontend outgoing requests');
console.log('📝 Request bodies');
console.log('📤 Response data');
console.log('🔑 Authentication tokens');
console.log('✅ Successful operations');
console.log('❌ Errors and failures');
console.log('');

// Kill existing processes
require('child_process').exec('pkill -f "tsx|vite" 2>/dev/null || true', () => {
  
  // Start backend with enhanced logging
  console.log('📡 Starting backend server with request/response logging...');
  const backend = spawn('npx', ['tsx', 'server/http-server.ts'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  backend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) console.log(`[BACKEND] ${output}`);
  });
  
  backend.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) console.error(`[BACKEND ERROR] ${output}`);
  });
  
  // Start frontend after backend is ready
  setTimeout(() => {
    console.log('🌐 Starting frontend with API call logging...');
    const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
      cwd: './client',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    frontend.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('[vite] connecting')) {
        console.log(`[FRONTEND] ${output}`);
      }
    });
    
    frontend.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('WebSocket') && !output.includes('connecting')) {
        console.error(`[FRONTEND ERROR] ${output}`);
      }
    });
    
    setTimeout(() => {
      console.log('');
      console.log('✅ hypatIA is running with full logging!');
      console.log('🌐 Frontend: http://localhost:3000');
      console.log('📋 Backend: http://localhost:3001');
      console.log('');
      console.log('🔍 Test the application to see API call logs:');
      console.log('  1. Open frontend URL in browser');
      console.log('  2. Try registering a new user');
      console.log('  3. Watch console for detailed request/response logs');
      console.log('');
    }, 5000);
    
  }, 3000);
  
  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
});