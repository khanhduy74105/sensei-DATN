"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import getGeneratedAIContent from "@/lib/openRouter";
import { createPrompt, PERSONA_MARKET_ANALYST } from "@/lib/prompt.manage";
type IndustryInsightCore = Pick<Prisma.IndustryInsightCreateInput,
  | "salaryRanges"
  | "growthRate"
  | "demandLevel"
  | "topSkills"
  | "marketOutlook"
  | "keyTrends"
  | "recommendedSkills"
>;

// model is now imported from lib/genai

export const genarateAIIsignts = async (
  industry: string
): Promise<IndustryInsightCore> => {
  const prompt = createPrompt({
    context: `Analyze the current state of the ${industry} industry and return structured market insights.`,
    role: PERSONA_MARKET_ANALYST,
    instruction: `Provide market-level insights including salary ranges, growth rate, demand level, top skills, market outlook, key trends, and recommended skills.`,
    specification: `Return ONLY valid JSON in this shape: {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }. Include at least 5 roles and at least 5 skills/trends. Growth rate must be a percentage number.`,
    performance: `Return only the JSON object with no extra text or markdown. Ensure JSON parses correctly.`,
  });

  const result = await getGeneratedAIContent(prompt, true);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  const parsedObject = JSON.parse(cleanedText);

  return parsedObject as IndustryInsightCore;
};

export async function getIndustryInsight() {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true }
  });
  if (!user) throw new Error('User not found');
  if (!user.industryInsight) {
    const insights: IndustryInsightCore = await genarateAIIsignts(user.industry ?? '');

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry!,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    return industryInsight;
  };

  return user.industryInsight;
}

export async function getHeroStats() {
  const [
    industriesCount,
    mockInterviewCount,
    quizCount,
    questionCount,
  ] = await Promise.all([
    db.industryInsight.count(),
    db.liveMockInterview.count(),
    db.assessment.count(),
    db.liveInterviewQuestion.count(),
  ]);

  return {
    industriesCount,
    mockInterviewCount,
    quizCount,
    questionCount,
  };
}
