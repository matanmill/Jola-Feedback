
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  id: number;
  content: string;
  created_at: string;
  related_feedbacks?: number[];
}

export function useInsightsData() {
  const fetchInsights = async (): Promise<Insight[]> => {
    console.log('Fetching insights data from Supabase');
    
    try {
      // Fetch insights
      const { data: insightsData, error } = await supabase
        .from('insights')
        .select('insight_key, content');
      
      if (error) {
        console.error('Error fetching insights data:', error);
        throw new Error(error.message || 'Failed to fetch insights data');
      }
      
      // Fetch relationships between insights and feedbacks
      const { data: relationships, error: relError } = await supabase
        .from('insights_feedbacks')
        .select('*');
      
      if (relError) {
        console.error('Error fetching insights-feedbacks relationships:', relError);
      }
      
      // Transform data with related feedbacks
      const formattedData: Insight[] = insightsData?.map(item => {
        const relatedFeedbacks = relationships
          ?.filter(rel => rel.insight_key === item.insight_key)
          .map(rel => rel.feedback_key);
        
        return {
          id: item.insight_key,
          content: item.content || '',
          created_at: new Date().toISOString(), // Use current date as fallback
          related_feedbacks: relatedFeedbacks || []
        };
      }) || [];
      
      console.log(`Successfully fetched ${formattedData.length} insights`);
      return formattedData;
    } catch (error) {
      console.error('Exception fetching insights data:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
  });
}
