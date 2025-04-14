import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

// Define types for the dashboard data
export interface FeedbackExample {
  id: string;
  content: string;
  source: string;
  role?: string;
  sentiment: string;
  created_at: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
}

export interface MetadataDistributionItem {
  name: string;
  value: number;
}

export interface DashboardData {
  timeSeriesData: TimeSeriesDataPoint[];
  positiveFeedbacks: FeedbackExample[];
  negativeFeedbacks: FeedbackExample[];
}

export interface DashboardCounts {
  feedback: number;
  insights: number;
  actionItems: number;
  sentimentScore: number;
  newFeedback: number;
  newInsights: number;
  newActionItems: number;
  sentimentTrend: number;
}

export interface MetadataDistribution {
  roles: MetadataDistributionItem[];
  arr: MetadataDistributionItem[];
  employeeCount: MetadataDistributionItem[];
}

// Mock data for items without RPC functions
const MOCK_DASHBOARD_COUNTS: DashboardCounts = {
  feedback: 0, // Will be replaced with actual count
  insights: 42,
  actionItems: 28,
  sentimentScore: 7.5,
  newFeedback: 24,
  newInsights: 8,
  newActionItems: 5,
  sentimentTrend: 0.3
};

const MOCK_POSITIVE_FEEDBACKS: FeedbackExample[] = [
  {
    id: '1',
    content: 'The new dashboard feature is amazing! It helps me track all my feedback in one place.',
    source: 'Interview',
    role: 'Product Manager',
    sentiment: 'Positive',
    created_at: '2023-07-10T14:30:00Z'
  },
  {
    id: '2',
    content: 'I love how easy it is to navigate between different sections of the app.',
    source: 'Google Docs',
    role: 'CEO',
    sentiment: 'Positive',
    created_at: '2023-07-08T09:15:00Z'
  }
];

const MOCK_NEGATIVE_FEEDBACKS: FeedbackExample[] = [
  {
    id: '3',
    content: 'I found it difficult to understand how to generate insights from my feedback.',
    source: 'Interview',
    role: 'UX Designer',
    sentiment: 'Negative',
    created_at: '2023-07-09T11:20:00Z'
  },
  {
    id: '4',
    content: 'The loading times could be improved, especially when dealing with large amounts of feedback.',
    source: 'Google Docs',
    role: 'Engineer',
    sentiment: 'Negative',
    created_at: '2023-07-07T13:40:00Z'
  }
];

const MOCK_SENTIMENT_DISTRIBUTION: MetadataDistributionItem[] = [
  { name: 'Positive', value: 75 },
  { name: 'Negative', value: 25 },
  { name: 'Neutral', value: 20 }
];

export function useDashboardData() {
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase.rpc('count_rows', { tablename: 'feedbacks' });
      if (error) {
        console.error('Error fetching feedback count:', error);
      } else {
        setFeedbackCount(data);
      }
      setIsLoading(false);
    };

    fetchCount();
  }, []);

  // Fetch time series data
  const { data: timeSeriesData, isLoading: isTimeSeriesLoading } = useQuery({
    queryKey: ['dashboardTimeSeries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('feedbacks_created_histogram', { granularity: 'month' });
      
      if (error) throw error;
      
      return data.map((item: any) => {
        const dateObj = new Date(item.date_bucket);
        const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(dateObj);
        
        return {
          date: month,
          count: parseInt(item.count)
        };
      });
    }
  });

  // Fetch role distribution
  const { data: roleDistribution, isLoading: isRoleLoading } = useQuery({
    queryKey: ['roleDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('feedback_role_distribution');
      if (error) throw error;
      return data.map((item: any) => ({
        name: item.role || 'Unknown',
        value: item.count
      }));
    }
  });

  // Fetch source distribution
  const { data: sourcesDistribution, isLoading: isSourcesLoading } = useQuery({
    queryKey: ['sourcesDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('feedback_source_distribution');
      if (error) throw error;
      return data.map((item: any) => ({
        name: item.source || 'Unknown',
        value: item.count
      }));
    }
  });

  // Fetch ARR distribution
  const { data: arrDistribution, isLoading: isArrLoading } = useQuery({
    queryKey: ['arrDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('feedback_arr_distribution');
      if (error) throw error;
      return data.map((item: any) => ({
        name: item.arr_range || 'Unknown',
        value: item.count
      }));
    }
  });

  // Fetch employee count distribution
  const { data: employeeCountDistribution, isLoading: isEmployeeCountLoading } = useQuery({
    queryKey: ['employeeCountDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('feedback_employee_count_distribution');
      if (error) throw error;
      return data.map((item: any) => ({
        name: item.employee_range || 'Unknown',
        value: parseInt(item.count)
      }));
    }
  });

  // Combine metadata distributions
  const metadataDistribution = {
    roles: roleDistribution || [],
    arr: arrDistribution || [],
    employeeCount: employeeCountDistribution || []
  };

  // Export to Slack function (mock implementation)
  const exportToSlack = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      message: 'Dashboard exported to Slack successfully'
    };
  };

  return {
    data: {
      timeSeriesData: timeSeriesData || [],
      positiveFeedbacks: MOCK_POSITIVE_FEEDBACKS,
      negativeFeedbacks: MOCK_NEGATIVE_FEEDBACKS
    },
    counts: {
      ...MOCK_DASHBOARD_COUNTS,
      feedback: feedbackCount || 0
    },
    metadataDistribution,
    sourcesDistribution: sourcesDistribution || [],
    sentimentDistribution: MOCK_SENTIMENT_DISTRIBUTION,
    isLoading,
    error: null,
    exportToSlack
  };
} 