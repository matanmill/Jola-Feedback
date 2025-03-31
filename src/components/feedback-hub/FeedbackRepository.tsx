
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, User, Tag, Building } from 'lucide-react';
import { useFeedbackData } from '@/hooks/use-feedback-data';
import { FeedbackDetail } from '@/components/feedback-hub/FeedbackDetail';
import { Feedback } from '@/types/feedback';
import DebugPanel from '@/components/feedback-hub/DebugPanel';

interface FeedbackRepositoryProps {
  isDebugMode: boolean;
}

const FeedbackRepository: React.FC<FeedbackRepositoryProps> = ({ isDebugMode }) => {
  const { toast } = useToast();
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [segments, setSegments] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { 
    feedbacks, 
    isLoading, 
    error, 
    refetch 
  } = useFeedbackData();

  // Filter feedbacks by selected segment
  const filteredFeedbacks = selectedSegment 
    ? feedbacks.filter(feedback => feedback.segment === selectedSegment)
    : feedbacks;

  // Extract unique segments for filter buttons
  useEffect(() => {
    if (feedbacks.length > 0) {
      const uniqueSegments = Array.from(
        new Set(feedbacks.map(feedback => feedback.segment))
      ).filter(Boolean) as string[];
      
      setSegments(uniqueSegments);
    }
  }, [feedbacks]);

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

  const handleSegmentClick = (segment: string) => {
    if (selectedSegment === segment) {
      setSelectedSegment(null);
    } else {
      setSelectedSegment(segment);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-sentiment-positive';
      case 'negative':
        return 'bg-sentiment-negative';
      case 'mixed':
        return 'bg-sentiment-mixed';
      default:
        return 'bg-sentiment-neutral';
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-sentiment-positive';
      case 'negative':
        return 'text-sentiment-negative';
      case 'mixed':
        return 'text-sentiment-mixed';
      default:
        return 'text-sentiment-neutral';
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
            segments,
            selectedSegment,
            error: error?.message || null
          }} 
          onRefresh={refetch}
        />
      )}

      {/* Segment Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-gray-500 self-center mr-2">
          Filter by segment:
        </span>
        <Button
          variant={selectedSegment === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedSegment(null)}
        >
          All
        </Button>
        {segments.map(segment => (
          <Button
            key={segment}
            variant={selectedSegment === segment ? "default" : "outline"}
            size="sm"
            onClick={() => handleSegmentClick(segment)}
          >
            {segment}
          </Button>
        ))}
      </div>

      {/* Feedback List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No feedback found</h3>
          <p className="text-muted-foreground mt-2">
            {selectedSegment 
              ? `No feedback available for segment "${selectedSegment}".` 
              : "No feedback data available."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeedbacks.map((feedback) => (
            <Card 
              key={feedback.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleFeedbackClick(feedback)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{feedback.title}</CardTitle>
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
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {feedback.source || 'Unknown'}
                </Badge>
                {feedback.client && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {feedback.client}
                  </Badge>
                )}
                {feedback.segment && (
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${selectedSegment === feedback.segment ? 'border-primary' : ''}`}
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
