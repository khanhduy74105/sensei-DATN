"use server"
import { IResumeContent } from "@/app/(common)/(main)/resume/types";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function createResume({ title }: { title: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    try {
        const resume = await db.resume.create({
            data: {
                userId: user.id,
                title,
                content: ""
            }
        })
        return resume;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error saving resume:", error);
            throw new Error("Failed to save resume")
        }
    }

}

export async function getAllResumes() {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    const resumes = await db.resume.findMany({
        where: {
            userId: user.id
        },
        include: {
            educations: true,
            experiences: true,
            projects: true,
            personalInfo: true,
        }
    })
    return resumes as IResumeContent[] | [];
}


export async function getResumeById(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    const resume = await db.resume.findUnique({
        where: {
            id: id
        },
        include: {
            educations: true,
            experiences: true,
            projects: true,
            personalInfo: true,
        }
    })

    return resume as IResumeContent | null;
}

export async function getResumePublicById (id: string) {
    const resume = await db.resume.findUnique({
        where: {
            id: id
        },
        include: {
            educations: true,
            experiences: true,
            projects: true,
            personalInfo: true,
        }
    })

    return resume as IResumeContent | null;
}

export const updateResumeContent = async (id: string, data: IResumeContent) => {
    // Destructure fields from data
    const {
        content,
        atsScore,
        accentColor,
        template,
        title,
        json,
        feedback,
        personalInfo,
        professional_summary,
        experiences,
        educations,
        projects,
        skills
    } = data;

    // Prepare update object for main Resume
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
        content,
        atsScore,
        accentColor,
        template,
        title,
        json,
        feedback,
        skills,
        professional_summary
        // professional_summary is not a direct field in Resume, but could be stored in json or feedback
    };

    // Update related models
    // 1. Personal Info (update if exists, else create)
    if (personalInfo) {
        // Remove id and resumeId from update/create
        const { id, resumeId, ...infoFields } = personalInfo;
        updateData.personalInfo = {
            upsert: {
                update: { ...infoFields },
                create: { ...infoFields }
            }
        };
    }
    // No other nested upserts or related fields require this treatment.

    // 2. Experiences (upsert each, remove id/resumeId)
    if (experiences) {
        updateData.experiences = {
            deleteMany: {},
            upsert: experiences.map(exp => {
                const { id, resumeId, startDate, endDate, is_current, ...rest } = exp;
                return {
                    where: {
                        id: (exp).id || undefined,
                    },
                    update: {
                        ...rest,
                        startDate: startDate,
                        endDate: endDate,
                        isCurrent: is_current,
                    },
                    create: {
                        ...rest,
                        startDate: startDate,
                        endDate: endDate,
                        isCurrent: is_current,
                    }
                };
            })
        };
    }

    // 3. Educations (upsert each, remove id/resumeId)
    if (educations) {
        updateData.educations = {
            deleteMany: {},
            upsert: educations.map(edu => {
                const { id, resumeId, graduationDate, ...rest } = edu;
                return {
                    where: {
                        id: (edu).id || undefined,
                    },
                    update: {
                        ...rest,
                        graduationDate: graduationDate,
                    },
                    create: {
                        ...rest,
                        graduationDate: graduationDate,
                    }
                };
            })
        };
    }

    // 4. Projects (upsert each, remove id/resumeId)
    if (projects) {
        updateData.projects = {
            deleteMany: {},
            upsert: projects.map(proj => {
                const { id, resumeId, ...rest } = proj;
                return {
                    where: {
                        id: (proj).id || undefined,
                    },
                    update: {
                        ...rest,
                    },
                    create: {
                        ...rest,
                    }
                };
            })
        };
    }

    // Update Resume
    const updated = await db.resume.update({
        where: { id },
        data: updateData,
        include: {
            personalInfo: true,
            experiences: true,
            educations: true,
            projects: true,
        }
    });
    revalidatePath("/resume");
    return updated;
}

export async function uploadImage(file: Blob): Promise<string> {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.CLDNR_UPLOAD_PRESET!);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLDNR_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (data.secure_url) {
        return data.secure_url;
    } else {
        console.error(data);
        throw new Error("Image upload failed: " + JSON.stringify(data));
    }
}

export async function improveWithAI({
    current,
    type,
}: {
    current: string;
    type: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const basePrompt = `
        You are a professional resume writer specializing in ATS-optimized content for ${user.industry} professionals.
        Make it more impactful, quantifiable, and aligned with industry standards.
        Improve the following ${type} content:
        """${current}"""

        General rules:
            1. Use action verbs
            2. Include metrics and results where possible
            3. Highlight relevant technical skills
            4. Keep it concise but detailed
            5. Focus on achievements over responsibilities
            6. Use industry-specific keywords
            7. Limit to 3-4 sentences (about 40 words)
        Format the response as a single paragraph without any additional text or explanations.
        `;

    const prompt = basePrompt;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("AI improve fail:", error);
        throw new Error("Failed to improve content");
    }
}
