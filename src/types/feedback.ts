
export interface Feedback {
  id: string | number;
  title: string;
  content?: string;
  sentiment?: string;
  source?: string;
  segment?: string;
  client?: string;
  customer_name?: string;
  customer_email?: string;
  created_at?: string;
  [key: string]: any;  // For additional properties
}
