
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type InsightFeedbackResult = Database['public']['Functions']['get_insights_with_feedbacks']['Returns'][number];

export interface Insight {
  id: string;
  content: string;
  created_at: string;
  related_feedbacks?: string[];
  related_feedbacks_data?: {
    feedback_key: string;
    feedback_content: string;
    source: string;
    segment: string;
    sentiment: string;
    feedback_created_at: string;
  }[];
}

export function useInsightsData() {
  const fetchInsights = async (): Promise<Insight[]> => {
    console.log('Fetching insights data from Supabase');
    
    try {
      // Use the RPC to fetch insights with their related feedbacks
      const { data, error } = await supabase
        .rpc('get_insights_with_feedbacks')
        .returns<InsightFeedbackResult[]>();
      
      if (error) {
        console.error('Error fetching insights data:', error);
        throw new Error(error.message || 'Failed to fetch insights data');
      }

      if (!data) {
        console.log('No insights data returned');
        return [];
      }

      // Group the results by insight
      const insightsMap = new Map<string, Insight>();
      
      data.forEach(row => {
        if (!insightsMap.has(row.insight_key)) {
          insightsMap.set(row.insight_key, {
            id: row.insight_key,
            content: row.insight_content || '',
            created_at: row["Creation Date"] ? new Date(row["Creation Date"]).toISOString() : new Date().toISOString(),
            related_feedbacks: [],
            related_feedbacks_data: []
          });
        }
        
        const insight = insightsMap.get(row.insight_key)!;
        
        if (row.feedback_key) {
          insight.related_feedbacks?.push(row.feedback_key);
          insight.related_feedbacks_data?.push({
            feedback_key: row.feedback_key,
            feedback_content: row.feedback_content || '',
            source: row.source || '',
            segment: row.segment || '',
            sentiment: row.sentiment || '',
            feedback_created_at: row["Creation Date"] ? new Date(row["Creation Date"]).toISOString() : new Date().toISOString()
          });
        }
      });
      
      const formattedData = Array.from(insightsMap.values());
      console.log(`Successfully fetched ${formattedData.length} insights with their related feedbacks`);
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
