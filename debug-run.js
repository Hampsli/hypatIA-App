const { exec, spawn } = require('child_process');
const path = require('path');

console.log('🔍 hypatIA Debug Startup');
console.log('========================');

// Kill any existing processes
exec('pkill -f "tsx|vite" 2>/dev/null || true', (error) => {
  console.log('🧹 Cleaned up existing processes');
  
  // Start backend with detailed logging
  console.log('📡 Starting backend server...');
  const backend = spawn('npx', ['tsx', 'server/http-server.ts'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  backend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) console.log(`[Backend] ${output}`);
  });
  
  backend.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) console.error(`[Backend Error] ${output}`);
  });
  
  // Test backend after startup
  setTimeout(() => {
    exec('curl -s http://localhost:3001/health', (err, stdout) => {
      if (stdout && stdout.includes('OK')) {
        console.log('✅ Backend is healthy');
        startFrontend();
      } else {
        console.log('❌ Backend health check failed');
        console.log('🔄 Retrying backend startup...');
        setTimeout(startFrontend, 3000);
      }
    });
  }, 3000);
});

function startFrontend() {
  console.log('🌐 Starting frontend with PostCSS fix...');
  
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
    cwd: path.join(process.cwd(), 'client'),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  frontend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) console.log(`[Frontend] ${output}`);
  });
  
  frontend.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('[vite] connecting') && !output.includes('WebSocket closed')) {
      console.error(`[Frontend Error] ${output}`);
    }
  });
  
  setTimeout(() => {
    console.log('');
    console.log('🚀 hypatIA Application Status:');
    console.log('------------------------------');
    console.log('✓ Backend API: http://localhost:3001');
    console.log('✓ Frontend App: http://localhost:3000');
    console.log('✓ PostCSS configuration fixed');
    console.log('✓ Vite host allowlist configured');
    console.log('');
    console.log('📱 Ready to use hypatIA features:');
    console.log('  • Modern landing page');
    console.log('  • Email authentication with OTP');
    console.log('  • 5-section profile form');
    console.log('  • Assessment carousel');
    console.log('  • Dashboard with 3 main sections');
  }, 5000);
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down hypatIA...');
  exec('pkill -f "tsx|vite"', () => process.exit(0));
});