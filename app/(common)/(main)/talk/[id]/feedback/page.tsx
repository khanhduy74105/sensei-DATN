import React from "react";
import { getLiveMockInterviewById } from "@/actions/interview";
import CollapsibleFeedback from "../../_components/collapsible-feedback";

interface LivePageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: LivePageProps) {
  const { id } = await params;
  const mockInterview = await getLiveMockInterviewById(id);
  const avgRate = Math.round(
    mockInterview.questions.reduce((sum, q) => sum + (q.rating || 0), 0) / 10
  );
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Congratulation!</h1>
      </div>
      <h3 className="text-xl font-bold">Here is your interview feedbacks</h3>
      <div
        className={`text-sm ${
          avgRate >= mockInterview.questions.length * 0.7
            ? "text-green-600"
            : avgRate >= mockInterview.questions.length * 0.4
            ? "text-yellow-600"
            : "text-red-600"
        } mt-2`}
      >
        Your overall interview rating:{" "}
        <span className="font-bold">
          {avgRate.toFixed(1)}/ {mockInterview.questions.length}
        </span>
      </div>
      <span className="text-xs">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </span>

      <CollapsibleFeedback questions={mockInterview.questions} />
    </div>
  );
}
