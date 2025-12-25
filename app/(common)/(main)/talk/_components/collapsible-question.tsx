"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  ChevronsUpDown,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  ChevronsDownUp,
} from "lucide-react";
import { ILiveQuizQuestion } from "@/types";

interface CollapsibleQuestionProps {
  question: ILiveQuizQuestion;
  questionNumber: number;
}

const CollapsibleQuestion = ({
  question,
  questionNumber,
}: CollapsibleQuestionProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      key={question.id}
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      {/* Entire question header is clickable */}
      <CollapsibleTrigger
        asChild
        className={`w-full flex items-center justify-between cursor-pointer rounded-lg border-gray-200  border px-4 py-3 transition-colors`}
      >
        <div
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`question-${question.id}-content`}
          className="flex w-full items-center justify-between"
        >
          <div className="flex flex-col text-left">
            <h4 className={`text-m text-white hover:textbla font-semibold`}>
              {`${questionNumber}. ${question.question}`}
            </h4>
          </div>

          {isOpen ? (
            <ChevronsDownUp className={`ml-2`} size={18} />
          ) : (
            <ChevronsUpDown className={`ml-2`} size={18} />
          )}
        </div>
      </CollapsibleTrigger>
      {/* Expanded Details */}
      <CollapsibleContent
        id={`question-${question.id}-content`}
        className="pb-4 space-y-3 pt-2"
      >
        {/* Your Answer */}
        <div className="flex items-start gap-3 rounded-md border bg-blue-50 border-blue-100 p-3">
          <Star className="text-blue-600 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="text-xs font-medium text-blue-800">Your answer</div>
            <div className="mt-1 text-sm text-blue-900">
              {!question.userAnswer
                ? "No answer provided."
                : question.userAnswer}
            </div>
          </div>
        </div>

        {/* Correct Answer */}
        <div className="flex items-start gap-3 rounded-md border bg-green-50 border-green-100 p-3">
          <CheckCircle className="text-green-600 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="text-xs font-medium text-green-800">
              Correct answer
            </div>
            <div className="mt-1 text-sm text-green-900">
              {question.correctAnswer ?? "No correct answer available."}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="flex items-start gap-3 rounded-md border bg-amber-50 border-amber-100 p-3">
          <MessageSquare className="text-amber-600 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="text-xs font-medium text-amber-800">Feedback</div>
            <div className="mt-1 text-sm text-amber-900">
              {question.feedback ?? "No feedback yet."}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-start gap-3 rounded-md border bg-purple-50 border-purple-100 p-3">
          <XCircle className="text-purple-600 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="text-xs font-medium text-purple-800">Rating</div>
            <div className="mt-1 text-sm text-purple-900">
              {question.rating !== undefined && question.rating !== null
                ? `${question.rating} / 10`
                : "Not rated"}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleQuestion;
