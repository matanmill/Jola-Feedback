
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ActionItemInsightResult = Database['public']['Functions']['get_action_items_with_insights']['Returns'][number];

export interface ActionItem {
  actionitem_key: string;
  content: string;
  created_at: string;
  related_insights?: string[];
  related_insights_data?: {
    insight_key: string;
    insight_content: string;
    insight_created_at: string;
  }[];
}

export function useActionItemsData() {
  const fetchActionItems = async (): Promise<ActionItem[]> => {
    console.log('Fetching action items data from Supabase');
    
    try {
      const { data, error } = await supabase
        .rpc('get_action_items_with_insights')
        .returns<ActionItemInsightResult[]>();
      
      if (error) {
        console.error('Error fetching action items data:', error);
        throw new Error(error.message || 'Failed to fetch action items data');
      }

      if (!data) {
        console.log('No action items data returned');
        return [];
      }

      // Group the results by action item
      const actionItemsMap = new Map<string, ActionItem>();
      
      data.forEach(row => {
        if (!actionItemsMap.has(row.actionitem_key)) {
          actionItemsMap.set(row.actionitem_key, {
            actionitem_key: row.actionitem_key,
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
            insight_content: row.insight_content || '',
            insight_created_at: new Date().toISOString() // Using current date as fallback since this field might not exist
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
    queryKey: ['action-items'],
    queryFn: fetchActionItems,
  });
}
