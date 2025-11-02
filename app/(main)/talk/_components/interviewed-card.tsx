import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function InterviewedCard() {
  return (
    <div className="basis-1/3 p-2">
      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <CardTitle className="text-xl font-bold">Title</CardTitle>
          <CardTitle className="text-m font-medium">Title</CardTitle>
          <CardTitle className="text-sm font-medium text-gray-500">Created at 2025/5/10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" size="sm" className="flex-1 h-12">
              Feedbacks
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 h-12">
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
