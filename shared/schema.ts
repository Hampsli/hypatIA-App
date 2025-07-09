import { text, integer, pgTable, serial, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  age: integer('age').notNull(),
  currentRole: text('current_role').notNull(),
  isFirstLogin: boolean('is_first_login').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// User profiles table for detailed information
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  gender: text('gender'),
  cvPath: text('cv_path'),
  
  // Caregiver information
  isCaregiver: boolean('is_caregiver'),
  caregivingHoursPerWeek: text('caregiving_hours_per_week'),
  
  // Educational information
  initialEducation: text('initial_education'), // Medio Superior, Superior, Posgrado
  higherEducationArea: text('higher_education_area'),
  technologyLanguage: text('technology_language'),
  
  // Professional information
  yearsOfExperience: text('years_of_experience'),
  startedInTech: text('started_in_tech'),
  currentPosition: text('current_position'),
  workMode: text('work_mode'), // presencial, remoto, híbrido
  salaryRange: text('salary_range'),
  reasonsForMovement: text('reasons_for_movement').array(),
  expectedSalary: text('expected_salary'),
  hasCompletedCourses: boolean('has_completed_courses'),
  projectsBuilt: integer('projects_built'),
  
  // Expectations
  lastFeedback: text('last_feedback'),
  desiredPosition: text('desired_position'),
  targetJobs: text('target_jobs').array(),
  dailyTasks: text('daily_tasks'),
  softSkills: text('soft_skills'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// OTP codes for email verification
export const otpCodes = pgTable('otp_codes', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Assessment questions
export const assessmentQuestions = pgTable('assessment_questions', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  options: text('options').array().notNull(),
  category: text('category').notNull(),
  order: integer('order').notNull(),
});

// User assessment responses
export const assessmentResponses = pgTable('assessment_responses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  questionId: integer('question_id').references(() => assessmentQuestions.id).notNull(),
  selectedOption: text('selected_option').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOtpSchema = createInsertSchema(otpCodes).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type OtpCode = typeof otpCodes.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;