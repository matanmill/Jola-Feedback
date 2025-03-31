
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useInsightsData } from '@/hooks/use-insights-data';
import { useToast } from '@/components/ui/use-toast';
import FeedbackFilters from '@/components/filters/FeedbackFilters';

const Insights = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  
  const { 
    insightItems, 
    isLoading, 
    isError, 
    selectedInsight, 
    setSelectedInsight,
    fetchRelatedFeedbacks,
    isFiltering,
    setIsFiltering
  } = useInsightsData(filters);
  
  const [relatedFeedbacks, setRelatedFeedbacks] = useState<any[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const { toast } = useToast();

  const handleInsightClick = async (insight: any) => {
    setSelectedInsight(insight);
    setIsLoadingRelated(true);
    
    try {
      const feedbacks = await fetchRelatedFeedbacks(insight.id);
      setRelatedFeedbacks(feedbacks);
    } catch (error) {
      console.error("Error fetching related feedbacks:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load related feedbacks. Please try again."
      });
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedInsight(null);
    setRelatedFeedbacks([]);
  };

  const handleFilterChange = (type: 'source' | 'segment' | 'sentiment', value: string | null) => {
    if (type === 'source') setSelectedSource(value);
    if (type === 'segment') setSelectedSegment(value);
    if (type === 'sentiment') setSelectedSentiment(value);
    
    // Update filters for API calls
    const newFilters: Record<string, string> = {};
    if (type === 'source' ? value : selectedSource) newFilters.source = type === 'source' ? value || '' : selectedSource || '';
    if (type === 'segment' ? value : selectedSegment) newFilters.segment = type === 'segment' ? value || '' : selectedSegment || '';
    if (type === 'sentiment' ? value : selectedSentiment) newFilters.sentiment = type === 'sentiment' ? value || '' : selectedSentiment || '';
    
    setFilters(newFilters);
    setIsFiltering(Object.values(newFilters).some(value => value !== ''));
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md p-6">
          <CardContent className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-destructive">Error Loading Data</h3>
            <p className="text-gray-600">Failed to load insights. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default filter options in case the data isn't loaded yet
  const filterOptions = {
    sources: ['Customer Support', 'Social Media', 'Surveys'].filter(Boolean),
    segments: ['Enterprise', 'SMB', 'Consumer'].filter(Boolean),
    sentiments: ['positive', 'neutral', 'negative'].filter(Boolean)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
        <FeedbackFilters 
          options={filterOptions}
          onFilterChange={handleFilterChange}
          selectedSource={selectedSource}
          selectedSegment={selectedSegment}
          selectedSentiment={selectedSentiment}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : insightItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insightItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleInsightClick(item)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-lg line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{item.content}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={
                    item.sentiment === 'positive' ? 'default' : 
                    item.sentiment === 'negative' ? 'destructive' : 'secondary'
                  }>
                    {item.sentiment || 'neutral'}
                  </Badge>
                  {item.relatedFeedbackIds && (
                    <Badge variant="outline">{item.relatedFeedbackIds.length} Feedbacks</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">No Insights Found</h3>
            <p className="text-sm text-muted-foreground">
              {isFiltering ? "Try adjusting your filters" : "Add some insights to get started"}
            </p>
          </div>
        </div>
      )}

      <Dialog open={!!selectedInsight} onOpenChange={(open) => !open && handleCloseDialog()}>
        {selectedInsight && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedInsight.title}</DialogTitle>
              <DialogDescription className="text-base font-normal text-foreground mt-2">
                {selectedInsight.content}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Related Feedbacks</h4>
              
              {isLoadingRelated ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : relatedFeedbacks.length > 0 ? (
                <div className="space-y-3">
                  {relatedFeedbacks.map((feedback) => (
                    <Card key={feedback.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-x-2">
                            <Badge>{feedback.source || 'Unknown'}</Badge>
                            <Badge variant="outline">{feedback.segment || 'General'}</Badge>
                          </div>
                          <Badge variant={
                            feedback.sentiment === 'positive' ? 'default' : 
                            feedback.sentiment === 'negative' ? 'destructive' : 'secondary'
                          }>
                            {feedback.sentiment || 'neutral'}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">{feedback.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No related feedbacks found.</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Insights;
