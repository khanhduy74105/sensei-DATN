"use client";

import React from "react";
import CollapsibleQuestion from "./collapsible-question";
import { ILiveQuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CollapsibleFeedback = ({
  questions,
}: {
  questions: ILiveQuizQuestion[];
}) => {
  const router = useRouter();
  return (
    <div className="">
      <div className="flex flex-col gap-2 pt-3">
        {questions.map((q, index) => (
          <CollapsibleQuestion key={q.id} question={q} questionNumber={index + 1} />
        ))}
      </div>
      <div className="mt-2">
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default CollapsibleFeedback;
