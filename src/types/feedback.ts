
export interface Feedback {
  feedback_key: string;
  content?: string;
  source?: string;
  name?: string;
  company?: string;
  company_arr?: string;
  employee_count?: string;
  role?: string;
  created_at?: string;
  [key: string]: any;  // For additional properties
}
