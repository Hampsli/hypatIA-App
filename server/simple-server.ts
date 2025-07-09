import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage
const users: any[] = [];
const otpCodes: any[] = [];

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'hypatIA server is running!' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, currentRole } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
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

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    
    otpCodes.push({
      id: otpCodes.length + 1,
      email,
      code: otp,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    });

    // Log OTP for development
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: 'User registered. Please verify your email with the OTP sent.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
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

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    
    otpCodes.push({
      id: otpCodes.length + 1,
      email,
      code: otp,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    });

    // Log OTP for development
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: 'OTP sent to your email for verification.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP endpoint
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

    // Mark OTP as used
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

// Assessment questions endpoint
app.get('/api/assessment/questions', (req, res) => {
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

// Catch-all handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.json({ message: 'hypatIA API - Frontend not built yet' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`hypatIA server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});