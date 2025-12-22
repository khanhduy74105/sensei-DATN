"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";

interface Assessment {
  id: string;
  category: string;
  quizScore: number;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
  };
}

export default function AdminAssessmentsClient({
  assessments,
  currentPage,
}: {
  assessments: Assessment[];
  currentPage: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Assessments</h2>
          <p className="text-gray-400">All assessments taken by users</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Category
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">User</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Score</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Completed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {assessments?.length ? (
              assessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-pink-500" />
                      <span className="font-medium">{assessment.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {assessment.user.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {assessment.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold text-lg ${
                        assessment.quizScore >= 80
                          ? "text-green-500"
                          : assessment.quizScore >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {assessment.quizScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-6 text-gray-400 font-medium"
                >
                  No assessments found.
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
            router.replace(`/admin/assessments?page=${currentPage - 1}`)
          }
        >
          Previous
        </Button>
        <span className="text-gray-300 font-medium">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={(assessments?.length ?? 0) < 20}
          onClick={() =>
            router.replace(`/admin/assessments?page=${currentPage + 1}`)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}