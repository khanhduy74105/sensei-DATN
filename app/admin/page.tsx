// app/admin/page.tsx
import { db } from "@/lib/prisma";
import DashboardStatsClient from "./_components/dashboard-stats.client";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const user = await currentUser();
  if (user?.publicMetadata.role !== "admin") {
    redirect("/");
  }
  const [
    totalUsers,
    totalResume,
    totalCoverLetter,
    totalMockInterview,
    totalAssessments,
  ] = await Promise.all([
    db.user.count(),
    db.resume.count(),
    db.coverLetter.count(),
    db.liveMockInterview.count(),
    db.assessment.count(),
  ]);

  const totals = {
    users: totalUsers,
    resumes: totalResume,
    coverLetters: totalCoverLetter,
    mockInterviews: totalMockInterview,
    assessments: totalAssessments,
  };

  // Lấy data 7 ngày gần nhất cho từng loại
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  // Map mỗi loại -> array 7 ngày với count mỗi ngày
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDailyCount = async (model: any) => {
    return Promise.all(
      last7Days.map(async (date) => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return model.count({ where: { createdAt: { gte: start, lte: end } } });
      })
    );
  };

  const [userData, resumeData, coverData, mockData, assessmentData] =
    await Promise.all([
      getDailyCount(db.user),
      getDailyCount(db.resume),
      getDailyCount(db.coverLetter),
      getDailyCount(db.liveMockInterview),
      getDailyCount(db.assessment),
    ]);

  return (
    <DashboardStatsClient
      last7Days={last7Days.map((d) => d.toISOString().slice(5, 10))}
      totals={totals}
      data={{
        users: userData,
        resumes: resumeData,
        coverLetters: coverData,
        mockInterviews: mockData,
        assessments: assessmentData,
      }}
    />
  );
}
