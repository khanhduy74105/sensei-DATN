import { isAdmin, getMockInterviews } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminMockInterviewsClient from "./client";

export default async function AdminMockInterviewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const currentPage = parseInt(searchParams.page || "1");
  const mockInterviews = await getMockInterviews(currentPage);

  return (
    <AdminMockInterviewsClient
      mockInterviews={mockInterviews}
      currentPage={currentPage}
    />
  );
}