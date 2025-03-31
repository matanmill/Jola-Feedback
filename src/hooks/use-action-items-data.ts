
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActionItem {
  id: number;
  content: string;
  created_at: string;
  related_feedbacks?: {
    id: number;
    title: string;
    content: string;
    sentiment: string;
  }[];
  related_insights?: {
    id: number;
    content: string;
  }[];
}

export function useActionItemsData() {
  const fetchActionItems = async (): Promise<ActionItem[]> => {
    console.log('Fetching action items data from Supabase');
    
    try {
      // First fetch action items
      const { data: actionItems, error } = await supabase
        .from('action_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching action items data:', error);
        throw new Error(error.message || 'Failed to fetch action items data');
      }
      
      console.log(`Successfully fetched ${actionItems?.length} action items`);
      
      // Fetch the relationships between action items and insights
      const { data: insightRelationships, error: insightRelError } = await supabase
        .from('actionitems_insights')
        .select('*');
      
      if (insightRelError) {
        console.error('Error fetching action items-insights relationships:', insightRelError);
      }
      
      // Fetch the insights to get their details
      const { data: insightsData, error: insightsError } = await supabase
        .from('insights')
        .select('*');
      
      if (insightsError) {
        console.error('Error fetching insights data:', insightsError);
      }
      
      // Fetch the relationships between action items and feedbacks
      // This might be indirect through insights
      const { data: feedbackRelationships, error: feedbackRelError } = await supabase
        .from('insights_feedbacks')
        .select('*');
      
      if (feedbackRelError) {
        console.error('Error fetching insights-feedbacks relationships:', feedbackRelError);
      }
      
      // Fetch the feedbacks to get their details
      const { data: feedbacksData, error: feedbacksError } = await supabase
        .from('feedbacks')
        .select('*');
      
      if (feedbacksError) {
        console.error('Error fetching feedbacks data:', feedbacksError);
      }
      
      // Map the action items with their related insights and feedbacks
      const formattedData: ActionItem[] = actionItems?.map(item => {
        // Find related insights for this action item
        const relatedInsightIds = insightRelationships
          ?.filter(rel => rel.action_item_id === item.actionitem_key)
          .map(rel => rel.insight_key) || [];
        
        const relatedInsights = insightsData
          ?.filter(insight => relatedInsightIds.includes(insight.insight_key))
          .map(insight => ({
            id: insight.insight_key,
            content: insight.content || ''
          }));
        
        // Find related feedbacks through insights
        const relatedFeedbacksMap = new Map();
        
        relatedInsightIds.forEach(insightId => {
          const feedbackIds = feedbackRelationships
            ?.filter(rel => rel.insight_key === insightId)
            .map(rel => rel.feedback_key) || [];
          
          feedbackIds.forEach(feedbackId => {
            relatedFeedbacksMap.set(feedbackId, true);
          });
        });
        
        const relatedFeedbackIds = Array.from(relatedFeedbacksMap.keys());
        
        const relatedFeedbacks = feedbacksData
          ?.filter(feedback => relatedFeedbackIds.includes(feedback.feedback_key))
          .map(feedback => ({
            id: feedback.feedback_key,
            title: feedback.content?.substring(0, 50) + (feedback.content?.length > 50 ? '...' : '') || 'No title',
            content: feedback.content || '',
            sentiment: feedback.sentiment || 'neutral'
          }));
        
        return {
          id: item.actionitem_key,
          content: item.content || '',
          created_at: item.created_at || new Date().toISOString(),
          related_insights: relatedInsights || [],
          related_feedbacks: relatedFeedbacks || []
        };
      }) || [];
      
      return formattedData;
    } catch (error) {
      console.error('Exception fetching action items data:', error);
      throw error;
    }
  };

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['actionItems'],
    queryFn: fetchActionItems,
    retry: 1,
  });

  return {
    actionItems: data,
    isLoading,
    error,
    refetch
  };
}
