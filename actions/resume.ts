"use server"
import { IResumeContent, ITemplateData, ResumeJDAnalysisResult } from "@/app/(common)/(main)/resume/types";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import getGeneratedAIContent from "@/lib/openRouter";
import { createPrompt, PERSONA_ATS_EXPERT } from "@/lib/prompt.manage";
import { checkUserCredits } from "./user";

export async function createResume(
    data: Partial<IResumeContent> & { title: string }
) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
    });
    if (!user) throw new Error("User not found");

    const resumeId = await db.$transaction(async (tx) => {
        // 1️⃣ Create resume (1 query)
        const resume = await tx.resume.create({
            data: {
                userId: user.id,
                title: data.title,
                content: data.content ?? "",
                atsScore: data.atsScore,
                accentColor: data.accentColor,
                template: data.template,
                json: data.json,
                feedback: data.feedback,
                skills: data.skills,
                professional_summary: data.professional_summary,
            },
            select: { id: true },
        });

        const id = resume.id;

        // 2️⃣ Personal info
        if (data.personalInfo) {
            const { id: _, resumeId: __, ...info } = data.personalInfo;
            await tx.resumePersonalInfo.create({
                data: {
                    resumeId: id,
                    fullName: info.fullName || '',
                    email: info.email || '',
                    phone: info.phone || '',
                    profession: info.profession || '',
                    linkedin: info.linkedin || '',
                    location: info.location || '',
                    website: info.website || ''
                },
            });
        }

        // 3️⃣ Experiences
        if (data.experiences?.length) {
            await tx.resumeExperience.createMany({
                data: data.experiences.map(({ id: _, resumeId: __, ...e }) => ({
                    title: e.title || '',
                    organization: e.organization || '',
                    startDate: e.startDate || '',
                    endDate: e.endDate || '',
                    isCurrent: typeof e.isCurrent === 'boolean' ? e.isCurrent : false,
                    description: e.description || '',
                    resumeId: id,
                })),
            });
        }

        // 4️⃣ Educations
        if (data.educations?.length) {
            await tx.resumeEducation.createMany({
                data: data.educations.map(({ id: _, resumeId: __, ...e }) => ({
                    degree: e.degree || '',
                    institution: e.institution || '',
                    field: e.field || '',
                    graduationDate: e.graduationDate || '',
                    gpa: e.gpa || '',
                    resumeId: id,
                })),
            });
        }

        // 5️⃣ Projects
        if (data.projects?.length) {
            await tx.resumeProject.createMany({
                data: data.projects.map(({ id: _, resumeId: __, ...p }) => ({
                    ...p,
                    resumeId: id,
                })),
            });
        }

        return id;
    });

    // ❌ không return object lớn
    return { id: resumeId };
}

