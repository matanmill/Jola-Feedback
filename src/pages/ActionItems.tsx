
import React, { useState, useEffect } from 'react';
import { useActionItemsData, ActionItem } from '@/hooks/use-action-items-data';
import { useFeedbackData } from '@/hooks/use-feedback-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FeedbackFilters, { FilterOptions } from '@/components/filters/FeedbackFilters';

const ActionItems = () => {
  const { toast } = useToast();
  const { actionItems, isLoading, error } = useActionItemsData();
  const { feedbacks } = useFeedbackData();
  
  // Filters
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sources: [],
    segments: [],
    sentiments: []
  });

  // Extract filter options
  useEffect(() => {
    // For action items, we need to look at the related feedbacks to extract filter options
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

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading action items",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Filter action items based on related feedbacks
  const filteredActionItems = actionItems.filter(actionItem => {
    // If no filters are applied, show all action items
    if (!selectedSource && !selectedSegment && !selectedSentiment) {
      return true;
    }
    
    // Check if any related feedback matches the filters
    const relatedFeedbackIDs = actionItem.related_feedbacks || [];
    const relatedFeedbacks = feedbacks.filter(f => relatedFeedbackIDs.includes(Number(f.id)));

    // Apply filters
    return relatedFeedbacks.some(feedback => {
      const sourceMatch = !selectedSource || feedback.source === selectedSource;
      const segmentMatch = !selectedSegment || feedback.segment === selectedSegment;
      const sentimentMatch = !selectedSentiment || feedback.sentiment === selectedSentiment;
      return sourceMatch && segmentMatch && sentimentMatch;
    });
  });

  const handleFilterChange = (type: 'source' | 'segment' | 'sentiment', value: string | null) => {
    if (type === 'source') setSelectedSource(value);
    if (type === 'segment') setSelectedSegment(value);
    if (type === 'sentiment') setSelectedSentiment(value);
  };

  const getRelatedFeedbacks = (actionItem: ActionItem) => {
    const relatedFeedbackIDs = actionItem.related_feedbacks || [];
    return feedbacks.filter(f => relatedFeedbackIDs.includes(Number(f.id)));
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
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
      
      {/* Action Items Content */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b px-6">
          <CardTitle>Action Items List</CardTitle>
        </CardHeader>
        
        {isLoading ? (
          <CardContent className="p-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        ) : filteredActionItems.length === 0 ? (
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-medium text-muted-foreground">No action items found</h3>
            <p className="text-muted-foreground mt-2">
              {selectedSource || selectedSegment || selectedSentiment
                ? 'Try adjusting your filters to see more results.'
                : 'No action items have been created yet.'}
            </p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action Item</TableHead>
                  <TableHead>Related Feedbacks</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActionItems.map(item => {
                  const relatedFeedbacks = getRelatedFeedbacks(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.content}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {relatedFeedbacks.length > 0 ? (
                            relatedFeedbacks.map(feedback => (
                              <Badge key={feedback.id} variant="outline" className="bg-gray-100">
                                {feedback.title.substring(0, 20)}...
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ActionItems;
