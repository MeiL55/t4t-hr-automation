export type Applicant = {
  application_id: number;
  user_id: number;
  name: string;
  email: string;
  telephone: string;
  stage: string;
  resume_url: string;
  interview_stage?: 'interview_1' | 'interview_2'; 
  interview_notes?: string; 
}
