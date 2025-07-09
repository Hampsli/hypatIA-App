# hypatIA - Skills Management Platform for Women in STEM

## Overview

hypatIA is a comprehensive skills management and gap analysis platform specifically designed for women in STEM fields. Named after Hypatia of Alexandria, the first woman mathematician, this application provides personalized assessments, development plans, and mentorship connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Architecture Type**: Fullstack JavaScript Application
- Frontend: React with TypeScript, Tailwind CSS, Wouter routing
- Backend: Express.js with TypeScript
- Database: In-memory storage (MemStorage) with Drizzle ORM schema
- Authentication: JWT with email OTP verification

**Key Architectural Decisions**:
- Fullstack TypeScript for consistency
- Component-based UI with custom design system
- RESTful API design
- Email-based authentication with 2-minute OTP expiry
- Responsive, mobile-first design

## Key Components

### Frontend
- Framework: React 19 with TypeScript
- Routing: Wouter for client-side navigation
- State management: React Context + TanStack Query
- Styling: Tailwind CSS with custom design tokens
- Forms: React Hook Form with Zod validation
- UI Components: Custom component library

### Backend
- Server: Express.js with TypeScript
- Authentication: JWT tokens with bcrypt password hashing
- Email: Nodemailer for OTP delivery
- Validation: Zod schemas for API endpoints
- Storage: In-memory implementation of IStorage interface

### Database Schema
- Users: Basic auth and profile information
- UserProfiles: Comprehensive career and skills data
- OtpCodes: Email verification system
- AssessmentQuestions: Evaluation framework
- AssessmentResponses: User evaluation results

## Application Flow

1. **Landing Page**: Modern, minimalist design showcasing platform benefits
2. **Registration**: Multi-step form with privacy notice and email verification
3. **Profile Setup**: Comprehensive questionnaire covering:
   - Personal identification and CV upload
   - Caregiver responsibilities consideration
   - Educational background and technical skills
   - Professional experience and career goals
   - Soft skills and development expectations
4. **Assessment**: Interactive carousel with 3 power skills questions
5. **Dashboard**: Three-section navigation (Assessment, Training, Mentorship)

## Data Integrity Features

- Email OTP verification for all authentication
- Comprehensive profile validation
- Privacy-focused data collection with explicit consent
- Consideration of work-life balance factors for women in STEM

## Recent Changes

- ✓ Complete application structure created (July 9, 2024)
- ✓ Authentication system with OTP verification implemented
- ✓ Multi-section profile form with all requested fields
- ✓ Assessment carousel system built
- ✓ Dashboard with three main sections (Assessment, Training, Mentorship)
- ✓ Resolved Express.js routing issues by implementing custom HTTP server
- ✓ Created working backend API with all authentication and data endpoints
- ✓ Added comprehensive test scripts and development environment setup

## Current Status

Application development is COMPLETE and FUNCTIONAL. All core features implemented:
- Backend API running on Node.js HTTP server (port 3001)
- Frontend React application with Vite dev server (port 3000)
- Full authentication flow with email OTP verification
- Complete user onboarding process
- Assessment system with multiple choice questions
- Dashboard with three main sections

To start the application, run: `./start-app.sh`