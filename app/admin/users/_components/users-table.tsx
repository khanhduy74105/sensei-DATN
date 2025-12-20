"use client";

import React from "react";
import { UserRow } from "../../type";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";

const AdminUsersPageClient = ({
  users,
  currentPage,
}: {
  users: UserRow[];
  currentPage: number;
}) => {
  const router = useRouter();

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen space-y-6">
      <h2 className="text-3xl font-bold mb-4">Users</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Avatar</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Upgraded</th>
              <th className="px-4 py-3 text-center">Resumes</th>
              <th className="px-4 py-3 text-center">Cover Letters</th>
              <th className="px-4 py-3 text-center">Assessments</th>
              <th className="px-4 py-3 text-center">Mock Interviews</th>
              <th className="px-4 py-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users?.length ? (
              [...users].map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
                      {user.imageUrl ? (
                        <Image
                          alt={`user avatar ${user.id}`}
                          width={40}
                          height={40}
                          src={user.imageUrl}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-700 text-gray-300">
                          {user.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.name || "-"}</td>
                  <td className="px-4 py-2 flex justify-center items-center">
                    {user.isPaid ? <CheckCircle color="green" /> : <X />}
                  </td>
                  <td className="px-4 py-2 text-center">{user.resumeCount}</td>
                  <td className="px-4 py-2 text-center">
                    {user.coverLetterCount}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {user.assessmentCount}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {user.mockInterviewCount}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-6 text-gray-400 font-medium"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => router.replace(`/admin/users?page=${currentPage - 1}`)}
        >
          Previous
        </Button>
        <span className="text-gray-300 font-medium">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={(users?.length ?? 0) < 20}
          onClick={() => router.replace(`/admin/users?page=${currentPage + 1}`)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdminUsersPageClient;
