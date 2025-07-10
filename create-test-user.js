// Quick script to create a test user with valid authentication
const http = require('http');

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function createTestUser() {
  console.log('Creating test user for assessment...\n');

  // Register user
  const register = await makeRequest('/api/auth/register', 'POST', {
    name: 'Assessment Test User',
    email: 'assessment@test.com',
    password: 'test123',
    age: 28,
    currentRole: 'Software Engineer'
  });
  
  console.log('Registration:', register.status, register.data);
  
  if (register.status === 200) {
    // Try to get OTP (this will be printed in backend logs)
    await makeRequest('/api/auth/login', 'POST', {
      email: 'assessment@test.com',
      password: 'test123'
    });
    
    console.log('\n🔑 Check backend logs for OTP code');
    console.log('Then verify with: curl -X POST -H "Content-Type: application/json" -d \'{"email":"assessment@test.com","otp":"YOUR_OTP"}\' http://localhost:3001/api/auth/verify-otp');
  }
}

createTestUser().catch(console.error);