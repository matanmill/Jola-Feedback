import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActionItem {
  id: number;
  content: string;
  created_at: string;
  related_insights?: number[];
  related_insights_data?: {
    insight_key: number;
    insight_content: string;
  }[];
}

interface ActionItemInsightResult {
  actionitem_key: number;
  actionitem_content: string;
  insight_key: number;
  insight_content: string;
}

export function useActionItemsData() {
  const fetchActionItems = async (): Promise<ActionItem[]> => {
    console.log('Fetching action items data from Supabase');
    
    try {
      const { data, error } = await supabase
        .rpc<ActionItemInsightResult>('get_action_items_with_insights');
      
      if (error) {
        console.error('Error fetching action items data:', error);
        throw new Error(error.message || 'Failed to fetch action items data');
      }

      if (!data) {
        console.log('No action items data returned');
        return [];
      }

      // Group the results by action item
      const actionItemsMap = new Map<number, ActionItem>();
      
      data.forEach(row => {
        if (!actionItemsMap.has(row.actionitem_key)) {
          actionItemsMap.set(row.actionitem_key, {
            id: row.actionitem_key,
            content: row.actionitem_content || '',
            created_at: new Date().toISOString(), // Use current date as fallback
            related_insights: [],
            related_insights_data: []
          });
        }
        
        const actionItem = actionItemsMap.get(row.actionitem_key)!;
        
        if (row.insight_key) {
          actionItem.related_insights?.push(row.insight_key);
          actionItem.related_insights_data?.push({
            insight_key: row.insight_key,
            insight_content: row.insight_content || ''
          });
        }
      });
      
      const formattedData = Array.from(actionItemsMap.values());
      console.log(`Successfully fetched ${formattedData.length} action items with their related insights`);
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
