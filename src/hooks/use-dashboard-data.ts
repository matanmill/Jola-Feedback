import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

// Mock data for dashboard demonstration
const MOCK_TIME_SERIES_DATA: TimeSeriesDataPoint[] = [
  { date: '2023-07-01', count: 3 },
  { date: '2023-07-02', count: 5 },
  { date: '2023-07-03', count: 2 },
  { date: '2023-07-04', count: 7 },
  { date: '2023-07-05', count: 4 },
  { date: '2023-07-06', count: 6 },
  { date: '2023-07-07', count: 8 },
  { date: '2023-07-08', count: 5 },
  { date: '2023-07-09', count: 3 },
  { date: '2023-07-10', count: 9 },
  { date: '2023-07-11', count: 11 },
  { date: '2023-07-12', count: 7 },
  { date: '2023-07-13', count: 6 },
  { date: '2023-07-14', count: 4 },
];

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
  },
  {
    id: '3',
    content: 'The insights generation is spot on and helps me make better decisions for my product.',
    source: 'Email',
    role: 'VP Product',
    sentiment: 'Positive',
    created_at: '2023-07-05T16:45:00Z'
  }
];

const MOCK_NEGATIVE_FEEDBACKS: FeedbackExample[] = [
  {
    id: '4',
    content: 'I found it difficult to understand how to generate insights from my feedback.',
    source: 'Interview',
    role: 'UX Designer',
    sentiment: 'Negative',
    created_at: '2023-07-09T11:20:00Z'
  },
  {
    id: '5',
    content: 'The loading times could be improved, especially when dealing with large amounts of feedback.',
    source: 'Google Docs',
    role: 'Engineer',
    sentiment: 'Negative',
    created_at: '2023-07-07T13:40:00Z'
  }
];

const MOCK_DASHBOARD_COUNTS: DashboardCounts = {
  feedback: 120,
  insights: 42,
  actionItems: 28,
  sentimentScore: 7.5,
  newFeedback: 24,
  newInsights: 8,
  newActionItems: 5,
  sentimentTrend: 0.3
};

const MOCK_METADATA_DISTRIBUTION: MetadataDistribution = {
  roles: [
    { name: 'Product Manager', value: 35 },
    { name: 'CEO', value: 25 },
    { name: 'CTO', value: 20 },
    { name: 'VP Product', value: 15 },
    { name: 'Engineer', value: 10 },
    { name: 'Designer', value: 8 },
    { name: 'Other', value: 7 }
  ],
  arr: [
    { name: 'Less than 10M', value: 30 },
    { name: '10M-50M', value: 45 },
    { name: '51M-100M', value: 25 },
    { name: 'Over 100M', value: 20 }
  ],
  employeeCount: [
    { name: 'Less than 100', value: 22 },
    { name: '100-500', value: 38 },
    { name: '501-1000', value: 25 },
    { name: '1001-5000', value: 27 },
    { name: 'Over 5000', value: 8 }
  ]
};

const MOCK_SOURCES_DISTRIBUTION: MetadataDistributionItem[] = [
  { name: 'Google Docs', value: 65 },
  { name: 'Interview', value: 25 },
  { name: 'Email', value: 15 },
  { name: 'Survey', value: 10 },
  { name: 'Other', value: 5 }
];

const MOCK_SENTIMENT_DISTRIBUTION: MetadataDistributionItem[] = [
  { name: 'Positive', value: 75 },
  { name: 'Negative', value: 25 },
  { name: 'Neutral', value: 20 }
];

export function useDashboardData() {
  // Use mock data for now, will replace with actual API calls later
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async (): Promise<DashboardData> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return {
        timeSeriesData: MOCK_TIME_SERIES_DATA,
        positiveFeedbacks: MOCK_POSITIVE_FEEDBACKS,
        negativeFeedbacks: MOCK_NEGATIVE_FEEDBACKS
      };
    }
  });
  
  // Mock dashboard counts
  const { data: counts, isLoading: isCountsLoading } = useQuery({
    queryKey: ['dashboardCounts'],
    queryFn: async (): Promise<DashboardCounts> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return MOCK_DASHBOARD_COUNTS;
    }
  });
  
  // Mock metadata distribution
  const { data: metadataDistribution, isLoading: isMetadataLoading } = useQuery({
    queryKey: ['metadataDistribution'],
    queryFn: async (): Promise<MetadataDistribution> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return MOCK_METADATA_DISTRIBUTION;
    }
  });
  
  // Mock sources distribution
  const { data: sourcesDistribution, isLoading: isSourcesLoading } = useQuery({
    queryKey: ['sourcesDistribution'],
    queryFn: async (): Promise<MetadataDistributionItem[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return MOCK_SOURCES_DISTRIBUTION;
    }
  });
  
  // Mock sentiment distribution
  const { data: sentimentDistribution, isLoading: isSentimentLoading } = useQuery({
    queryKey: ['sentimentDistribution'],
    queryFn: async (): Promise<MetadataDistributionItem[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return MOCK_SENTIMENT_DISTRIBUTION;
    }
  });
  
  // Export to Slack function (mock implementation)
  const exportToSlack = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Dashboard exported to Slack successfully'
    };
  };
  
  return {
    data,
    counts,
    metadataDistribution,
    sourcesDistribution,
    sentimentDistribution,
    isLoading: isLoading || isCountsLoading || isMetadataLoading || isSourcesLoading || isSentimentLoading,
    error,
    exportToSlack
  };
} 