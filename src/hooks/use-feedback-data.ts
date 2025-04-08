
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Feedback } from '@/types/feedback';

export type { Feedback };

export function useFeedbackData() {
  const fetchFeedbacks = async (): Promise<Feedback[]> => {
    console.log('Fetching feedback data from Supabase');
    
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('feedback_key, content, source, name, company, company_arr, employee_count, role, created_at');
      
      if (error) {
        console.error('Error fetching feedback data:', error);
        throw new Error(error.message || 'Failed to fetch feedback data');
      }
      
      console.log(`Successfully fetched ${data?.length} feedbacks`);
      
      // Transform data to match Feedback interface
      const formattedData: Feedback[] = data?.map(item => ({
        feedback_key: item.feedback_key,
        content: item.content || '',
        source: item.source || 'Unknown',
        name: item.name || 'Anonymous',
        company: item.company || '',
        company_arr: item.company_arr || '',
        employee_count: item.employee_count || '',
        role: item.role || '',
        created_at: item.created_at || new Date().toISOString()
      })) || [];
      
      return formattedData;
    } catch (error) {
      console.error('Exception fetching feedback data:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['feedbacks'],
    queryFn: fetchFeedbacks,
  });
}
