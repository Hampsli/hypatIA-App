const { exec, spawn } = require('child_process');

console.log('🚀 hypatIA - Skills Management for Women in STEM');
console.log('================================================');

// Function to start a process and handle output
function startProcess(command, args, cwd = process.cwd(), name = '') {
  const process = spawn(command, args, { 
    cwd, 
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true 
  });
  
  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });
  
  return process;
}

// Kill existing processes
exec('pkill -f "tsx|vite" 2>/dev/null || true', () => {
  
  // Start backend
  console.log('📡 Starting backend server...');
  const backend = startProcess('npx', ['tsx', 'server/http-server.ts'], process.cwd(), 'Backend');
  
  // Wait for backend to start, then start frontend
  setTimeout(() => {
    console.log('🌐 Starting frontend server...');
    const frontend = startProcess('npx', ['vite', '--host', '0.0.0.0', '--port', '3000', '--config', 'vite.config.ts'], 
                                   './client', 'Frontend');
    
    setTimeout(() => {
      console.log('');
      console.log('✅ hypatIA is now running!');
      console.log('🌐 Open your application at the provided URL');
      console.log('');
      console.log('📱 Features available:');
      console.log('   • Landing page with platform overview');
      console.log('   • User registration and email verification');
      console.log('   • Comprehensive profile assessment');
      console.log('   • Skills evaluation with personalized results');
      console.log('   • Dashboard with training and mentorship');
    }, 5000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
    
  }, 3000);
});