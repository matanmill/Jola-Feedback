
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  id: number;
  content: string;
  created_at: string;
  related_feedbacks?: {
    id: number;
    title: string;
    content: string;
    sentiment: string;
  }[];
}

export function useInsightsData() {
  const fetchInsights = async (): Promise<Insight[]> => {
    console.log('Fetching insights data from Supabase');
    
    try {
      // First fetch the insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (insightsError) {
        console.error('Error fetching insights data:', insightsError);
        throw new Error(insightsError.message || 'Failed to fetch insights data');
      }
      
      console.log(`Successfully fetched ${insightsData?.length} insights`);
      
      // Then fetch the relationships between insights and feedbacks
      const { data: relationships, error: relError } = await supabase
        .from('insights_feedbacks')
        .select('*');
      
      if (relError) {
        console.error('Error fetching relationships:', relError);
      }
      
      // Then fetch the feedbacks to get their details
      const { data: feedbacksData, error: feedbacksError } = await supabase
        .from('feedbacks')
        .select('*');
      
      if (feedbacksError) {
        console.error('Error fetching feedbacks data:', feedbacksError);
      }
      
      // Map the insights with their related feedbacks
      const formattedData: Insight[] = insightsData?.map(insight => {
        // Find relationships for this insight
        const relatedFeedbackIds = relationships
          ?.filter(rel => rel.insight_key === insight.insight_key)
          .map(rel => rel.feedback_key) || [];
        
        // Get the related feedback details
        const relatedFeedbacks = feedbacksData
          ?.filter(feedback => relatedFeedbackIds.includes(feedback.feedback_key))
          .map(feedback => ({
            id: feedback.feedback_key,
            title: feedback.content?.substring(0, 50) + (feedback.content?.length > 50 ? '...' : '') || 'No title',
            content: feedback.content || '',
            sentiment: feedback.sentiment || 'neutral',
          }));
        
        return {
          id: insight.insight_key,
          content: insight.content || '',
          created_at: insight.created_at || new Date().toISOString(),
          related_feedbacks: relatedFeedbacks || []
        };
      }) || [];
      
      return formattedData;
    } catch (error) {
      console.error('Exception fetching insights data:', error);
      throw error;
    }
  };

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
    retry: 1,
  });

  return {
    insights: data,
    isLoading,
    error,
    refetch
  };
}
