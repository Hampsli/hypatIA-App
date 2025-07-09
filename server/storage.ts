import { 
  User, 
  InsertUser, 
  UserProfile, 
  InsertUserProfile, 
  OtpCode, 
  InsertOtp,
  AssessmentQuestion,
  AssessmentResponse,
  InsertAssessmentResponse
} from '@shared/schema';

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUserFirstLogin(id: number): Promise<void>;
  
  // User profile operations
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // OTP operations
  createOtp(otp: InsertOtp): Promise<OtpCode>;
  getValidOtp(email: string, code: string): Promise<OtpCode | undefined>;
  markOtpAsUsed(id: number): Promise<void>;
  
  // Assessment operations
  getAssessmentQuestions(): Promise<AssessmentQuestion[]>;
  createAssessmentResponse(response: InsertAssessmentResponse): Promise<AssessmentResponse>;
  getUserAssessmentResponses(userId: number): Promise<AssessmentResponse[]>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private userProfiles: UserProfile[] = [];
  private otpCodes: OtpCode[] = [];
  private assessmentQuestions: AssessmentQuestion[] = [
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
  private assessmentResponses: AssessmentResponse[] = [];
  private nextUserId = 1;
  private nextProfileId = 1;
  private nextOtpId = 1;
  private nextResponseId = 1;

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      isFirstLogin: true,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async updateUserFirstLogin(id: number): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex].isFirstLogin = false;
    }
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const profile: UserProfile = {
      id: this.nextProfileId++,
      ...insertProfile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userProfiles.push(profile);
    return profile;
  }

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return this.userProfiles.find(profile => profile.userId === userId);
  }

  async updateUserProfile(userId: number, updates: Partial<InsertUserProfile>): Promise<UserProfile> {
    const profileIndex = this.userProfiles.findIndex(profile => profile.userId === userId);
    if (profileIndex !== -1) {
      this.userProfiles[profileIndex] = {
        ...this.userProfiles[profileIndex],
        ...updates,
        updatedAt: new Date(),
      };
      return this.userProfiles[profileIndex];
    }
    throw new Error('Profile not found');
  }

  async createOtp(insertOtp: InsertOtp): Promise<OtpCode> {
    const otp: OtpCode = {
      id: this.nextOtpId++,
      ...insertOtp,
      isUsed: false,
      createdAt: new Date(),
    };
    this.otpCodes.push(otp);
    return otp;
  }

  async getValidOtp(email: string, code: string): Promise<OtpCode | undefined> {
    const now = new Date();
    return this.otpCodes.find(
      otp => otp.email === email && 
             otp.code === code && 
             !otp.isUsed && 
             otp.expiresAt > now
    );
  }

  async markOtpAsUsed(id: number): Promise<void> {
    const otpIndex = this.otpCodes.findIndex(otp => otp.id === id);
    if (otpIndex !== -1) {
      this.otpCodes[otpIndex].isUsed = true;
    }
  }

  async getAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    return [...this.assessmentQuestions].sort((a, b) => a.order - b.order);
  }

  async createAssessmentResponse(insertResponse: InsertAssessmentResponse): Promise<AssessmentResponse> {
    const response: AssessmentResponse = {
      id: this.nextResponseId++,
      ...insertResponse,
      createdAt: new Date(),
    };
    this.assessmentResponses.push(response);
    return response;
  }

  async getUserAssessmentResponses(userId: number): Promise<AssessmentResponse[]> {
    return this.assessmentResponses.filter(response => response.userId === userId);
  }
}

export const storage = new MemStorage();