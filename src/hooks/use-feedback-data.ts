
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { Feedback } from '@/types/feedback';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export function useFeedbackData() {
  const fetchFeedbacks = async (): Promise<Feedback[]> => {
    console.log('Fetching feedback data from Supabase');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Anon Key is missing');
      throw new Error('Supabase configuration is incomplete');
    }
    
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
      return data || [];
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
