const { spawn } = require('child_process');

console.log('🔧 Starting hypatIA frontend...');

// Start frontend with Vite
const frontend = spawn('npx vite --host 0.0.0.0 --port 3000', [], {
  cwd: './client',
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
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
  console.log('✅ Frontend is running!');
  console.log('🌐 Access the app at http://localhost:3000');
  console.log('');
}, 2000);