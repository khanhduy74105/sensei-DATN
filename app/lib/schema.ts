import { title } from "process";
import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    error: "Please select an industry",
  }),
  subIndustry: z
    .string({
      error: "Please select a sub-industry",
    })
    .optional(),
  experience: z
    .string({
      error: "Please enter your years of experience",
    })
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number({
          error: "Please enter your years of experience",
        })
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience must be less than 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
      : []
  ),
  bio: z.string().max(500).optional(),
});

export const contactSchema = z.object({
  email: z.email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    isCurrent: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.isCurrent && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

export const liveMockInterviewSchema = z.object({
  role: z.string().min(1, "Job role/position is required"),
  description: z.string().min(1, "Job description is required"),
  yoes: z.string().min(1, "Years of experience is required"),
});


export const resumePersonalDataSchema = z.object({
  id: z.string().optional(),
  resumeId: z.string().optional(),
  image: z.string().optional(),
  fullName: z.string().optional(),
  profession: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional(),
  website: z.string().url().optional(),
});

/* ----------------------------------------------------
 *  2. EDUCATION
 * ---------------------------------------------------- */

export const resumeEducationSchema = z.object({
  id: z.string().optional(),
  resumeId: z.string().optional(),
  graduationDate: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  gpa: z.string().optional(),
});

/* ----------------------------------------------------
 *  3. EXPERIENCE  (Union: current job or past job)
 * ---------------------------------------------------- */

// Current job: has isCurrent, must NOT have endDate
export const resumeExperienceCurrentSchema = z.object({
  id: z.string().optional(),
  resumeId: z.string().optional(),
  title: z.string(),
  organization: z.string(),
  description: z.string(),
  startDate: z.string(),
  isCurrent: z.boolean(),
  endDate: z.never().optional(),
});

// Past job: has endDate, must NOT have isCurrent
export const resumeExperiencePastSchema = z.object({
  id: z.string().optional(),
  resumeId: z.string().optional(),
  title: z.string(),
  organization: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isCurrent: z.never().optional(),
});

export const resumeExperienceSchema = z.union([
  resumeExperienceCurrentSchema,
  resumeExperiencePastSchema,
]);

/* ----------------------------------------------------
 *  4. PROJECT
 * ---------------------------------------------------- */

export const resumeProjectSchema = z.object({
  id: z.string().optional(),
  resumeId: z.string().optional(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
});

/* ----------------------------------------------------
 *  5. FULL TEMPLATE DATA SCHEMA
 * ---------------------------------------------------- */

export const templateDataSchema = z.object({
  title: z.string().optional(),
  personalInfo: resumePersonalDataSchema.optional(),
  professional_summary: z.string().optional(),
  experiences: z.array(resumeExperienceSchema).optional(),
  educations: z.array(resumeEducationSchema).optional(),
  projects: z.array(resumeProjectSchema).optional(),
  skills: z.array(z.string()).optional(),
});