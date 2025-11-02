"use client";
import React from "react";
import CollapsibleQuestion from "../../_components/collapsible-question";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    question: "What are your strengths?",
    correctAnswer:
      "My strengths include strong communication skills, problem-solving abilities, and a high level of adaptability.",
    yourAnswer: "I am good at communicating and solving problems.",
    feedback:
      "Try to provide more specific examples and elaborate on how these strengths have benefited you in previous roles.",
    rating: 3,
  },
  {
    id: 2,
    question: "What is your greatest weakness?",
    correctAnswer:
      "I tend to focus too much on details, but I’ve been working on improving by setting time limits and prioritizing key tasks.",
    yourAnswer: "I sometimes spend too long on small details.",
    feedback:
      "Explain how you’re actively addressing your weakness to show self-awareness and personal growth.",
    rating: 4,
  },
  {
    id: 3,
    question:
      "Can you describe a time when you faced a major challenge at work?",
    correctAnswer:
      "In my previous job, I faced a tight deadline on a client project. I reorganized the workflow, delegated tasks effectively, and completed the project two days early.",
    yourAnswer: "I once had a hard project but finished it on time.",
    feedback:
      "Add details about your specific actions and the impact of your work to make your answer more compelling.",
    rating: 2,
  },
  {
    id: 4,
    question: "Why do you want to work at our company?",
    correctAnswer:
      "I admire your company’s commitment to innovation and believe my skills in project management and teamwork align well with your goals.",
    yourAnswer: "I think it’s a good company and I want to learn more.",
    feedback:
      "Research the company and mention specific reasons or values that connect with your professional goals.",
    rating: 3,
  },
  {
    id: 5,
    question: "Where do you see yourself in five years?",
    correctAnswer:
      "In five years, I see myself growing into a leadership role, continuing to develop my technical and management skills within this organization.",
    yourAnswer: "I hope to get promoted and earn more experience.",
    feedback:
      "Be more specific about the career path you aim for and how it aligns with the company’s growth.",
    rating: 4,
  },
];

const FeedbackPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Congratulation!</h1>
      </div>
      <h3 className="text-xl font-bold">Here is your interview feedbacks</h3>
      <div className="text-sm text-green-400">
        Your overall interview rating: <span className="font-bold">7/10</span>
      </div>
      <span className="text-xs">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </span>

      <div className="flex flex-col gap-2 pt-3">
        {questions.map((q) => (
          <CollapsibleQuestion key={q.id} question={q} />
        ))}
      </div>
      <Button className="mt-6">Back</Button>
    </div>
  );
};

export default FeedbackPage;
