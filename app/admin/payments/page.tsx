import { isAdmin, getPayments } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminPaymentsClient from "./client";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const currentPage = parseInt(searchParams.page || "1");
  const payments = await getPayments(currentPage);

  return <AdminPaymentsClient payments={payments} currentPage={currentPage} />;
}