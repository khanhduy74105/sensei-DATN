"use server";

import { db } from "@/lib/prisma";
import { IAssessment, ILiveMockInterview, ILiveQuizQuestion } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import getGeneratedAIContent from "@/lib/openRouter";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateQuiz(entry?: { role: string; skills: string[], yoes: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
      UserCredit: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (!user.UserCredit?.isPaid && (user.UserCredit?.balance || 0) <= 0) {
    return {
      success: false,
      error: "OUT_OF_BALANCE",
    }
  }

  let prompt = entry ?
    `Generate 10 technical interview questions for a ${entry.role} with ${entry.yoes} years of experience ${entry.skills?.length ? ` with expertise in ${entry.skills.join(", ")}` : ""}`
    : `Generate 10 technical interview questions for a ${user.industry
    } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""}.`

  prompt += `
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await getGeneratedAIContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    const newError = new Error("Failed to generate quiz questions");
    newError.name = (error as Error).message;
    throw newError
  }
}

export async function saveQuizResult(questions: QuizQuestion[], answers: string[], score: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { UserCredit: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.UserCredit?.isPaid && (user.UserCredit?.balance || 0) <= 0) {
    return {
      success: false,
      error: "OUT_OF_BALANCE",
    }
  }
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await getGeneratedAIContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      const newError = new Error("Failed to generate improvement tip");
      newError.name = (error as Error).message;
      throw newError
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return assessments as IAssessment[];
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}

export async function generateInterviewQuestions({ role, description, yoes }: { role: string; description: string; yoes: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { UserCredit: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.UserCredit?.isPaid && (user.UserCredit?.balance || 0) <= 0) {
    return {
      success: false,
      error: "OUT_OF_BALANCE",
    }
  }
  const prompt = `
    Act as a technical interviewer. 
    Generate 5 professional interview questions for the position: ${role}, 
    with the job description: ${description}, 
    and the candidate's years of experience: ${yoes}.

    Requirements:
    - Questions must be clear and concise.
    - Focus on practical skills and real-world project experience.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        "question": "string",
        "correctAnswer": "string"
      ]
    }
  `;
  try {
    const result = await getGeneratedAIContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    const newError = new Error("Failed to generate quiz questions");
    newError.name = (error as Error).message;
    throw newError;
  }
}

export async function saveGeneratedInterviewQuestions(interviewInfo: {
  role: string;
  description: string;
  yoes: string;
}, questions: { question: string, correctAnswer: string }[]): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    const mockInterview = await db.liveMockInterview.create({
      data: {
        userId: user.id,
        description: interviewInfo.description,
        role: interviewInfo.role,
        yoes: parseInt(interviewInfo.yoes),
      },
    });

    await db.liveInterviewQuestion.createMany({
      data: questions.map<Prisma.LiveInterviewQuestionCreateManyInput>((q) => ({
        question: q.question,
        correctAnswer: q.correctAnswer || "",
        liveMockInterviewId: mockInterview.id,
      })),
    })
    return mockInterview.id;
  } catch (error) {
    console.error("Error saving interview questions:", error);
    throw new Error("Failed to save interview questions");
  }
}

export async function getLiveMockInterviewById(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");
  try {
    const mockInterview = await db.liveMockInterview.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        LiveInterviewQuestion: true,
      },
    });
    if (!mockInterview) throw new Error("Mock interview not found");

    const mockInterviewFormatted: ILiveMockInterview = {
      id: mockInterview.id,
      userId: mockInterview.userId,
      questions: mockInterview.LiveInterviewQuestion,
      role: mockInterview.role,
      description: mockInterview.description,
      yoes: mockInterview.yoes.toString(),
      createdAt: mockInterview.createdAt,
      updatedAt: mockInterview.updatedAt,
    }

    return mockInterviewFormatted;
  } catch (error) {
    console.error("Error fetching mock interview:", error);
    throw new Error("Failed to fetch mock interview");
  }
}

export async function saveLiveInterviewResult(mockInterview: ILiveMockInterview) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { UserCredit: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.UserCredit?.isPaid && (user.UserCredit?.balance || 0) <= 0) {
    return {
      success: false,
      error: "OUT_OF_BALANCE",
    }
  }

  try {
    const prompt = `
    Act as a technical interviewer. 
    Based on the user's answers to the following interview questions, provide a concise, specific improvement tip.
    User's Answers: 
    ${mockInterview.questions.map((q) => `{
        id: ${q.id}
        question: "${q.question}"
        correctAnswer: "${q.correctAnswer}"
        userAnswer: "${q.userAnswer}"
      }
    `).join("\n\n")}
    Requirements:
    - Focus on the knowledge gaps revealed by these answers.
    - Keep the response under 2 sentences and make it encouraging.
    - Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    - Questions must be clear and concise.
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "id": "string",
          "question": "string",
          "correctAnswer": "string"
          "userAnswer": "string"
          "feedback": "string"
          "rating": number (1-10, default 0 if user answer is empty)
        }
      ]
    }
  `;

    const result = await getGeneratedAIContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const feedbackData = JSON.parse(cleanedText);

    const savedQuestions = await Promise.all(
      feedbackData.questions.map(async (q: Partial<ILiveQuizQuestion>) => {
        return await db.liveInterviewQuestion.update({
          where: {
            id: q.id,
          },
          data: {
            feedback: q.feedback,
            rating: q.rating,
            userAnswer: q.userAnswer,
          },
        });
      })
    );

    await db.liveMockInterview.update({
      where: {
        id: mockInterview.id,
        userId: user.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return savedQuestions;
  } catch (error) {
    console.error("Error generating interview feedback:", error);
    const newError = new Error("Failed to generate interview feedback");
    newError.name = (error as Error).message;
    throw newError;
  }
}

export async function getLiveMockInterviews() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");
  try {
    const mockInterviews = await db.liveMockInterview.findMany({
      where: {
        userId: user.id,
      },
      include: {
        LiveInterviewQuestion: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return mockInterviews.map(
      (mockInterview) => ({
        id: mockInterview.id,
        userId: mockInterview.userId,
        questions: mockInterview.LiveInterviewQuestion,
        role: mockInterview.role,
        description: mockInterview.description,
        yoes: mockInterview.yoes.toString(),
        createdAt: mockInterview.createdAt,
        updatedAt: mockInterview.updatedAt,
      }
      )) as ILiveMockInterview[];
  } catch (error) {
    console.error("Error fetching mock interviews:", error);
    throw new Error("Failed to fetch mock interviews");
  }
}