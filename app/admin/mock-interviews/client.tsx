"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";

interface MockInterview {
  id: string;
  role: string;
  yoes: number;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
  };
  LiveInterviewQuestion: {
    rating: number | null;
  }[];
}

export default function AdminMockInterviewsClient({
  mockInterviews,
  currentPage,
}: {
  mockInterviews: MockInterview[];
  currentPage: number;
}) {
  const router = useRouter();

  const calculateAvgRating = (questions: { rating: number | null }[]) => {
    const ratings = questions.filter((q) => q.rating !== null);
    if (ratings.length === 0) return null;
    const sum = ratings.reduce((acc, q) => acc + (q.rating || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Mock Interviews</h2>
          <p className="text-gray-400">All mock interviews conducted by users</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Role</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">User</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Experience
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Questions
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Avg Rating
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {mockInterviews?.length ? (
              mockInterviews.map((interview) => {
                const avgRating = calculateAvgRating(
                  interview.LiveInterviewQuestion
                );
                return (
                  <tr
                    key={interview.id}
                    className="hover:bg-gray-800 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Video size={16} className="text-cyan-500" />
                        <span className="font-medium">{interview.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {interview.user.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {interview.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                        {interview.yoes} {interview.yoes === 1 ? "year" : "years"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {interview.LiveInterviewQuestion.length}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {avgRating ? (
                        <span
                          className={`font-bold ${
                            parseFloat(avgRating) >= 4
                              ? "text-green-500"
                              : parseFloat(avgRating) >= 3
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {avgRating}/5
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-400 font-medium"
                >
                  No mock interviews found.
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
            router.replace(`/admin/mock-interviews?page=${currentPage - 1}`)
          }
        >
          Previous
        </Button>
        <span className="text-gray-300 font-medium">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={(mockInterviews?.length ?? 0) < 20}
          onClick={() =>
            router.replace(`/admin/mock-interviews?page=${currentPage + 1}`)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}