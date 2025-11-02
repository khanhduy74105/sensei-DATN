import React from "react";
import CollapsibleQuestion from "../../_components/collapsible-question";
import { Button } from "@/components/ui/button";
import { getLiveMockInterviewById } from "@/actions/interview";

interface LivePageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: LivePageProps) {
  const { id } = await params;
  const mockInterview = await getLiveMockInterviewById(id);
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Congratulation!</h1>
      </div>
      <h3 className="text-xl font-bold">Here is your interview feedbacks</h3>
      <div className="text-sm text-green-400">
        Your overall interview rating:{" "}
        <span className="font-bold">
          {Math.round(
            mockInterview.questions.reduce(
              (sum, q) => sum + (q.rating || 0),
              0
            ) / mockInterview.questions.length
          )}
          /10
        </span>
      </div>
      <span className="text-xs">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </span>

      <div className="flex flex-col gap-2 pt-3">
        {mockInterview.questions.map((q) => (
          <CollapsibleQuestion key={q.id} question={q} />
        ))}
      </div>
      <Button className="mt-6">Back</Button>
    </div>
  );
}
