import { isAdmin, getCoverLetters } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminCoverLettersClient from "./client";

export default async function AdminCoverLettersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const currentPage = parseInt(searchParams.page || "1");
  const coverLetters = await getCoverLetters(currentPage);

  return (
    <AdminCoverLettersClient
      coverLetters={coverLetters}
      currentPage={currentPage}
    />
  );
}