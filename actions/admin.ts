import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Types
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
  isPaid?: boolean;
  industry: string | null;
  experience: number | null;
}

export interface PaymentRow {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string;
  isPaid: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
}

export interface DashboardStats {
  totalUsers: number;
  paidUsers: number;
  totalResumes: number;
  totalCoverLetters: number;
  totalAssessments: number;
  totalMockInterviews: number;
  recentUsers: number; // last 30 days
  conversionRate: number;
}

// Auth check
export async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return user.publicMetadata.role === "admin";
}

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    paidUsers,
    totalResumes,
    totalCoverLetters,
    totalAssessments,
    totalMockInterviews,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.userCredit.count({ where: { isPaid: true } }),
    db.resume.count(),
    db.coverLetter.count(),
    db.assessment.count(),
    db.liveMockInterview.count(),
    db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

  return {
    totalUsers,
    paidUsers,
    totalResumes,
    totalCoverLetters,
    totalAssessments,
    totalMockInterviews,
    recentUsers,
    conversionRate,
  };
}

// Users
export async function getUsers(page: number = 1): Promise<UserRow[]> {
  const take = 20;
  const skip = (page - 1) * take;

  const users = await db.user.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      resume: { select: { id: true } },
      coverLetter: { select: { id: true } },
      assessments: { select: { id: true } },
      liveMockInterviews: { select: { id: true } },
      UserCredit: { select: { isPaid: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    imageUrl: u.imageUrl,
    createdAt: u.createdAt.toISOString(),
    resumeCount: u.resume.length,
    coverLetterCount: u.coverLetter.length,
    assessmentCount: u.assessments.length,
    mockInterviewCount: u.liveMockInterviews.length,
    isPaid: u.UserCredit?.isPaid || false,
    industry: u.industry,
    experience: u.experience,
  }));
}

export async function searchUsers(query: string): Promise<UserRow[]> {
  const users = await db.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 20,
    include: {
      resume: { select: { id: true } },
      coverLetter: { select: { id: true } },
      assessments: { select: { id: true } },
      liveMockInterviews: { select: { id: true } },
      UserCredit: { select: { isPaid: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    imageUrl: u.imageUrl,
    createdAt: u.createdAt.toISOString(),
    resumeCount: u.resume.length,
    coverLetterCount: u.coverLetter.length,
    assessmentCount: u.assessments.length,
    mockInterviewCount: u.liveMockInterviews.length,
    isPaid: u.UserCredit?.isPaid || false,
    industry: u.industry,
    experience: u.experience,
  }));
}

export async function getUserDetails(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      resume: {
        select: {
          id: true,
          title: true,
          atsScore: true,
          createdAt: true,
          template: true,
        },
        orderBy: { createdAt: "desc" },
      },
      coverLetter: {
        select: {
          id: true,
          jobTitle: true,
          companyName: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      assessments: {
        select: {
          id: true,
          category: true,
          quizScore: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      liveMockInterviews: {
        select: {
          id: true,
          role: true,
          yoes: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      UserCredit: true,
    },
  });

  return user;
}

// Payments
export async function getPayments(page: number = 1): Promise<PaymentRow[]> {
  const take = 20;
  const skip = (page - 1) * take;

  const payments = await db.userCredit.findMany({
    skip,
    take,
    orderBy: { updatedAt: "desc" },
    include: {
      User: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return payments.map((p) => ({
    id: p.id,
    userId: p.userId,
    userName: p.User.name,
    userEmail: p.User.email,
    isPaid: p.isPaid || false,
    balance: p.balance,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    metadata: p.metadata,
  }));
}

export async function updateUserCredit(
  userId: string,
  balance: number,
  isPaid: boolean
) {
  return await db.userCredit.update({
    where: { userId },
    data: { balance, isPaid },
  });
}

// Resumes
export async function getResumes(page: number = 1) {
  const take = 20;
  const skip = (page - 1) * take;

  return await db.resume.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getResumeDetails(resumeId: string) {
  return await db.resume.findUnique({
    where: { id: resumeId },
    include: {
      user: true,
      personalInfo: true,
      experiences: true,
      educations: true,
      projects: true,
    },
  });
}

// Cover Letters
export async function getCoverLetters(page: number = 1) {
  const take = 20;
  const skip = (page - 1) * take;

  return await db.coverLetter.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
}

// Assessments
export async function getAssessments(page: number = 1) {
  const take = 20;
  const skip = (page - 1) * take;

  return await db.assessment.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
}

// Mock Interviews
export async function getMockInterviews(page: number = 1) {
  const take = 20;
  const skip = (page - 1) * take;

  return await db.liveMockInterview.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      LiveInterviewQuestion: {
        select: {
          rating: true,
        },
      },
    },
  });
}

// Analytics
export async function getGrowthData() {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  const usersByDay = await db.user.groupBy({
    by: ["createdAt"],
    _count: true,
    where: {
      createdAt: {
        gte: new Date(last30Days[0]),
      },
    },
  });

  return last30Days.map((date) => {
    const count = usersByDay.filter(
      (u) => u.createdAt.toISOString().split("T")[0] === date
    ).length;
    return { date, count };
  });
}

export async function getIndustryDistribution() {
  const industries = await db.user.groupBy({
    by: ["industry"],
    _count: true,
    where: {
      industry: { not: null },
    },
  });

  return industries.map((i) => ({
    industry: i.industry || "Unknown",
    count: i._count,
  }));
}