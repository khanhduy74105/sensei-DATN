"use server";

import { db } from "@/lib/prisma";
import { ICoverLetter } from "@/types";
import { auth } from "@clerk/nextjs/server";
import getGeneratedAIContent from "@/lib/openRouter";
import { checkUserCredits } from "./user";
import { IApplicationEmail, IProspectingEmail, IReferralRequest, IThankYouEmail } from "@/app/(common)/(main)/ai-cover-letter/_components/type";

export async function generateApplicationEmail(data: Partial<IApplicationEmail>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;

    const prompt = `
    **Role:** Expert Career Coach & Professional Copywriter
    **Goal:** Write a tailored Cover Letter for a ${data.jobTitle} position at ${data.companyName}.
    **Recipient:** ${data.hiringManager || "Hiring Manager"}

    **Job Description:**
    ${data.jobDescription}

    **Instructions:**
    1. Analyze the JD to identify top 3 critical skills.
    2. Map candidate's experience to these skills with specific examples.
    3. Express genuine enthusiasm for the company/role.
    4. Tone: Professional, Confident, and Persuasive.
    5. Format: Standard Business Letter in Markdown.
    6. Keep it concise (max 200 words).
    7. Include specific achievements that demonstrate value.

    Format the letter in markdown with proper business letter structure.
    `;

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

    const prompt = `
        **Role:** Professional Networker
        **Goal:** Write a concise Cold Email to ${data.recipientName || "the hiring team"} at ${data.companyName}.
        **Context:** ${data.contextReason}

        ${data.targetRole ? `\n**Target Role:** ${data.targetRole}` : ""}

        **Instructions:**
        1. Hook the reader immediately in the first sentence (refer to Context).
        2. Briefly introduce yourself and your value proposition${data.targetRole ? ` related to ${data.targetRole}` : ""}.
        3. Keep it extremely short (under 150 words).
        4. Include a soft Call-to-Action (e.g., "Open to a 10-min coffee chat?").
        5. Tone: Polite, Respectful, but Direct. Avoid generic fluff.
        6. Format in markdown.

        Write the email now:
        `;

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

    const prompt = `
    **Role:** Professional Communicator
    **Goal:** Write a Referral Request email to ${data.recipientName} for a role at ${data.companyName}.
    **Relationship Context:** ${data.relationship}
    ${data.targetJobLink ? `\n**Target Job:** ${data.targetJobLink}` : ""}

    **Instructions:**
    1. Start with a warm, personalized greeting based on the ${data.relationship} relationship.
    2. Clearly state your intention to apply for ${data.companyName}.
    3. Explain briefly why you are a good fit (so they feel confident referring you).
    4. **Important:** Include a "blurb" (short summary of 2-3 sentences) at the end that they can easily copy-paste to forward to HR.
    5. Tone: Grateful and Low-pressure.
    6. Format in markdown.

    Write the email now:
    `;

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

    const prompt = `
    **Role:** Courteous Professional
    **Goal:** Write a Thank You Follow-up email to ${data.interviewerName} at ${data.companyName}.
    **Position:** ${data.jobTitle}
    ${data.discussionTopic ? `\n**Key Topic Discussed:** ${data.discussionTopic}` : ""}

    **Instructions:**
    1. Express sincere gratitude for their time.
    ${data.discussionTopic ? `2. Reference the ${data.discussionTopic} discussion to show you were listening and engaged.` : "2. Reference something memorable from the interview."}
    3. Reiterate your excitement for the ${data.jobTitle} role and how you can add value.
    4. Keep it timely (within 24h context) and concise.
    5. Tone: Warm, Professional, and Appreciative.
    6. Format in markdown.

    Write the email now:
    `;

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