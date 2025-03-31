
import React, { useState, useEffect } from 'react';
import { useInsightsData, Insight } from '@/hooks/use-insights-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, MessageSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FeedbackFilters, { FilterOptions } from '@/components/filters/FeedbackFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFeedbackData } from '@/hooks/use-feedback-data';

const Insights = () => {
  const { toast } = useToast();
  const { insights, isLoading, error } = useInsightsData();
  const { feedbacks } = useFeedbackData();
  
  // State for filters
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sources: [],
    segments: [],
    sentiments: []
  });

  // State for insight detail dialog
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight);
    setIsDetailOpen(true);
  };

  // Apply filters to insights
  // Note: We can't directly filter insights by these properties, but we can filter
  // by related feedbacks that match these criteria
  const filteredInsights = insights.filter(insight => {
    // If no filters are selected, show all insights
    if (!selectedSource && !selectedSegment && !selectedSentiment) {
      return true;
    }
    
    // If this insight has related feedbacks, check if any match the filters
    if (insight.related_feedbacks && insight.related_feedbacks.length > 0) {
      return insight.related_feedbacks.some(feedback => {
        const sourceMatch = !selectedSource || feedback.source === selectedSource;
        const segmentMatch = !selectedSegment || feedback.segment === selectedSegment;
        const sentimentMatch = !selectedSentiment || feedback.sentiment === selectedSentiment;
        return sourceMatch && segmentMatch && sentimentMatch;
      });
    }
    
    // If no related feedbacks or none match, don't include this insight
    return false;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-sentiment-positive text-white';
      case 'negative':
        return 'bg-sentiment-negative text-white';
      case 'mixed':
        return 'bg-sentiment-mixed text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInsights.map(insight => (
            <Card 
              key={insight.id} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleInsightClick(insight)}
            >
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Insight #{insight.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">
                  {insight.content || 'No content available for this insight.'}
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center border-t border-gray-100">
                <Badge variant="outline" className="bg-gray-50">
                  {new Date(insight.created_at).toLocaleDateString()}
                </Badge>
                
                {insight.related_feedbacks && insight.related_feedbacks.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-primary/10 text-primary">
                    <MessageSquare className="h-3 w-3" />
                    {insight.related_feedbacks.length} related
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Insight Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInsight && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Insight #{selectedInsight.id}
                </DialogTitle>
                <DialogDescription>
                  {new Date(selectedInsight.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-line">
                      {selectedInsight.content || 'No content available for this insight.'}
                    </p>
                  </CardContent>
                </Card>
                
                {selectedInsight.related_feedbacks && selectedInsight.related_feedbacks.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Related Feedback</h3>
                    <div className="grid gap-3">
                      {selectedInsight.related_feedbacks.map(feedback => (
                        <Card key={feedback.id} className="border-0 shadow-sm">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{feedback.title}</CardTitle>
                              <Badge className={getSentimentColor(feedback.sentiment)}>
                                {feedback.sentiment}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700">{feedback.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="text-muted-foreground">No related feedback found.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Insights;
