import { isAdmin, getUserDetails } from "@/actions/admin";
import { redirect } from "next/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, MessageSquare, Award, Video, Coins, CheckCircle, X } from "lucide-react";

export default async function UserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const user = await getUserDetails(params.id);
  if (!user) notFound();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-gray-400">Complete user information and activity</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 flex-shrink-0">
            {user.imageUrl ? (
              <Image
                alt={`${user.name} avatar`}
                width={96}
                height={96}
                src={user.imageUrl}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-700 text-gray-300 text-3xl font-bold">
                {user.name?.[0] || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold">{user.name || "Unknown"}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-sm text-gray-400">Industry</p>
                <p className="font-medium">{user.industry || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Experience</p>
                <p className="font-medium">
                  {user.experience ? `${user.experience} years` : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Joined</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {user.bio && (
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Bio</p>
                <p className="text-gray-200">{user.bio}</p>
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="pt-4">
                <p className="text-sm text-gray-400 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Info */}
      {user.UserCredit && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Coins className="text-yellow-500" />
            Credit Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                {user.UserCredit.isPaid ? (
                  <>
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="font-semibold text-green-500">Paid User</span>
                  </>
                ) : (
                  <>
                    <X size={20} className="text-gray-400" />
                    <span className="font-semibold text-gray-400">Free User</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Credit Balance</p>
              <p className="text-2xl font-bold">{user.UserCredit.balance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Updated</p>
              <p className="font-medium">
                {new Date(user.UserCredit.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-purple-500" size={24} />
            <h4 className="font-semibold">Resumes</h4>
          </div>
          <p className="text-3xl font-bold">{user.resume.length}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-orange-500" size={24} />
            <h4 className="font-semibold">Cover Letters</h4>
          </div>
          <p className="text-3xl font-bold">{user.coverLetter.length}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-pink-500" size={24} />
            <h4 className="font-semibold">Assessments</h4>
          </div>
          <p className="text-3xl font-bold">{user.assessments.length}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Video className="text-cyan-500" size={24} />
            <h4 className="font-semibold">Mock Interviews</h4>
          </div>
          <p className="text-3xl font-bold">{user.liveMockInterviews.length}</p>
        </div>
      </div>

      {/* Recent Resumes */}
      {user.resume.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Recent Resumes</h3>
          <div className="space-y-3">
            {user.resume.slice(0, 5).map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="font-medium">{resume.title || "Untitled Resume"}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(resume.createdAt).toLocaleDateString()} • Template:{" "}
                    {resume.template}
                  </p>
                </div>
                {resume.atsScore && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">ATS Score</p>
                    <p className="font-bold text-lg">{resume.atsScore}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Cover Letters */}
      {user.coverLetter.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Recent Cover Letters</h3>
          <div className="space-y-3">
            {user.coverLetter.slice(0, 5).map((letter) => (
              <div
                key={letter.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {letter.jobTitle} at {letter.companyName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    letter.status === "draft"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-green-900 text-green-300"
                  }`}
                >
                  {letter.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Assessments */}
      {user.assessments.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Recent Assessments</h3>
          <div className="space-y-3">
            {user.assessments.slice(0, 5).map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="font-medium">{assessment.category}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Score</p>
                  <p className="font-bold text-lg">{assessment.quizScore}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}