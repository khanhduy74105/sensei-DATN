export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: string;
  resumeCount: number;
  coverLetterCount: number;
  assessmentCount: number;
  mockInterviewCount: number;
  isPaid?: boolean
}