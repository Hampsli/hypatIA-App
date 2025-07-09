#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting hypatIA Application');
console.log('================================');

// Kill any existing processes
const killProcesses = spawn('pkill', ['-f', 'tsx|vite'], { stdio: 'ignore' });

killProcesses.on('close', () => {
  // Start backend server
  console.log('📡 Starting backend server on port 3001...');
  const backend = spawn('npx', ['tsx', 'server/http-server.ts'], {
    cwd: __dirname,
    stdio: 'inherit',
    detached: false
  });

  // Give backend time to start
  setTimeout(() => {
    // Start frontend server
    console.log('🌐 Starting frontend server on port 3000...');
    const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
      cwd: path.join(__dirname, 'client'),
      stdio: 'inherit',
      detached: false
    });

    console.log('');
    console.log('✅ Application started successfully!');
    console.log('📋 Backend API: http://localhost:3001');
    console.log('🌐 Frontend App: http://localhost:3000'); 
    console.log('');
    console.log('📝 hypatIA Features:');
    console.log('   ✓ Modern landing page for women in STEM');
    console.log('   ✓ Complete authentication with OTP verification');
    console.log('   ✓ Comprehensive 5-section profile form');
    console.log('   ✓ Assessment carousel with power skills questions');
    console.log('   ✓ Dashboard with Assessment, Training, Mentorship');

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

    // Keep the main process alive
    backend.on('close', (code) => {
      if (code !== 0) {
        console.error(`Backend process exited with code ${code}`);
      }
    });

    frontend.on('close', (code) => {
      if (code !== 0) {
        console.error(`Frontend process exited with code ${code}`);
      }
    });
  }, 3000);
});