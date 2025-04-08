
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  insight_key: string;
  title?: string;
  content: string;
  created_at: string;
  label?: string;
  label_key?: string;
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
      // Get insights with their labels
      const { data, error } = await supabase
        .from('insights')
        .select(`
          insight_key,
          title,
          content,
          insights_labels(label_key),
          insights_feedbacks(feedback_key)
        `);
      
      if (error) {
        console.error('Error fetching insights data:', error);
        throw new Error(error.message || 'Failed to fetch insights data');
      }

      // Get all labels for lookup
      const { data: labelsData, error: labelsError } = await supabase
        .from('labels')
        .select('label_key, label');
        
      if (labelsError) {
        console.error('Error fetching labels data:', labelsError);
        throw new Error(labelsError.message || 'Failed to fetch labels data');
      }
      
      // Create label lookup map
      const labelMap = labelsData.reduce((acc, item) => {
        acc[item.label_key] = item.label;
        return acc;
      }, {} as Record<string, string>);

      if (!data) {
        console.log('No insights data returned');
        return [];
      }
      
      // Format insights with labels
      const formattedData: Insight[] = data.map(item => {
        // Get the first label for this insight (if any)
        let labelKey = '';
        let labelText = '';
        
        if (item.insights_labels && item.insights_labels.length > 0) {
          labelKey = item.insights_labels[0].label_key;
          labelText = labelMap[labelKey] || '';
        }
        
        return {
          insight_key: item.insight_key,
          title: item.title || `Insight #${item.insight_key.substring(0, 8)}`,
          content: item.content || '',
          created_at: new Date().toISOString(), // Using current date as fallback
          label: labelText,
          label_key: labelKey,
          related_feedbacks: item.insights_feedbacks?.map(f => f.feedback_key) || []
        };
      });
      
      console.log(`Successfully fetched ${formattedData.length} insights with their labels`);
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
