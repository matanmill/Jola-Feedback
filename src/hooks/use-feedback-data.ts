
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feedback } from '@/types/feedback';
import { supabase } from '@/integrations/supabase/client';

export function useFeedbackData() {
  const fetchFeedbacks = async (): Promise<Feedback[]> => {
    console.log('Fetching feedback data from Supabase');
    
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedback data:', error);
        throw new Error(error.message || 'Failed to fetch feedback data');
      }
      
      console.log(`Successfully fetched ${data?.length} feedbacks`);
      
      // Transform data to match Feedback type if needed
      const formattedData: Feedback[] = data?.map(item => ({
        id: item.feedback_id,
        title: item.content.substring(0, 50) + (item.content.length > 50 ? '...' : ''),
        content: item.content || '',
        source: item.source || 'Unknown',
        sentiment: item.sentiment || 'neutral',
        segment: item.segment || '',
        client: 'Jola', // Default client 
        created_at: item.created_at || new Date().toISOString()
      })) || [];
      
      return formattedData;
    } catch (error) {
      console.error('Exception fetching feedback data:', error);
      throw error;
    }
  };

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: fetchFeedbacks,
    retry: 1,
  });

  return {
    feedbacks: data,
    isLoading,
    error,
    refetch
  };
}
