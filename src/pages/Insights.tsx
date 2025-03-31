import React, { useState, useEffect } from 'react';
import { useInsightsData } from '@/hooks/use-insights-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FeedbackFilters, { FilterOptions } from '@/components/filters/FeedbackFilters';
import { useFeedbackData } from '@/hooks/use-feedback-data';

const Insights = () => {
  const { toast } = useToast();
  const { insights, isLoading, error } = useInsightsData();
  const { feedbacks } = useFeedbackData();
  
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sources: [],
    segments: [],
    sentiments: []
  });

  useEffect(() => {
    if (feedbacks.length > 0) {
      const uniqueSources = Array.from(
        new Set(feedbacks.map(feedback => feedback.source))
      ).filter(Boolean) as string[];
      
      const uniqueSegments = Array.from(
        new Set(feedbacks.map(feedback => feedback.segment))
      ).filter(Boolean) as string[];
      
      const uniqueSentiments = Array.from(
        new Set(feedbacks.map(feedback => feedback.sentiment))
      ).filter(Boolean) as string[];
      
      setFilterOptions({
        sources: uniqueSources,
        segments: uniqueSegments,
        sentiments: uniqueSentiments
      });
    }
  }, [feedbacks]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading insights",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleFilterChange = (type: 'source' | 'segment' | 'sentiment', value: string | null) => {
    if (type === 'source') setSelectedSource(value);
    if (type === 'segment') setSelectedSegment(value);
    if (type === 'sentiment') setSelectedSentiment(value);
  };

  const filteredInsights = insights;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Insights</h2>
        <FeedbackFilters 
          options={filterOptions}
          onFilterChange={handleFilterChange}
          selectedSource={selectedSource}
          selectedSegment={selectedSegment}
          selectedSentiment={selectedSentiment}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No insights found</h3>
          <p className="text-muted-foreground mt-2">
            Insights will be generated based on feedback analysis.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredInsights.map(insight => (
            <Card key={insight.id} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Insight #{insight.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {insight.content || 'No content available for this insight.'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-gray-50">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;
