export interface IQuizQuestion {
  answer: string;
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  explanation: string;
}

export interface IQuizResult {
  id: string;
  userId: string;
  quizScore: number;
  questions: QuizQuestion[];
  category: string;
  improvementTip: string;
  createdAt: string; // hoặc Date nếu bạn parse
  updatedAt: string; // hoặc Date nếu bạn parse
}

export interface IAssessmentQuestion {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation?: string; // optional, vì có thể không phải câu nào cũng có
}

export interface IAssessment {
  id: string;
  userId: string;
  quizScore: number;
  questions: AssessmentQuestion[]; // Json[] trong Prisma → mảng object
  category: string; // "Technical", "Behavioral", etc.
  improvementTip?: string; // optional (nullable trong Prisma)
  createdAt: Date;
  updatedAt: Date;
}

export interface ICoverLetter {
  id: string;
  userId: string;
  content: string;
  jobDescription?: string | null;
  companyName: string;
  jobTitle: string;
  // status: "draft" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ILiveMockInterview {
  id: string;
  userId: string;
  role: string;
  description: string;
  yoes: string;
  createdAt: Date;
  updatedAt: Date;
  questions: LiveQuizQuestion[];
}

export interface ILiveQuizQuestion {
  id: string,
  question: string,
  correctAnswer: string,
  userAnswer: string,
  feedback: string,
  rating: number
}