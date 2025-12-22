import { isAdmin, getResumes } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminResumesClient from "./client";

export default async function AdminResumesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const currentPage = parseInt(searchParams.page || "1");
  const resumes = await getResumes(currentPage);

  return <AdminResumesClient resumes={resumes} currentPage={currentPage} />;
}