export async function getAllResumes() {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const resumes = await db.resume.findMany({
        where: {
            user: {
                clerkUserId: userId
            }
        },
        include: {
            educations: true,
            experiences: true,
            projects: true,
            personalInfo: true,
        },
        orderBy: {
            updatedAt: 'desc'
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

export async function getResumePublicById(id: string) {
    const { userId } = await auth();
    const resume = await db.resume.findUnique({
        where: {
            id: id,
            OR: [
                { isPublic: true },
                { userId: userId ? (await db.user.findUnique({ where: { clerkUserId: userId } }))?.id : "" }
            ]
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

export const updateResumeContent = async (id: string, data: Partial<IResumeContent>) => {
    const {
        content,
        atsScore,
        accentColor,
        template,
        title,
        json,
        feedback,
        skills,
        professional_summary,
        personalInfo,
        experiences,
        educations,
        projects,
    } = data;

    await db.$transaction(async (tx) => {
        // 1️⃣ Update resume (1 query)
        await tx.resume.update({
            where: { id },
            data: {
                content,
                atsScore,
                accentColor,
                template,
                title,
                json,
                feedback,
                skills,
                professional_summary,
            },
            select: { id: true },
        });

        // 2️⃣ Personal info (2 query max)
        if (personalInfo) {
            const { id: _, resumeId: __, ...info } = personalInfo;
            await tx.resumePersonalInfo.upsert({
                where: { resumeId: id },
                update: info,
                create: { ...info, resumeId: id },
            });
        }

        // 3️⃣ Experiences (2 query)
        if (experiences?.length) {
            await tx.resumeExperience.deleteMany({ where: { resumeId: id } });
            await tx.resumeExperience.createMany({
                data: experiences.map(({ id: _, resumeId: __, ...e }) => ({
                    ...e,
                    resumeId: id,
                })),
            });
        }

        // 4️⃣ Educations (2 query)
        if (educations?.length) {
            await tx.resumeEducation.deleteMany({ where: { resumeId: id } });
            await tx.resumeEducation.createMany({
                data: educations.map(({ id: _, resumeId: __, ...e }) => ({
                    ...e,
                    resumeId: id,
                })),
            });
        }

        // 5️⃣ Projects (2 query)
        if (projects?.length) {
            await tx.resumeProject.deleteMany({ where: { resumeId: id } });
            await tx.resumeProject.createMany({
                data: projects.map(({ id: _, resumeId: __, ...p }) => ({
                    ...p,
                    resumeId: id,
                })),
            });
        }
    });

    revalidatePath(`/resume/${id}`);

    return { success: true };
};


export async function deleteResume(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');
    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');
    const deleted = await db.resume.delete({
        where: {
            id: id,
            userId: user.id
        },
        include: {
            educations: true,
            experiences: true,
            projects: true,
            personalInfo: true,
        }
    });
    revalidatePath("/resume");
    return Boolean(id === deleted.id);
}

export async function toggleResumePublicStatus(id: string, isPublic: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');
    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');
    const updated = await db.resume.update({
        where: {
            id: id,
            userId: user.id
        },
        data: {
            isPublic: isPublic
        }
    });
    revalidatePath("/resume");
    return Boolean(updated.id === id);
};

export async function uploadImage(file: Blob): Promise<string> {
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

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;

    const prompt = createPrompt({
        context: `You are rewriting a piece of resume content (${type}) to improve impact and ATS alignment. Original content: ${current}`,
        role: PERSONA_ATS_EXPERT,
        instruction: `Rewrite the provided content to be more impactful, professional, and results-driven. Use action verbs and focus on achievements using the formula: [Action Verb] + [Task] + [Impact/Result]. Do NOT invent facts or tools not present in the original text.`,
        specification: `Produce exactly 3-4 professional sentences. Each output sentence should be a single line starting with "-". Strictly English. Return ONLY the improved paragraph with no additional commentary.`,
        performance: `Avoid filler language; prefer measurable impact. Preserve truthfulness and ensure improved readability and ATS keyword relevance.`,
    });

    try {
        const result = await getGeneratedAIContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error improving resume content:", error.message);
            const newError = new Error("Failed to improve resume content");
            newError.name = error.message;
            throw newError;
        }
    }
}

export async function convertExtractedTextToResumeData(title: string, resumeExtractedText: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    const user = checkResult.user!;
    const RESUME_PARSING_PROMPT = createPrompt({
        context: `You are an expert resume parser. Extract and structure information from the provided resume text into a JSON object using the exact schema.`,
        role: PERSONA_ATS_EXPERT,
        instruction: `Extract personalInfo, professional_summary, experiences, educations, projects, and skills from the resume text. Use null when a field is missing. Dates MUST be ISO 8601 (YYYY-MM-DD). For current roles, set isCurrent: true and endDate: null. Do not invent facts.`,
        specification: `Return ONLY a single JSON object that exactly matches this template (no surrounding text, code fences, or markdown):
        {
        "personalInfo": {
            "fullName": string,
            "email": string,
            "phone": string,
            "profession": string | null,
            "linkedin": string | null,
            "location": string | null,
            "website": string | null
        },
        "professional_summary": string | null,
        "experiences": [
            {
            "title": string,
            "organization": string,
            "startDate": string (YYYY-MM-DD),
            "endDate": string (YYYY-MM-DD) | null,
            "isCurrent": boolean, (if endDate null)
            "description": string
            }
        ],
        "educations": [
            {
            "degree": string,
            "institution": string,
            "field": string | null,
            "graduationDate": string (YYYY-MM-DD) | null,
            "gpa": string | null,
            }
        ],
        "projects": [
            {
            "name": string,
            "description": string,
            "type": string
            }
        ],
        "skills": string[]
        }
        Use null where appropriate.`,
        performance: `MUST return valid JSON parsable by JSON.parse(). Do not include any extra keys, comments, or text.`,
    });

    // append the resume extract to the generated prompt
    const RESUME_PARSING_PROMPT_FULL = `${RESUME_PARSING_PROMPT}\n\nResume Text to Parse:\n${resumeExtractedText}`;
    try {
        const result = await getGeneratedAIContent(RESUME_PARSING_PROMPT_FULL, true);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const parsedResume = JSON.parse(cleanedText)
        const { userId } = await auth();
        if (!userId) throw new Error('User not authenticated');

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });
        if (!user) throw new Error('User not found');

        parsedResume.title = title;

        const createdResume = await createResume(parsedResume)
        return createdResume;

    } catch (error) {
        const newError = new Error("Failed to parse resume text");
        newError.name = (error as Error).message;
        throw newError;
    }
}

export async function analyzeMatchingResume(jd: string, resume: ITemplateData) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const checkResult = await checkUserCredits(userId);
    if (!checkResult.success) return checkResult;

    try {
        const prompt = createPrompt({
            context: `You are an expert ATS Specialist. Optimize the candidate's resume JSON to align with this job description and produce a strict analysis object.`,
            role: PERSONA_ATS_EXPERT,
            instruction: `Using JOB_DESCRIPTION and CANDIDATE_RESUME_JSON, produce a match analysis and suggestions. Return ONLY a single JSON object matching the template exactly. No extra text, code fences, or explanation.`,
            specification: `
            # STRICT RULES FOR SKILLS (CRITICAL)
            1. ONLY MATCHING KEYWORDS: In 'fieldSuggestions.skills.suggested', you MUST include all essential skills and technologies mentioned in the JD, even if they are missing from the current resume.
            2. ATOMIZED FORMAT: Each skill must be a standalone keyword/tag. 
            - Split "React/Next.js" into "React", "Next.js".
            - Split "HTML/CSS" into "HTML", "CSS".
            3. NO EXPLANATIONS: DO NOT include any text in parentheses or extra descriptors.
            - WRONG: "Automated Testing (Eagerness to learn)", "English (Fluent)", "React (v18)".
            - RIGHT: "Automated Testing", "English", "React".
            4. CLEANING: Remove all adjectives like "Expert", "Proficient", "Junior", or "Knowledge of".

            # TASKS
            1. Overall Match Analysis: Score 0-100 based on JD requirements vs Resume.
            2. Identify missing skills: List skills required by JD that are not in the resume.
            3. Rewrite Sections: Optimize 'professional_summary', 'experiences', and 'projects' by weaving in JD keywords naturally.
            4. Skills Optimization: Generate a cleaned, atomized list of top 20 skills that are most relevant to the JD.
            Return EXACTLY this JSON structure (keys and types must match):
            {
            matchAnalysis: {
                overallScore: number; // 0–100
                verdict: "strong_match" | "moderate_match" | "weak_match";

                missingSkills: {
                    "required": string[], // Skills in JD but NOT in Resume
                    "niceToHave": string[] // Optional skills in JD but NOT in Resume
                };

                missingExperience: string[];

                notes: string;
            };

            generalSuggestions: string[];

            // If the original content is good enough and needs no changes, then skip that item.
            fieldSuggestions: {
                professional_summary?: {
                    current: string;
                    suggested: string;
                    reason: string;
                };

                experiences?: Array<{
                    index: number;
                    suggested: {
                        id?: string;
                        resumeId?: string;
                        title: string;
                        organization: string;
                        description: string;
                        startDate: string;
                        isCurrent: boolean;
                        endDate?: never;
                    };
                    reason: string;
                }>;

                educations?: Array<{
                    index: number;
                    suggested: {
                        id?: string;
                        resumeId?: string;
                        graduationDate: string;
                        institution: string;
                        degree: string;
                        field: string;
                        gpa?: string;
                    };
                    reason: string;
                }>;

                projects?: Array<{
                    index: number;
                    suggested: {
                        id?: string;
                        resumeId?: string;
                        name: string;
                        description: string;
                        type: string;
                    };
                    reason: string;
                }>;

                skills?: {
                    current: string[];
                    suggested: string[];
                    reason: string;
                };
            };
            }
            Skills must be atomized (no slashes, parentheses, or modifiers).`,
            performance: `MUST return ONLY the JSON object above and nothing else. The response must parse with JSON.parse().`,
        });

        const promptWithInputs = `${prompt}\n\nJOB_DESCRIPTION:\n${jd}\n\nCANDIDATE_RESUME_JSON:\n${JSON.stringify({
            professional_summary: resume.professional_summary,
            experiences: resume.experiences,
            educations: resume.educations,
            projects: resume.projects,
            skills: resume.skills,
        })}`;

        const result = await getGeneratedAIContent(promptWithInputs);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const parsedData = JSON.parse(cleanedText)
        return parsedData as ResumeJDAnalysisResult;
    } catch (error) {
        console.log('Error when analizeMatchingResume', error);
        const newError = new Error("Failed to analyze resume matching");
        newError.name = (error as Error).message;
        throw newError;
    }
}