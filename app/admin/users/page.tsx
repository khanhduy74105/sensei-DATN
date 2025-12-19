import { getUsers } from "@/actions/admin";
import AdminUsersPageClient from "./_components/users-table";

export default async function AdminUsersPageServer({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = "1" } = await searchParams;
  let currentPage = 1;
  try {
    currentPage = parseInt(`${page}`);
  } catch (error) {}

  const users = await getUsers(parseInt(`${page}`));

  return <AdminUsersPageClient users={users} currentPage={currentPage} />;
}
