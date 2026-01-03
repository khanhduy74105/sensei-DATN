export const PERSONA_COPYWRITER = "Expert Professional Copywriter and Career Coach specialized in high-conversion job search communication.";
export const PERSONA_ATS_EXPERT = "Senior ATS (Applicant Tracking System) Specialist and Resume Strategist.";
export const PERSONA_INTERVIEWER = "Technical Interviewer specializing in practical, competency-based questions.";
export const PERSONA_MARKET_ANALYST = "Senior Labor Market Analyst specialized in global employment trends.";

export interface CRISPE {
    context: string;
    role: string;
    instruction: string;
    specification?: string;
    performance?: string;
    example?: string;
}

export const createPrompt = ({ context, role, instruction, specification, performance, example }: CRISPE) => {
    return [
        `Context: ${context.trim()}`,
        `Role: ${role.trim()}`,
        `Instruction: ${instruction.trim()}`,
        specification ? `Specification: ${specification.trim()}` : `Specification:`,
        performance ? `Performance: ${performance.trim()}` : `Performance:`,
        example ? `Example: ${example.trim()}` : `Example:`,
    ]
        .filter(Boolean)
        .join('\n\n');
};