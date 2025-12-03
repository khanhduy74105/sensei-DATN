export interface ITempleteProps {
    data: ITemplateData;
    accentColor: string;
}

export interface IResumePersonalData {
    id?: string;
    resumeId?: string;
    image?: string;
    fullName?: string;
    profession?: string;
    phone?: string;
    email?: string;
    location?: string;
    linkedin?: string;
    website?: string;
}

export interface IResumeEducation {
    id?: string;
    resumeId?: string;
    graduationDate: string;
    institution: string;
    degree: string;
    field: string;
    gpa?: string;
}

export type IResumeExperience =
    | {
        id?: string;
        resumeId?: string;
        title: string;
        organization: string;
        description: string;
        startDate: string;
        is_current: boolean;
        endDate?: never;
    }
    | {
        id?: string;
        resumeId?: string;
        title: string;
        organization: string;
        description: string;
        startDate: string;
        endDate: string;
        is_current?: never;
    };
export interface IResumeProject {
    id?: string;
    resumeId?: string;
    name: string;
    description: string;
    type: string;
}

export interface IResumeContent {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    atsScore: number | null;
    title: string | null;
    accentColor: string | null;
    template: string | null;
    json: string | null;
    feedback: string | null;
    personalInfo?: IResumePersonalData,
    professional_summary?: string
    experiences?: IResumeExperience[];
    educations?: IResumeEducation[];
    projects?: IResumeProject[];
    skills?: Array<string>;
}

export interface ITemplateData {
    template?: string;
    accentColor?: string;
    personalInfo?: IResumePersonalData,
    professional_summary?: string
    experiences?: IResumeExperience[];
    educations?: IResumeEducation[];
    projects?: IResumeProject[];
    skills?: Array<string>;
}

export enum KeyOfITemplateData {
    personalInfo = "personalInfo",
    professional_summary = "professional_summary",
    experience = "experience",
    education = "education",
    project = "project",
    skills = "skills",
}

export const ACCENT_COLOR_OPTIONS = [
    { name: "black", rgb: "rgb(0,0,0)" },
    { name: "neutral", rgb: "rgb(115,115,115)" },
    { name: "stone", rgb: "rgb(120,113,108)" },

    { name: "red", rgb: "rgb(239,68,68)" },
    { name: "orange", rgb: "rgb(249,115,22)" },
    { name: "lime", rgb: "rgb(132,204,22)" },
    { name: "green", rgb: "rgb(34,197,94)" },
    { name: "emerald", rgb: "rgb(16,185,129)" },
    { name: "sky", rgb: "rgb(14,165,233)" },
    { name: "indigo", rgb: "rgb(79,70,229)" },
    { name: "violet", rgb: "rgb(139,92,246)" },
    { name: "fuchsia", rgb: "rgb(217,70,239)" },
    { name: "rose", rgb: "rgb(244,63,94)" }
];

export type TemplateTypes = "classic" | "modern" | "minimal" | 'minimal_image';

export const TEMPLATE_TYPE_OPTIONS: {
    key: TemplateTypes;
    name: string;
    des: string;
}[] = [
        {
            key: "classic",
            name: "Classic",
            des: "A clean, traditional resume format with clear sections and professional typography."
        },
        {
            key: "modern",
            name: "Modern",
            des: "Sleek design with strategic use of color and modern font choices."
        },
        {
            key: "minimal",
            name: "Minimal",
            des: "Minimal design with a single image and clean typography."
        },
        {
            key: "minimal_image",
            name: "Minimal image",
            des: "Ultra-clean design that puts your content front and center."
        }
    ];
