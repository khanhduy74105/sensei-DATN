import { isAdmin, getDashboardStats } from "@/actions/admin";
import { redirect } from "next/navigation";
import {
  Users,
  CreditCard,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Paid Users",
      value: stats.paidUsers,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Total Resumes",
      value: stats.totalResumes,
      icon: FileText,
      color: "text-purple-500",
    },
    {
      title: "Cover Letters",
      value: stats.totalCoverLetters,
      icon: MessageSquare,
      color: "text-orange-500",
    },
    {
      title: "Assessments",
      value: stats.totalAssessments,
      icon: TrendingUp,
      color: "text-pink-500",
    },
    {
      title: "Mock Interviews",
      value: stats.totalMockInterviews,
      icon: CreditCard,
      color: "text-cyan-500",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          {`Overview of your application's performance`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-900 ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Conversion Rate</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-green-500">
              {stats.conversionRate.toFixed(1)}%
            </span>
            <span className="text-gray-400 mb-1">
              ({stats.paidUsers} / {stats.totalUsers} users)
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Recent Growth</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-blue-500">
              {stats.recentUsers}
            </span>
            <span className="text-gray-400 mb-1">new users (30 days)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {(stats.totalResumes / stats.totalUsers).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Avg Resumes/User</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {(stats.totalCoverLetters / stats.totalUsers).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Avg Cover Letters/User</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {(stats.totalAssessments / stats.totalUsers).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Avg Assessments/User</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {(stats.totalMockInterviews / stats.totalUsers).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Avg Interviews/User</p>
          </div>
        </div>
      </div>
    </div>
  );
}