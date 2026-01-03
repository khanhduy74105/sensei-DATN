"use server";

import { db } from "@/lib/prisma";
import { ICoverLetter } from "@/types";
import { auth } from "@clerk/nextjs/server";
import getGeneratedAIContent from "@/lib/openRouter";
import { checkUserCredits } from "./user";
import { IApplicationEmail, IProspectingEmail, IReferralRequest, IThankYouEmail } from "@/app/(common)/(main)/ai-cover-letter/_components/type";
import { createPrompt, PERSONA_COPYWRITER } from "@/lib/prompt.manage";

export async function generateApplicationEmail(data: Partial<IApplicationEmail>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;

    const prompt = createPrompt({
        context: `Write a tailored cover letter for the position ${data.jobTitle} at ${data.companyName}. Recipient: ${data.hiringManager || "Hiring Manager"}. Job Description: ${data.jobDescription}`,
        role: PERSONA_COPYWRITER,
        instruction: `Analyze the job description to identify the top 3 critical skills. Map the candidate's experience to these skills using specific examples. Express genuine enthusiasm for the company and role. Produce a concise, persuasive cover letter.`,
        specification: `Format: Standard business letter in Markdown. Length: max 200 words. Tone: Professional, Confident, Persuasive. Must include 2-3 specific achievements demonstrating value.`,
        performance: `Success: A cover letter ready to send that clearly maps experience to JD and includes measurable achievements. Avoid generic filler; do not exceed 200 words.`,
    });

    try {
        const result = await getGeneratedAIContent(prompt);
        const content = result.response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                content,
                description: data.jobDescription ?? "",
                companyName: data.companyName ?? "",
                title: data.jobTitle ?? "",
                status: "draft",
                userId: user.id,
                type: "application", // Add type field
            },
        });

        return coverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating application email:", error.message);
            const newError = new Error("Failed to generate application email");
            newError.name = error.message;
            throw newError;
        }
    }
}

// 2. PROSPECTING EMAIL (Cold Email)
export async function generateProspectingEmail(data: Partial<IProspectingEmail>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;

    const prompt = createPrompt({
        context: `Write a concise cold/prospecting email to ${data.recipientName || "the hiring team"} at ${data.companyName}. Context: ${data.contextReason}${data.targetRole ? ` Target Role: ${data.targetRole}` : ""}`,
        role: PERSONA_COPYWRITER,
        instruction: `Hook the reader immediately referencing the context. Briefly introduce the candidate and value proposition${data.targetRole ? ` related to ${data.targetRole}` : ""}. Include a soft call-to-action.`,
        specification: `Format: Markdown. Length: under 150 words. Tone: Polite, Respectful, Direct. Include one concise CTA.`,
        performance: `Success: A short cold email that prompts a reply or meeting; avoid generic phrasing and filler.`,
    });

    try {
        const result = await getGeneratedAIContent(prompt);
        const content = result.response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                content,
                companyName: data.companyName ?? "",
                title: data.targetRole ?? "Networking Outreach",
                description: data.contextReason ?? "",
                status: "draft",
                userId: user.id,
                type: "prospecting", // Add type field
            },
        });

        return coverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating prospecting email:", error.message);
            const newError = new Error("Failed to generate prospecting email");
            newError.name = error.message;
            throw newError;
        }
    }
}

// 3. REFERRAL REQUEST EMAIL
export async function generateReferralRequest(data: Partial<IReferralRequest>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;

    const prompt = createPrompt({
        context: `Write a referral request email to ${data.recipientName} for a role at ${data.companyName}. Relationship context: ${data.relationship}${data.targetJobLink ? ` Target Job: ${data.targetJobLink}` : ""}`,
        role: PERSONA_COPYWRITER,
        instruction: `Begin with a warm, personalized greeting. State intent to apply and briefly explain why the candidate is a strong fit. Provide a 2-3 sentence 'blurb' at the end suitable for copy-pasting to HR.`,
        specification: `Format: Markdown. Tone: Grateful, Low-pressure. Include the copy-paste blurb as a separate paragraph.`,
        performance: `Success: A polite referral request that makes it easy for the recipient to refer; keep it concise and personal.`,
    });

    try {
        const result = await getGeneratedAIContent(prompt);
        const content = result.response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                content,
                companyName: data.companyName ?? "",
                title: "Referral Request",
                description: `Referral request to ${data.recipientName} (${data.relationship})`,
                status: "draft",
                userId: user.id,
                type: "referral", // Add type field
            },
        });

        return coverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating referral request:", error.message);
            const newError = new Error("Failed to generate referral request");
            newError.name = error.message;
            throw newError;
        }
    }
}

// 4. THANK YOU EMAIL (Post-Interview)
export async function generateThankYouEmail(data: Partial<IThankYouEmail>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;

    const prompt = createPrompt({
        context: `Write a thank-you follow-up email to ${data.interviewerName} at ${data.companyName} for the ${data.jobTitle} interview.${data.discussionTopic ? ` Key topic discussed: ${data.discussionTopic}.` : ""}`,
        role: PERSONA_COPYWRITER,
        instruction: `Express sincere gratitude, reference a memorable point from the interview or the provided discussion topic, reiterate excitement for the role and how the candidate can add value.`,
        specification: `Format: Markdown. Length: concise, suitable to send within 24 hours. Tone: Warm, Professional, Appreciative.`,
        performance: `Success: A timely thank-you email that reinforces fit and interest, without repeating the entire interview.`,
    });

    try {
        const result = await getGeneratedAIContent(prompt);
        const content = result.response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                content,
                companyName: data.companyName ?? "",
                title: data.jobTitle ?? "",
                recipient: data.interviewerName ?? "Interviewer",
                description: `Thank you email to ${data.interviewerName}${data.discussionTopic ? ` - discussed ${data.discussionTopic}` : ""}`,
                status: "draft",
                userId: user.id,
                type: "thankyou", // Add type field
            },
        });

        return coverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating thank you email:", error.message);
            const newError = new Error("Failed to generate thank you email");
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