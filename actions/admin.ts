import { UserRow } from "@/app/admin/type";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return user.publicMetadata.role === "admin";
}

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
      UserCredit: { select: { isPaid: true } }
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
    isPaid: u.UserCredit?.isPaid || undefined
  })) ?? [];
}

