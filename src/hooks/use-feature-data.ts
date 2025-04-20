import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FeatureRequest {
  id: string;
  role: string | null;
  title: string;
  description: string | null;
  created_at: string | null;
  order: number;
}

export interface FeatureEvidence {
  id: string;
  feature_id: string | null;
  content: string | null;
  company: string | null;
  company_arr: string | null;
  employee_count: string | null;
  feedback_key: string | null;
  file_id: string | null;
  name: string | null;
  role: string | null;
  source: string | null;
  detailed_role: string | null;
}

export function useFeatureRequests() {
  const fetchFeatureRequests = async (): Promise<FeatureRequest[]> => {
    console.log('Fetching feature requests from Supabase');
    
    try {
      // Use a raw query to get feature_requests data sorted by order
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        console.error('Error fetching feature requests:', error);
        throw new Error(error.message);
      }
      
      console.log(`Successfully fetched ${data?.length || 0} feature requests`);
      return data as FeatureRequest[] || [];
    } catch (error) {
      console.error('Exception in useFeatureRequests:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['feature-requests'],
    queryFn: fetchFeatureRequests,
  });
}

export function useFeatureEvidence(featureId?: string) {
  const fetchFeatureEvidence = async (): Promise<FeatureEvidence[]> => {
    if (!featureId) return [];
    
    console.log(`Fetching evidence for feature ID ${featureId}`);
    
    try {
      // Use a raw query to get feature_evidence data since TypeScript isn't recognizing the table
      const { data, error } = await supabase
        .from('feature_evidence')
        .select('*')
        .eq('feature_id', featureId);
      
      if (error) {
        console.error('Error fetching feature evidence:', error);
        throw new Error(error.message);
      }
      
      console.log(`Successfully fetched ${data?.length || 0} evidence items`);
      return data as FeatureEvidence[] || [];
    } catch (error) {
      console.error('Exception in useFeatureEvidence:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['feature-evidence', featureId],
    queryFn: fetchFeatureEvidence,
    enabled: !!featureId,
  });
}
