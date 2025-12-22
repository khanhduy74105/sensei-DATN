"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, Eye } from "lucide-react";

interface Resume {
  id: string;
  title: string | null;
  atsScore: number | null;
  template: string | null;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
  };
}

export default function AdminResumesClient({
  resumes,
  currentPage,
}: {
  resumes: Resume[];
  currentPage: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Resumes</h2>
          <p className="text-gray-400">All resumes created by users</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Title</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">User</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                ATS Score
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Template
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Created</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {resumes?.length ? (
              resumes.map((resume) => (
                <tr
                  key={resume.id}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-purple-500" />
                      <span className="font-medium">
                        {resume.title || "Untitled Resume"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {resume.user.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {resume.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {resume.atsScore ? (
                      <span className="font-semibold">{resume.atsScore}%</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {resume.template || "classic"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        router.push(`/admin/resumes/${resume.id}`)
                      }
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-400 font-medium"
                >
                  No resumes found.
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
            router.replace(`/admin/resumes?page=${currentPage - 1}`)
          }
        >
          Previous
        </Button>
        <span className="text-gray-300 font-medium">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={(resumes?.length ?? 0) < 20}
          onClick={() =>
            router.replace(`/admin/resumes?page=${currentPage + 1}`)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}