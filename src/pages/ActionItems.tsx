
import React, { useState, useEffect } from 'react';
import { useActionItemsData, ActionItem } from '@/hooks/use-action-items-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckSquare, MessageSquare, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FeedbackFilters, { FilterOptions } from '@/components/filters/FeedbackFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFeedbackData } from '@/hooks/use-feedback-data';
import { Separator } from '@/components/ui/separator';

const ActionItems = () => {
  const { toast } = useToast();
  const { actionItems, isLoading, error } = useActionItemsData();
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

  // State for action item detail dialog
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem | null>(null);
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
        title: "Error loading action items",
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

  const handleActionItemClick = (actionItem: ActionItem) => {
    setSelectedActionItem(actionItem);
    setIsDetailOpen(true);
  };

  // Apply filters to action items based on related feedbacks
  const filteredActionItems = actionItems.filter(actionItem => {
    // If no filters are selected, show all action items
    if (!selectedSource && !selectedSegment && !selectedSentiment) {
      return true;
    }
    
    // Check if any related feedback matches the filters
    if (actionItem.related_feedbacks && actionItem.related_feedbacks.length > 0) {
      return actionItem.related_feedbacks.some(feedback => {
        const sourceMatch = !selectedSource || feedback.source === selectedSource;
        const segmentMatch = !selectedSegment || feedback.segment === selectedSegment;
        const sentimentMatch = !selectedSentiment || feedback.sentiment === selectedSentiment;
        return sourceMatch && segmentMatch && sentimentMatch;
      });
    }
    
    // If no related feedbacks or none match, don't include this action item
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
        <h2 className="text-2xl font-semibold tracking-tight">Action Items</h2>
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
      ) : filteredActionItems.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No action items found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActionItems.map(actionItem => (
            <Card 
              key={actionItem.id} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleActionItemClick(actionItem)}
            >
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Action Item #{actionItem.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">
                  {actionItem.content || 'No content available for this action item.'}
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center border-t border-gray-100">
                <Badge variant="outline" className="bg-gray-50">
                  {new Date(actionItem.created_at).toLocaleDateString()}
                </Badge>
                
                <div className="flex gap-2">
                  {actionItem.related_insights && actionItem.related_insights.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-700">
                      <Lightbulb className="h-3 w-3" />
                      {actionItem.related_insights.length}
                    </Badge>
                  )}
                  
                  {actionItem.related_feedbacks && actionItem.related_feedbacks.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-primary/10 text-primary">
                      <MessageSquare className="h-3 w-3" />
                      {actionItem.related_feedbacks.length}
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Action Item Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedActionItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Action Item #{selectedActionItem.id}
                </DialogTitle>
                <DialogDescription>
                  {new Date(selectedActionItem.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-line">
                      {selectedActionItem.content || 'No content available for this action item.'}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Related Insights */}
                {selectedActionItem.related_insights && selectedActionItem.related_insights.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Related Insights
                    </h3>
                    <div className="grid gap-3">
                      {selectedActionItem.related_insights.map(insight => (
                        <Card key={insight.id} className="border-0 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Insight #{insight.id}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700">{insight.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Separator if both insights and feedbacks exist */}
                {selectedActionItem.related_insights?.length && selectedActionItem.related_feedbacks?.length && (
                  <Separator />
                )}
                
                {/* Related Feedbacks */}
                {selectedActionItem.related_feedbacks && selectedActionItem.related_feedbacks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Related Feedback
                    </h3>
                    <div className="grid gap-3">
                      {selectedActionItem.related_feedbacks.map(feedback => (
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
                )}
                
                {/* Show a message if no relationships */}
                {(!selectedActionItem.related_insights?.length && !selectedActionItem.related_feedbacks?.length) && (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="text-muted-foreground">No related insights or feedback found.</p>
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

export default ActionItems;
