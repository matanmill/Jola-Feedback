
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Tag } from 'lucide-react';
import { useFeedbackData, Feedback } from '@/hooks/use-feedback-data';
import { FeedbackDetail } from '@/components/feedback-hub/FeedbackDetail';
import DebugPanel from '@/components/feedback-hub/DebugPanel';

interface FeedbackRepositoryProps {
  isDebugMode: boolean;
}

const FeedbackRepository: React.FC<FeedbackRepositoryProps> = ({ isDebugMode }) => {
  const { toast } = useToast();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Filters
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);

  const { 
    data: feedbacks = [], 
    isLoading, 
    error, 
    refetch 
  } = useFeedbackData();

  // Filter feedbacks based on selected filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const sourceMatch = !selectedSource || feedback.source === selectedSource;
    const segmentMatch = !selectedSegment || feedback.segment === selectedSegment;
    const sentimentMatch = !selectedSentiment || feedback.sentiment === selectedSentiment;
    return sourceMatch && segmentMatch && sentimentMatch;
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading feedback data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleFeedbackClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailOpen(true);
  };

  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      case 'mixed':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Panel */}
      {isDebugMode && (
        <DebugPanel 
          data={{ 
            feedbacks, 
            filteredCount: filteredFeedbacks.length,
            activeFilters: {
              source: selectedSource,
              segment: selectedSegment,
              sentiment: selectedSentiment
            },
            error: error?.message || null
          }} 
          onRefresh={() => refetch()}
        />
      )}

      {/* Feedback List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No feedback found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeedbacks.map((feedback) => (
            <Card 
              key={feedback.id} 
              className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
              onClick={() => handleFeedbackClick(feedback)}
            >
              <CardHeader className="pb-2 bg-white rounded-t-lg">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {feedback.content.substring(0, 50) + (feedback.content.length > 50 ? '...' : '')}
                  </CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSentimentColor(feedback.sentiment)}`}>
                    {feedback.sentiment || 'Neutral'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {feedback.content || 'No content available'}
                </p>
              </CardContent>
              <CardFooter className="pt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {feedback.source && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
                    <MessageSquare className="h-3 w-3" />
                    {feedback.source}
                  </Badge>
                )}
                {feedback.segment && (
                  <Badge 
                    variant="secondary" 
                    className={`flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 ${selectedSegment === feedback.segment ? 'border-primary' : ''}`}
                  >
                    <Tag className="h-3 w-3" />
                    {feedback.segment}
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Feedback Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <FeedbackDetail feedback={selectedFeedback} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackRepository;
