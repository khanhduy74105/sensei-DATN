// FILE: types/index.ts
// Add these types to your existing types file

// 1. Application Email Type
export interface IApplicationEmail {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  hiringManager?: string;
  content?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 2. Prospecting Email Type
export interface IProspectingEmail {
  id: string;
  companyName: string;
  recipientName?: string;
  contextReason: string;
  targetRole?: string;
  content?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 3. Referral Request Type
export interface IReferralRequest {
  id: string;
  companyName: string;
  recipientName: string;
  relationship: string;
  targetJobLink?: string;
  content?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 4. Thank You Email Type
export interface IThankYouEmail {
  id: string;
  companyName: string;
  jobTitle: string;
  interviewerName: string;
  discussionTopic?: string;
  content?: string;
  createdAt: Date;
  updatedAt?: Date;
}