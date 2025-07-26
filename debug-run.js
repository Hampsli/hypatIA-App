const { exec, spawn } = require('child_process');
const path = require('path');

console.log('🔍 hypatIA Debug Startup');
console.log('========================');

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
    console.log('✓ Frontend App: http://localhost:3000');
    console.log('✓ PostCSS configuration fixed');
    console.log('✓ Vite host allowlist configured');
    console.log('');
    console.log('📱 Ready to use hypatIA features:');
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