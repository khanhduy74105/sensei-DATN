"use server"
import { IResumeContent, ITemplateData, ResumeJDAnalysisResult } from "@/app/(common)/(main)/resume/types";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import getGeneratedAIContent from "@/lib/openRouter";

export async function createResume(data: Partial<IResumeContent> & { title: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    try {
        // Prepare create object for main Resume
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createData: any = {
            userId: user.id,
            title: data.title,
            content: data.content || "",
            atsScore: data.atsScore,
            accentColor: data.accentColor,
            template: data.template,
            json: data.json,
            feedback: data.feedback,
            skills: data.skills,
            professional_summary: data.professional_summary
        };

        // 1. Personal Info (create if exists)
        if (data.personalInfo) {
            const { id, resumeId, fullName, email, phone, profession, linkedin, location, website } = data.personalInfo;
            createData.personalInfo = {
                create: {
                    fullName: fullName || '',
                    email: email || '',
                    phone: phone || '',
                    profession: profession || '',
                    linkedin: linkedin || '',
                    location: location || '',
                    website: website || ''
                }
            };
        }

        // 2. Experiences (create many if exists)
        if (data.experiences && Array.isArray(data.experiences)) {
            createData.experiences = {
                create: data.experiences.map(exp => {
                    const { id, resumeId, title, organization, startDate, endDate, isCurrent, description } = exp;
                    return {
                        title: title || '',
                        organization: organization || '',
                        startDate: startDate || '',
                        endDate: endDate || '',
                        isCurrent: typeof isCurrent === 'boolean' ? isCurrent : false,
                        description: description || ''
                    };
                })
            };
        }

        // 3. Educations (create many if exists)
        if (data.educations && Array.isArray(data.educations)) {
            createData.educations = {
                create: data.educations.map(edu => {
                    const { id, resumeId, degree, institution, field, graduationDate, gpa } = edu;
                    return {
                        degree: degree || '',
                        institution: institution || '',
                        field: field || '',
                        graduationDate: graduationDate || '',
                        gpa: gpa || ''
                    };
                })
            };
        }

        // 4. Projects (create many if exists)
        if (data.projects && Array.isArray(data.projects)) {
            createData.projects = {
                create: data.projects.map(proj => {
                    const { id, resumeId, name, description, type } = proj;
                    return {
                        name: name || '',
                        description: description || '',
                        type: type || ''
                    };
                })
            };
        }

        const resume = await db.resume.create({
            data: createData,
            include: {
                personalInfo: true,
                experiences: true,
                educations: true,
                projects: true,
            }
        });
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
                const { id, resumeId, startDate, endDate, isCurrent, ...rest } = exp;
                return {
                    where: {
                        id: (exp).id || undefined,
                    },
                    update: {
                        ...rest,
                        startDate: startDate,
                        endDate: endDate,
                        isCurrent: isCurrent,
                    },
                    create: {
                        ...rest,
                        startDate: startDate,
                        endDate: endDate,
                        isCurrent: isCurrent,
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
        const result = await getGeneratedAIContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("AI improve fail:", error);
        throw new Error("Failed to improve content");
    }
}

export async function convertExtractedTextToResumeData(resumeExtractedText: string) {
    try {
        const RESUME_PARSING_PROMPT = `
        You are an expert resume parser. Extract and structure information from the provided resume text into a JSON format.

        **Instructions:**
        1. Carefully read the entire resume text
        2. Extract all relevant information
        3. Structure the data according to the schema below
        4. Use null for missing fields
        5. Ensure dates are in ISO 8601 format (YYYY-MM-DD)
        6. For ongoing positions, set isCurrent: true and endDate: null

        **Output Schema:**
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

        **Parsing Guidelines:**

        **Personal Information:**
        - Extract name, email, phone from header/contact section
        - Look for LinkedIn, GitHub, portfolio URLs
        - Extract physical address if present

        **Professional Summary:**
        - Usually at the top after contact info
        - May be labeled as "Summary", "Profile", "Objective", or "About Me"
        - Combine multiple paragraphs into one string

        **Experiences:**
        - List all work experiences in chronological order (most recent first)
        - Extract job title, company name, location, dates
        - If the position says "Present", "Current", or similar, set isCurrent: true
        - Combine bullet points into description field
        - Extract key achievements separately if clear

        **Education:**
        - Include degree name (Bachelor's, Master's, etc.)
        - Extract institution name, major/field of study
        - Parse graduation date or expected graduation
        - Include GPA if mentioned

        **Projects:**
        - Look for "Projects", "Personal Projects", or "Portfolio" section
        - Extract project name and description
        - Identify technologies/tools used
        - Find GitHub or demo links if present

        **Skills:**
        - Extract from "Skills", "Technical Skills", "Core Competencies" section
        - Return as array of individual skills
        - Include programming languages, frameworks, tools, soft skills
        - Separate combined skills (e.g., "React/Next.js" → ["React", "Next.js"])

        **Date Parsing Rules:**
        - Convert formats like "Jan 2023", "January 2023" to "2023-01-01"
        - "2023 - Present" → startDate: "2023-01-01", endDate: null, isCurrent: true
        - "2020 - 2023" → startDate: "2020-01-01", endDate: "2023-12-31"
        - If only year is given, use January 1st or December 31st appropriately

        **Important:**
        - Return ONLY valid JSON, no additional text or explanation
        - Use null for missing optional fields
        - Ensure all strings are properly escaped
        - Keep descriptions concise but informative
        - Preserve original wording when possible

        **Resume Text to Parse:**
        ${resumeExtractedText}

        **Output JSON:**
        `;

        const result = await getGeneratedAIContent(RESUME_PARSING_PROMPT);
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

        const createdResume = await createResume(parsedResume)
        return createdResume;
    } catch (error) {
        console.log('Error when convert extracted resume to formated data', error)
    }
}

export async function analyzeMatchingResume(jd: string, resume: ITemplateData) {
    try {
        const prompt = `
        You are an expert Applicant Tracking System (ATS) and senior technical recruiter.

        Your task is to analyze how well a candidate’s resume matches a job description
        and propose improvements WITHOUT altering the resume automatically.

        RULES:
        - Do NOT fabricate skills, experience, education, or achievements.
        - Do NOT assume missing information.
        - Resume JSON is the single source of truth.
        - Job Description text may be unstructured or messy.
        - Only suggest improvements when there is a clear benefit.
        - Suggestions must be realistic and aligned with the Job Description.
        - Output MUST be valid JSON and match the schema EXACTLY.
        - If a resume field is already strong, DO NOT suggest changes for that field.

            Analyze the match between the following Job Description and Candidate Resume.

        ========================
        JOB DESCRIPTION
        ========================
        """
        ${jd}
        """

        ========================
        CANDIDATE RESUME (STRUCTURED JSON)
        ========================
        {
            professional_summary: ${resume.professional_summary},
            experiences: ${JSON.stringify(resume.experiences)},
            educations: ${JSON.stringify(resume.educations)},
            projects: ${JSON.stringify(resume.projects)},
            skills: ${JSON.stringify(resume.skills)},
        }

        ========================
        TASKS
        ========================
        1. Evaluate how well the resume matches the Job Description.
        2. Identify missing required and nice-to-have skills.
        3. Identify missing or weak experience areas.
        4. Provide a match score (0–100) and a final verdict.
        5. Suggest general improvements to increase matching.
        6. If applicable, propose field-level improvements for:
        - professional_summary
        - experiences
        - educations
        - projects
        - skills

        IMPORTANT:
        - Field-level suggestions must include:
        - current content
        - suggested improved content
        - a clear reason
        - improved content should be match JD
        - Use array index to reference specific experience, education, or project items.
        - If no improvement is needed for a field, omit that field from the response.
        - Do NOT rewrite the entire resume.
        - The candidate must be able to apply suggestions selectively.

        ========================
        OUTPUT FORMAT
        ========================
        Return a single JSON object following this exact schema:

        {
            matchAnalysis: {
                overallScore: number; // 0–100
                verdict: "strong_match" | "moderate_match" | "weak_match";

                missingSkills: {
                    required: string[];
                    niceToHave: string[];
                };

                missingExperience: string[];

                notes: string;
            };

            generalSuggestions: string[];

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

                // skills should only keywords
                skills?: {
                    current: string[];
                    suggested: string[]; // should remove skills which is unnecessary and add required skills
                    reason: string;
                };
            };
        `

        const result = await getGeneratedAIContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const parsedData = JSON.parse(cleanedText)
        return parsedData as ResumeJDAnalysisResult;
    } catch (error) {
        console.log('Error when analizeMatchingResume', error);
    }
}