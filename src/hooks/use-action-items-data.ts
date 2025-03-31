
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActionItem {
  id: number;
  content: string;
  created_at: string;
  related_feedbacks?: number[];
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
      
      // Then fetch the relationships between action items and feedbacks
      const { data: relationships, error: relError } = await supabase
        .from('actionitems_feedbacks')
        .select('*');
      
      if (relError) {
        console.error('Error fetching relationships:', relError);
      }
      
      // Map the action items with their related feedbacks
      const formattedData: ActionItem[] = actionItems?.map(item => {
        const relatedFeedbacks = relationships
          ?.filter(rel => rel.action_item_id === item.action_item_id)
          .map(rel => rel.feedback_id);
        
        return {
          id: item.action_item_id,
          content: item.content,
          created_at: item.created_at,
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
