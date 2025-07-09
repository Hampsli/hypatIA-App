import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage
const users: any[] = [];
const otpCodes: any[] = [];
const userProfiles: any[] = [];
const assessmentResponses: any[] = [];

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'hypatIA server is running!' });
});

// API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, currentRole } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
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
    res.json({ message: 'User registered. Please verify your email with the OTP sent.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
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
    res.json({ message: 'OTP sent to your email for verification.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const now = new Date();
    const validOtp = otpCodes.find(
      o => o.email === email && 
           o.code === otp && 
           !o.isUsed && 
           o.expiresAt > now
    );
    
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    validOtp.isUsed = true;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isFirstLogin: user.isFirstLogin 
      } 
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/profile', authenticateToken, (req: any, res) => {
  const profile = userProfiles.find(p => p.userId === req.user.id);
  res.json(profile);
});

app.post('/api/profile', authenticateToken, (req: any, res) => {
  try {
    const profileData = {
      id: userProfiles.length + 1,
      userId: req.user.id,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const existingProfileIndex = userProfiles.findIndex(p => p.userId === req.user.id);
    
    if (existingProfileIndex !== -1) {
      userProfiles[existingProfileIndex] = { ...userProfiles[existingProfileIndex], ...profileData };
      res.json(userProfiles[existingProfileIndex]);
    } else {
      userProfiles.push(profileData);
      res.json(profileData);
    }

    // Mark user as no longer first login
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
      users[userIndex].isFirstLogin = false;
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessment/questions', authenticateToken, (req, res) => {
  const questions = [
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
  
  res.json(questions);
});

app.post('/api/assessment/responses', authenticateToken, (req: any, res) => {
  try {
    const { responses } = req.body;
    
    const savedResponses = responses.map((response: any) => ({
      id: assessmentResponses.length + 1,
      userId: req.user.id,
      questionId: response.questionId,
      selectedOption: response.selectedOption,
      createdAt: new Date(),
    }));
    
    assessmentResponses.push(...savedResponses);
    res.json(savedResponses);
  } catch (error) {
    console.error('Assessment responses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessment/responses', authenticateToken, (req: any, res) => {
  const responses = assessmentResponses.filter(r => r.userId === req.user.id);
  res.json(responses);
});

// Serve static files from client dist (for production)
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));

// Handle client-side routing (for production)
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// API 404 handler
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Frontend fallback (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 hypatIA server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💡 Users registered: ${users.length}`);
});