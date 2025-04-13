import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  insight_key: string;
  content: string;
  Title?: string;
  labels?: string[];
}

export interface InsightWithLabelDetails extends Insight {
  label_details: {
    label_key: string;
    label: string;
  }[];
}

export interface InsightWithFeedback {
  insight_key: string;
  insight_content: string;
  title: string;
  insight_created_at: string;
  feedback_key: string;
  feedback_content: string;
  source: string;
  role: string;
  feedback_created_at: string;
}

export interface InsightWithChunk {
  insight_key: string;
  insight_content: string;
  title: string;
  insight_created_at: string;
  chunk_key: string;
  chunk_content: string;
  source: string;
  role: string;
  feedback_created_at: string;
}


export interface InsightWithLabels {
  insight_key: string;
  content: string;
  title: string;
  created_at: string;
  label_key: string;
  label: string;
}

export function useInsightsData(labelFilter?: string) {
  const fetchInsights = async (): Promise<InsightWithLabelDetails[]> => {
    try {
      console.log(`Fetching insights${labelFilter ? ` with label filter: ${labelFilter}` : ' without label filter'}`);
      
      // Use the get_insights_with_labels function
      const { data: insightsWithLabelsData, error: insightsWithLabelsError } = await supabase
        .rpc('get_insights_with_labels');
        
      if (insightsWithLabelsError) {
        console.error('Error fetching insights with labels:', insightsWithLabelsError);
        throw new Error(insightsWithLabelsError.message);
      }
      
      console.log('Raw insights with labels data:', insightsWithLabelsData);
      
      // Group by insight_key to create the right structure
      const insightMap = new Map<string, InsightWithLabelDetails>();
      
      if (Array.isArray(insightsWithLabelsData)) {
        insightsWithLabelsData.forEach((item: InsightWithLabels) => {
          if (!insightMap.has(item.insight_key)) {
            insightMap.set(item.insight_key, {
              insight_key: item.insight_key,
              content: item.content,
              Title: item.title,
              labels: [],
              label_details: []
            });
          }
          
          const insight = insightMap.get(item.insight_key)!;
          if (item.label) {
            insight.labels = insight.labels || [];
            insight.labels.push(item.label);
            insight.label_details.push({
              label_key: item.label_key,
              label: item.label
            });
          }
        });
      }
      
      const insights = Array.from(insightMap.values());
      
      // Apply label filter if provided
      let filteredInsights = insights;
      if (labelFilter) {
        console.log(`Filtering insights for label key: ${labelFilter}`);
        filteredInsights = insights.filter(insight => 
          insight.label_details.some(label => label.label_key === labelFilter)
        );
        console.log(`Found ${filteredInsights.length} insights matching label key: ${labelFilter}`);
        
        // Log the filtered insights for debugging
        filteredInsights.forEach(insight => {
          console.log(`Matching insight: ${insight.insight_key}, Title: ${insight.Title}`);
          console.log(`Labels:`, insight.labels);
        });
      }
      
      console.log(`Successfully fetched ${filteredInsights.length} insights with their labels`);
      return filteredInsights;
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

export function useInsightChunksData(insightKey?: string) {
  const fetchInsightChunks = async (): Promise<InsightWithChunk[]> => {
    try {
      if (!insightKey) {
        return [];
      }
      
      console.log(`Fetching chunks for insight ${insightKey}...`);
      
      const { data, error } = await supabase
        .rpc('get_insights_with_chunks');
      
      if (error) {
        console.error('Error fetching insight chunks:', error);
        throw new Error(error.message);
      }
      
      // Ensure proper type handling and conversion of data
      if (!Array.isArray(data)) {
        console.log('No feedback data returned or invalid format');
        return [];
      }
      
      // Cast returned data to the correct type and filter for the specific insight
      console.log('CHECKINGGG   Data:', data);
      const typedData = data as InsightWithChunk[];
      console.log('CHECKINGGG   typedData:', data);
      const relatedChunks = typedData.filter(item => 
        item.insight_key === insightKey
      );
      
      console.log(`Found ${relatedChunks.length} feedbacks for insight ${insightKey}`);
      console.log('CHECKINGGG   relatedChunks:', relatedChunks);
      return relatedChunks;
    } catch (error) {
      console.error('Error in useInsightChunksData:', error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: ['insightChunks', insightKey],
    queryFn: fetchInsightChunks,
    enabled: !!insightKey
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
