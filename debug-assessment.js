// Debug script to test assessment flow
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

async function testAssessmentFlow() {
  console.log('🧪 Testing Assessment API Flow...\n');

  // 1. Test health
  console.log('1. Testing health endpoint...');
  try {
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Data: ${JSON.stringify(health.data)}\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // 2. Test assessment questions without token
  console.log('2. Testing assessment questions (no token)...');
  try {
    const noToken = await makeRequest('/api/assessment/questions');
    console.log(`   Status: ${noToken.status}`);
    console.log(`   Data: ${JSON.stringify(noToken.data)}\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // 3. Test registration
  console.log('3. Testing user registration...');
  try {
    const register = await makeRequest('/api/auth/register', 'POST', {
      name: 'Debug User',
      email: 'debug@test.com',
      password: 'password123',
      age: 25,
      currentRole: 'Tester'
    });
    console.log(`   Status: ${register.status}`);
    console.log(`   Data: ${JSON.stringify(register.data)}\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // 4. Test login  
  console.log('4. Testing login...');
  try {
    const login = await makeRequest('/api/auth/login', 'POST', {
      email: 'debug@test.com',
      password: 'password123'
    });
    console.log(`   Status: ${login.status}`);
    console.log(`   Data: ${JSON.stringify(login.data)}`);
    
    if (login.data.token) {
      console.log(`   Token obtained: ${login.data.token.substring(0, 30)}...\n`);
      
      // 5. Test assessment questions with token
      console.log('5. Testing assessment questions (with token)...');
      const withToken = await makeRequest('/api/assessment/questions', 'GET', null, login.data.token);
      console.log(`   Status: ${withToken.status}`);
      console.log(`   Data: ${JSON.stringify(withToken.data, null, 2)}\n`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }
}

testAssessmentFlow().catch(console.error);