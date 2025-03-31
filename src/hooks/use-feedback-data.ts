
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Feedback {
  id: number;
  content: string;
  source?: string;
  segment?: string;
  sentiment?: string;
  created_at: string;
}

export function useFeedbackData() {
  const fetchFeedbacks = async (): Promise<Feedback[]> => {
    console.log('Fetching feedback data from Supabase');
    
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('feedback_key, content, source, segment, sentiment, "Creation Date"');
      
      if (error) {
        console.error('Error fetching feedback data:', error);
        throw new Error(error.message || 'Failed to fetch feedback data');
      }
      
      console.log(`Successfully fetched ${data?.length} feedbacks`);
      
      // Transform data to match Feedback interface
      const formattedData: Feedback[] = data?.map(item => ({
        id: item.feedback_key,
        content: item.content || '',
        source: item.source || 'Unknown',
        sentiment: item.sentiment || 'neutral',
        segment: item.segment || '',
        created_at: item["Creation Date"] || new Date().toISOString()
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
