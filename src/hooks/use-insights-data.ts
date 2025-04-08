
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  insight_key: string;
  content: string;
  Title?: string; // Note: column name is 'Title' (capital T) in the Supabase table
  labels?: string[];
}

export interface InsightWithLabelDetails extends Insight {
  label_details: {
    label_key: string;
    label: string;
  }[];
}

export function useInsightsData(labelFilter?: string) {
  const fetchInsights = async (): Promise<InsightWithLabelDetails[]> => {
    try {
      console.log('Fetching insights data from Supabase...');
      
      // First, fetch insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('insights')
        .select('insight_key, content, Title');
        
      if (insightsError) {
        console.error('Error fetching insights:', insightsError);
        throw new Error(insightsError.message);
      }
      
      // Fetch all insights_labels and labels data to create the relationship
      const { data: insightLabelsData, error: labelsError } = await supabase
        .from('insight_labels')
        .select(`
          insight_key,
          label_key,
          labels (
            label_key,
            label
          )
        `);
        
      if (labelsError) {
        console.error('Error fetching labels:', labelsError);
        throw new Error(labelsError.message);
      }
      
      // Group labels by insight_key
      const insightLabelsMap = new Map();
      insightLabelsData?.forEach(item => {
        const labelInfo = {
          label_key: item.labels.label_key,
          label: item.labels.label
        };
        
        if (!insightLabelsMap.has(item.insight_key)) {
          insightLabelsMap.set(item.insight_key, []);
        }
        insightLabelsMap.get(item.insight_key).push(labelInfo);
      });
      
      // Create final insights with label details
      const insights: InsightWithLabelDetails[] = insightsData.map(insight => {
        return {
          insight_key: insight.insight_key,
          content: insight.content || '',
          Title: insight.Title || '',
          labels: insightLabelsMap.get(insight.insight_key)?.map(l => l.label) || [],
          label_details: insightLabelsMap.get(insight.insight_key) || []
        };
      });
      
      // Apply label filter if provided
      if (labelFilter) {
        return insights.filter(insight => 
          insight.label_details.some(label => label.label === labelFilter)
        );
      }
      
      console.log(`Successfully fetched ${insights.length} insights`);
      return insights;
      
    } catch (error) {
      console.error('Error in useInsightsData:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['insights', labelFilter],
    queryFn: fetchInsights
  });
}

export function useLabelsData() {
  const fetchLabels = async () => {
    const { data, error } = await supabase
      .from('labels')
      .select('label_key, label');
      
    if (error) {
      console.error('Error fetching labels:', error);
      throw new Error(error.message);
    }
    
    return data;
  };
  
  return useQuery({
    queryKey: ['labels'],
    queryFn: fetchLabels
  });
}
