
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
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, User, Tag, Building } from 'lucide-react';
import { useFeedbackData } from '@/hooks/use-feedback-data';
import { FeedbackDetail } from '@/components/feedback-hub/FeedbackDetail';
import { Feedback } from '@/types/feedback';
import DebugPanel from '@/components/feedback-hub/DebugPanel';
import FeedbackFilters, { FilterOptions } from '@/components/filters/FeedbackFilters';

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
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sources: [],
    segments: [],
    sentiments: []
  });

  const { 
    feedbacks, 
    isLoading, 
    error, 
    refetch 
  } = useFeedbackData();

  // Extract filter options from feedbacks
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

  const handleFilterChange = (type: 'source' | 'segment' | 'sentiment', value: string | null) => {
    if (type === 'source') setSelectedSource(value);
    if (type === 'segment') setSelectedSegment(value);
    if (type === 'sentiment') setSelectedSentiment(value);
  };

  const getSentimentColor = (sentiment: string) => {
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
          onRefresh={refetch}
        />
      )}

      {/* Filters */}
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Feedback Repository</h2>
        <FeedbackFilters 
          options={filterOptions}
          onFilterChange={handleFilterChange}
          selectedSource={selectedSource}
          selectedSegment={selectedSegment}
          selectedSentiment={selectedSentiment}
        />
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
                {feedback.source && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
                    <MessageSquare className="h-3 w-3" />
                    {feedback.source}
                  </Badge>
                )}
                {feedback.client && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
                    <Building className="h-3 w-3" />
                    {feedback.client}
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
