import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { storage } from './storage';
import { insertUserSchema, insertUserProfileSchema, insertAssessmentResponseSchema } from '@shared/schema';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Email configuration (using a mock transporter for development)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// Middleware to verify JWT
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

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email: string, otp: string) {
  try {
    // In development, just log the OTP
    console.log(`OTP for ${email}: ${otp}`);
    
    // Uncomment for real email sending
    /*
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'hypatIA - Código de verificación',
      html: `
        <h2>Tu código de verificación</h2>
        <p>Tu código de acceso a hypatIA es: <strong>${otp}</strong></p>
        <p>Este código expira en 2 minutos.</p>
      `
    });
    */
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

// Register user
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, currentRole } = insertUserSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await storage.createUser({
      name,
      email,
      password: hashedPassword,
      age,
      currentRole
    });

    // Generate and send OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    
    await storage.createOtp({ email, code: otp, expiresAt });
    await sendOTPEmail(email, otp);

    res.json({ message: 'User registered. Please verify your email with the OTP sent.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP and login
router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const validOtp = await storage.getValidOtp(email, otp);
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await storage.markOtpAsUsed(validOtp.id);
    
    const user = await storage.getUserByEmail(email);
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and send OTP for login
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    
    await storage.createOtp({ email, code: otp, expiresAt });
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email for verification.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await storage.getUserProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create/Update user profile
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const profileData = insertUserProfileSchema.parse({
      ...req.body,
      userId: req.user.id
    });
    
    const existingProfile = await storage.getUserProfile(req.user.id);
    
    let profile;
    if (existingProfile) {
      profile = await storage.updateUserProfile(req.user.id, profileData);
    } else {
      profile = await storage.createUserProfile(profileData);
    }

    // Mark user as no longer first login
    await storage.updateUserFirstLogin(req.user.id);
    
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessment questions
router.get('/assessment/questions', authenticateToken, async (req, res) => {
  try {
    const questions = await storage.getAssessmentQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit assessment responses
router.post('/assessment/responses', authenticateToken, async (req, res) => {
  try {
    const { responses } = req.body;
    
    const savedResponses = [];
    for (const response of responses) {
      const responseData = insertAssessmentResponseSchema.parse({
        ...response,
        userId: req.user.id
      });
      const saved = await storage.createAssessmentResponse(responseData);
      savedResponses.push(saved);
    }
    
    res.json(savedResponses);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's assessment responses
router.get('/assessment/responses', authenticateToken, async (req, res) => {
  try {
    const responses = await storage.getUserAssessmentResponses(req.user.id);
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;