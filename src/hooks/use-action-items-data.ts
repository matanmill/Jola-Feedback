
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActionItem {
  id: number;
  content: string;
  created_at: string;
  related_feedbacks?: number[];
  related_insights?: number[];
}

export function useActionItemsData() {
  const fetchActionItems = async (): Promise<ActionItem[]> => {
    console.log('Fetching action items data from Supabase');
    
    try {
      // Fetch action items
      const { data: actionItems, error } = await supabase
        .from('action_items')
        .select('actionitem_key, content');
      
      if (error) {
        console.error('Error fetching action items data:', error);
        throw new Error(error.message || 'Failed to fetch action items data');
      }
      
      // Fetch relationships between action items and insights
      const { data: insightRelationships, error: insightRelError } = await supabase
        .from('actionitems_insights')
        .select('*');
      
      if (insightRelError) {
        console.error('Error fetching action items-insights relationships:', insightRelError);
      }
      
      // Map the action items with their related insights
      const formattedData: ActionItem[] = actionItems?.map(item => {
        const relatedInsights = insightRelationships
          ?.filter(rel => rel.actionitem_key === item.actionitem_key)
          .map(rel => rel.insight_key);
        
        return {
          id: item.actionitem_key,
          content: item.content || '',
          created_at: new Date().toISOString(), // Use current date as fallback
          related_insights: relatedInsights || []
        };
      }) || [];
      
      console.log(`Successfully fetched ${formattedData.length} action items`);
      return formattedData;
    } catch (error) {
      console.error('Exception fetching action items data:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['actionItems'],
    queryFn: fetchActionItems,
  });
}
