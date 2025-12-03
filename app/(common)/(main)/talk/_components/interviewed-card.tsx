"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ILiveMockInterview } from "@/types";
import { useRouter } from "next/navigation";

const InterviewedCard = ({
  interviewData,
}: {
  interviewData: ILiveMockInterview;
}) => {
  const router = useRouter();
  return (
    <div className="basis-1/3 p-2">
      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <CardTitle className="text-xl font-bold">
            {interviewData.role}
          </CardTitle>
          <CardTitle className="text-m font-medium">
            {interviewData.description}
          </CardTitle>
          <CardTitle className="text-sm font-medium text-gray-500">
            {interviewData.createdAt.toDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-12"
              onClick={() => {
                router.push(`/talk/${interviewData.id}/feedback`);
              }}
            >
              Feedbacks
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 h-12"
              onClick={() => {
                router.push(`/talk/${interviewData.id}/live`);
              }}
            >
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewedCard;
