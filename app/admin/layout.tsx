"use client";

import HeaderAdmin from "@/components/header-admin";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Award,
  Video,
  CreditCard,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
  { label: "Payments", href: "/admin/payments", icon: <CreditCard size={18} /> },
  { label: "Resumes", href: "/admin/resumes", icon: <FileText size={18} /> },
  {
    label: "Cover Letters",
    href: "/admin/cover-letters",
    icon: <MessageSquare size={18} />,
  },
  { label: "Assessments", href: "/admin/assessments", icon: <Award size={18} /> },
  {
    label: "Mock Interviews",
    href: "/admin/mock-interviews",
    icon: <Video size={18} />,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col">
      <HeaderAdmin />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width */}
        <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col flex-shrink-0">
          <h1 className="text-2xl font-bold mb-8">Admin</h1>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content - Expands and scrolls */}
        <main className="flex-1 overflow-auto bg-gray-900">{children}</main>
      </div>
    </div>
  );
}