
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  id: number;
  content: string;
  created_at: string;
}

export function useInsightsData() {
  const fetchInsights = async (): Promise<Insight[]> => {
    console.log('Fetching insights data from Supabase');
    
    try {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching insights data:', error);
        throw new Error(error.message || 'Failed to fetch insights data');
      }
      
      console.log(`Successfully fetched ${data?.length} insights`);
      
      // Transform data
      const formattedData: Insight[] = data?.map(item => ({
        id: item.insight_id,
        content: item.content || '',
        created_at: item.created_at
      })) || [];
      
      return formattedData;
    } catch (error) {
      console.error('Exception fetching insights data:', error);
      throw error;
    }
  };

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
    retry: 1,
  });

  return {
    insights: data,
    isLoading,
    error,
    refetch
  };
}
