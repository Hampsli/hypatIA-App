const { spawn } = require('child_process');

console.log('Starting hypatIA application...');

// Start backend
const backend = spawn('npx', ['tsx', 'server/http-server.ts'], {
  stdio: 'inherit'
});

// Start frontend after 3 seconds
setTimeout(() => {
  const frontend = spawn('npx', ['vite'], {
    cwd: './client',
    stdio: 'inherit'
  });
  
  console.log('Application started:');
  console.log('- Backend: http://localhost:3001');
  console.log('- Frontend: http://localhost:3000');
}, 3000);

process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});