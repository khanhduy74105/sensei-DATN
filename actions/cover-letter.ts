"use server";

import { db } from "@/lib/prisma";
import { ICoverLetter } from "@/types";
import { auth } from "@clerk/nextjs/server";
import getGeneratedAIContent from "@/lib/openRouter";

export async function generateCoverLetter(data: Partial<ICoverLetter>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

    try {
        const result = await getGeneratedAIContent(prompt);
        const content = result.response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                content,
                jobDescription: data.jobDescription,
                companyName: data.companyName ?? '',
                jobTitle: data.jobTitle ?? '',
                status: "draft",
                userId: user.id,
            },
        });

        return coverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating cover letter:", error.message);
            const newError = new Error("Failed to generate cover letter");
            newError.name = error.message;
            throw newError;
        }
    }
}

export async function getCoverLetters() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const coverletters: ICoverLetter[] = await db.coverLetter.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return coverletters;
}

export async function getCoverLetter(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.coverLetter.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });
}

export async function updateCoverLetter(id: string, content: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.coverLetter.update({
        where: {
            id,
            userId: user.id,
        },
        data: {
            content: content,
            status: "completed",
        }
    });
}

export async function deleteCoverLetter(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.coverLetter.delete({
        where: {
            id,
            userId: user.id,
        },
    });
}