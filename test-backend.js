// Quick backend test script
const https = require('https');

const testData = {
  name: "María Test",
  email: "test@example.com", 
  password: "password123",
  age: 28,
  currentRole: "Developer"
};

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000'
  }
};

console.log('🧪 Testing backend API...');

const req = require('http').request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📤 Response:`, data);
    if (res.statusCode === 200) {
      console.log('✅ Backend API is working correctly!');
    } else {
      console.log('❌ Backend API issue detected');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(JSON.stringify(testData));
req.end();