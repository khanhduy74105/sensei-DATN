import { isAdmin, getAssessments } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminAssessmentsClient from "./client";

export default async function AdminAssessmentsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const currentPage = parseInt(searchParams.page || "1");
  const assessments = await getAssessments(currentPage);

  return (
    <AdminAssessmentsClient
      assessments={assessments}
      currentPage={currentPage}
    />
  );
}