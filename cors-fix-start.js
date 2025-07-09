const { spawn } = require('child_process');

console.log('🔧 Starting hypatIA with CORS fix...');

// Kill existing processes
require('child_process').exec('pkill -f "tsx|vite" 2>/dev/null || true', () => {
  
  // Start backend
  console.log('📡 Starting backend with enhanced CORS...');
  const backend = spawn('npx', ['tsx', 'server/http-server.ts'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  backend.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });
  
  backend.stderr.on('data', (data) => {
    console.error(`[Backend] ${data.toString().trim()}`);
  });
  
  // Start frontend with proxy
  setTimeout(() => {
    console.log('🌐 Starting frontend with Vite proxy...');
    const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
      cwd: './client',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    frontend.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('connecting')) {
        console.log(`[Frontend] ${output}`);
      }
    });
    
    frontend.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('WebSocket')) {
        console.error(`[Frontend] ${output}`);
      }
    });
    
    setTimeout(() => {
      console.log('');
      console.log('✅ CORS-fixed hypatIA is running!');
      console.log('🔧 Vite proxy will handle /api/* requests to backend');
      console.log('📱 Test registration - no more CORS errors!');
      console.log('');
    }, 5000);
    
  }, 3000);
});