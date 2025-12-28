"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MessageSquare, Eye } from "lucide-react";

interface CoverLetter {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
  };
}

export default function AdminCoverLettersClient({
  coverLetters,
  currentPage,
}: {
  coverLetters: CoverLetter[];
  currentPage: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Cover Letters</h2>
          <p className="text-gray-400">All cover letters created by users</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Job Title
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Company</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">User</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {coverLetters?.length ? (
              coverLetters.map((letter) => (
                <tr
                  key={letter.id}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-orange-500" />
                      <span className="font-medium">{letter.jobTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {letter.companyName}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {letter.user.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {letter.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        letter.status === "draft"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-green-900 text-green-300"
                      }`}
                    >
                      {letter.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-400 font-medium"
                >
                  No cover letters found.
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
          onClick={() =>
            router.replace(`/admin/cover-letters?page=${currentPage - 1}`)
          }
        >
          Previous
        </Button>
        <span className="text-gray-300 font-medium">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={(coverLetters?.length ?? 0) < 20}
          onClick={() =>
            router.replace(`/admin/cover-letters?page=${currentPage + 1}`)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}