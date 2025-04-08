
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
      console.log('Fetching insights with labels data from Supabase...');
      
      // Use the get_insights_with_labels function
      const { data: insightsWithLabelsData, error: insightsWithLabelsError } = await supabase
        .rpc('get_insights_with_labels');
        
      if (insightsWithLabelsError) {
        console.error('Error fetching insights with labels:', insightsWithLabelsError);
        throw new Error(insightsWithLabelsError.message);
      }
      
      console.log('Insights with labels data:', insightsWithLabelsData);
      
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
      if (labelFilter) {
        return insights.filter(insight => 
          insight.label_details.some(label => label.label === labelFilter)
        );
      }
      
      console.log(`Successfully fetched ${insights.length} insights with their labels`);
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

export function useInsightFeedbacksData(insightKey?: string) {
  const fetchInsightFeedbacks = async (): Promise<InsightWithFeedback[]> => {
    try {
      if (!insightKey) {
        return [];
      }
      
      console.log(`Fetching feedbacks for insight ${insightKey}...`);
      
      const { data, error } = await supabase
        .rpc('get_insights_with_feedbacks');
      
      if (error) {
        console.error('Error fetching insight feedbacks:', error);
        throw new Error(error.message);
      }
      
      // Ensure proper type handling and conversion of data
      if (!Array.isArray(data)) {
        console.log('No feedback data returned or invalid format');
        return [];
      }
      
      // Cast returned data to the correct type and filter for the specific insight
      const typedData = data as InsightWithFeedback[];
      const relatedFeedbacks = typedData.filter(item => 
        item.insight_key === insightKey
      );
      
      console.log(`Found ${relatedFeedbacks.length} feedbacks for insight ${insightKey}`);
      
      return relatedFeedbacks;
    } catch (error) {
      console.error('Error in useInsightFeedbacksData:', error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: ['insightFeedbacks', insightKey],
    queryFn: fetchInsightFeedbacks,
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
