"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DashboardStatsClientProps {
  last7Days: string[]; // ["12-13", "12-14", ...]
  data: {
    users: number[];
    resumes: number[];
    coverLetters: number[];
    mockInterviews: number[];
    assessments: number[];
  };
  totals: {
    users: number;
    resumes: number;
    coverLetters: number;
    mockInterviews: number;
    assessments: number;
  };
}

const typeOptions: { label: string; key: keyof DashboardStatsClientProps["data"]; color: string }[] =
  [
    { label: "Users", key: "users", color: "bg-blue-600" },
    { label: "Resumes", key: "resumes", color: "bg-green-600" },
    { label: "Cover Letters", key: "coverLetters", color: "bg-purple-600" },
    { label: "Mock Interviews", key: "mockInterviews", color: "bg-pink-600" },
    { label: "Assessments", key: "assessments", color: "bg-yellow-600" },
  ];

export default function DashboardStatsClient({ last7Days, data, totals }: DashboardStatsClientProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof data>("users");
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    setChartData(
      last7Days.map((date, idx) => ({
        date,
        value: data[selectedType][idx] ?? 0,
      }))
    );
  }, [selectedType, data, last7Days]);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {typeOptions.map((opt) => (
          <StatCard
            key={opt.key}
            title={opt.label}
            value={totals[opt.key]}
            color={opt.color}
            isSelected={selectedType === opt.key}
            onClick={() => setSelectedType(opt.key)}
          />
        ))}
      </div>

      {/* Line Chart */}
      <Card className="bg-gray-900 text-white mt-6">
        <CardHeader>
          <CardTitle>{typeOptions.find((o) => o.key === selectedType)?.label} Trend</CardTitle>
          <CardDescription>Daily counts over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: "#d1d5db" }} />
                  <YAxis stroke="#9ca3af" tick={{ fill: "#d1d5db" }} />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-md text-white">
                          <p className="text-sm font-medium">
                            {typeOptions.find((o) => o.key === selectedType)?.label}: {payload[0].value}
                          </p>
                          <p className="text-xs text-gray-400">{payload[0].payload.date}</p>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  isSelected,
  onClick,
}: {
  title: string;
  value: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={`p-6 text-white shadow-md cursor-pointer hover:shadow-xl transition-shadow ${
        isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""
      } ${color}`}
      onClick={onClick}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </Card>
  );
}
