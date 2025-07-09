import http from 'http';
import url from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key';

// Simple in-memory storage
const users: any[] = [];
const otpCodes: any[] = [];
const userProfiles: any[] = [];
const assessmentResponses: any[] = [];

const assessmentQuestions = [
  {
    id: 1,
    question: "¿Cómo describirías tu capacidad de comunicación en equipos multidisciplinarios?",
    options: ["Excelente", "Buena", "Regular", "Necesita mejorar"],
    category: "communication",
    order: 1
  },
  {
    id: 2,
    question: "¿Qué tan cómoda te sientes liderando proyectos tecnológicos?",
    options: ["Muy cómoda", "Cómoda", "Algo incómoda", "Muy incómoda"],
    category: "leadership",
    order: 2
  },
  {
    id: 3,
    question: "¿Cómo manejas situaciones de alta presión y deadlines ajustados?",
    options: ["Excelente bajo presión", "Bien con organización", "Con dificultad", "Me estresa mucho"],
    category: "stress_management",
    order: 3
  }
];

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Parse request body
function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Set CORS headers
function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Send JSON response
function sendJSON(res: http.ServerResponse, data: any, statusCode = 200) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Authentication middleware
function verifyToken(authHeader: string | undefined): any {
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  const pathname = parsedUrl.pathname || '';
  const method = req.method || 'GET';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Health check
    if (pathname === '/health' && method === 'GET') {
      sendJSON(res, { status: 'ok', message: 'hypatIA server is running!' });
      return;
    }

    // Register
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { name, email, password, age, currentRole } = body;
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        sendJSON(res, { error: 'Email already registered' }, 400);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        age,
        currentRole,
        isFirstLogin: true,
        createdAt: new Date(),
      };
      
      users.push(user);

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
      
      otpCodes.push({
        id: otpCodes.length + 1,
        email,
        code: otp,
        expiresAt,
        isUsed: false,
        createdAt: new Date(),
      });

      console.log(`🔐 OTP for ${email}: ${otp}`);
      sendJSON(res, { message: 'User registered. Please verify your email with the OTP sent.' });
      return;
    }

    // Login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;
      
      const user = users.find(u => u.email === email);
      if (!user) {
        sendJSON(res, { error: 'Invalid credentials' }, 401);
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        sendJSON(res, { error: 'Invalid credentials' }, 401);
        return;
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
      
      otpCodes.push({
        id: otpCodes.length + 1,
        email,
        code: otp,
        expiresAt,
        isUsed: false,
        createdAt: new Date(),
      });

      console.log(`🔐 OTP for ${email}: ${otp}`);
      sendJSON(res, { message: 'OTP sent to your email for verification.' });
      return;
    }

    // Verify OTP
    if (pathname === '/api/auth/verify-otp' && method === 'POST') {
      const body = await parseBody(req);
      const { email, otp } = body;
      
      const now = new Date();
      const validOtp = otpCodes.find(
        o => o.email === email && 
             o.code === otp && 
             !o.isUsed && 
             o.expiresAt > now
      );
      
      if (!validOtp) {
        sendJSON(res, { error: 'Invalid or expired OTP' }, 400);
        return;
      }

      validOtp.isUsed = true;
      
      const user = users.find(u => u.email === email);
      if (!user) {
        sendJSON(res, { error: 'User not found' }, 404);
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      
      sendJSON(res, { 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          isFirstLogin: user.isFirstLogin 
        } 
      });
      return;
    }

    // Get profile
    if (pathname === '/api/profile' && method === 'GET') {
      const userToken = verifyToken(req.headers.authorization);
      if (!userToken) {
        sendJSON(res, { error: 'Access token required' }, 401);
        return;
      }

      const profile = userProfiles.find(p => p.userId === userToken.id);
      sendJSON(res, profile);
      return;
    }

    // Update profile
    if (pathname === '/api/profile' && method === 'POST') {
      const userToken = verifyToken(req.headers.authorization);
      if (!userToken) {
        sendJSON(res, { error: 'Access token required' }, 401);
        return;
      }

      const body = await parseBody(req);
      const profileData = {
        id: userProfiles.length + 1,
        userId: userToken.id,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const existingProfileIndex = userProfiles.findIndex(p => p.userId === userToken.id);
      
      if (existingProfileIndex !== -1) {
        userProfiles[existingProfileIndex] = { ...userProfiles[existingProfileIndex], ...profileData };
        sendJSON(res, userProfiles[existingProfileIndex]);
      } else {
        userProfiles.push(profileData);
        sendJSON(res, profileData);
      }

      // Mark user as no longer first login
      const userIndex = users.findIndex(u => u.id === userToken.id);
      if (userIndex !== -1) {
        users[userIndex].isFirstLogin = false;
      }
      return;
    }

    // Get assessment questions
    if (pathname === '/api/assessment/questions' && method === 'GET') {
      const userToken = verifyToken(req.headers.authorization);
      if (!userToken) {
        sendJSON(res, { error: 'Access token required' }, 401);
        return;
      }

      sendJSON(res, assessmentQuestions);
      return;
    }

    // Submit assessment responses
    if (pathname === '/api/assessment/responses' && method === 'POST') {
      const userToken = verifyToken(req.headers.authorization);
      if (!userToken) {
        sendJSON(res, { error: 'Access token required' }, 401);
        return;
      }

      const body = await parseBody(req);
      const { responses } = body;
      
      const savedResponses = responses.map((response: any) => ({
        id: assessmentResponses.length + 1,
        userId: userToken.id,
        questionId: response.questionId,
        selectedOption: response.selectedOption,
        createdAt: new Date(),
      }));
      
      assessmentResponses.push(...savedResponses);
      sendJSON(res, savedResponses);
      return;
    }

    // Get assessment responses
    if (pathname === '/api/assessment/responses' && method === 'GET') {
      const userToken = verifyToken(req.headers.authorization);
      if (!userToken) {
        sendJSON(res, { error: 'Access token required' }, 401);
        return;
      }

      const responses = assessmentResponses.filter(r => r.userId === userToken.id);
      sendJSON(res, responses);
      return;
    }

    // Default response
    if (pathname?.startsWith('/api')) {
      sendJSON(res, { error: 'API endpoint not found' }, 404);
    } else {
      sendJSON(res, { message: 'hypatIA API - Frontend available at port 3000' });
    }
  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, { error: 'Internal server error' }, 500);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 hypatIA server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💡 Users registered: ${users.length}`);
});