
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useActionItemsData } from '@/hooks/use-action-items-data';
import { useToast } from '@/components/ui/use-toast';
import FeedbackFilters from '@/components/filters/FeedbackFilters';

const ActionItems = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { 
    actionItems, 
    isLoading, 
    isError, 
    selectedActionItem, 
    setSelectedActionItem,
    fetchRelatedInsights,
    isFiltering,
    setIsFiltering
  } = useActionItemsData(filters);
  
  const [relatedInsights, setRelatedInsights] = useState<any[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const { toast } = useToast();

  const handleActionItemClick = async (actionItem: any) => {
    setSelectedActionItem(actionItem);
    setIsLoadingRelated(true);
    
    try {
      const insights = await fetchRelatedInsights(actionItem.id);
      setRelatedInsights(insights);
    } catch (error) {
      console.error("Error fetching related insights:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load related insights. Please try again."
      });
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedActionItem(null);
    setRelatedInsights([]);
  };

  const applyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setIsFiltering(Object.values(newFilters).some(value => value !== '' && value !== 'all'));
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md p-6">
          <CardContent className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-destructive">Error Loading Data</h3>
            <p className="text-gray-600">Failed to load action items. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For action items, we assume they don't have direct source/segment properties 
  // but we still want to support filtering through related insights
  const filterOptions = {
    source: ['All'],  // Default options if needed
    segment: ['All'], 
    sentiment: ['All', 'positive', 'neutral', 'negative']
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Action Items</h2>
        <FeedbackFilters 
          filterOptions={filterOptions}
          onApplyFilters={applyFilters}
          isFiltering={isFiltering}
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
      ) : actionItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleActionItemClick(item)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-lg line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{item.content}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={
                    item.sentiment === 'positive' ? 'success' : 
                    item.sentiment === 'negative' ? 'destructive' : 'secondary'
                  }>
                    {item.sentiment || 'neutral'}
                  </Badge>
                  {item.relatedInsightIds && (
                    <Badge variant="outline">{item.relatedInsightIds.length} Insights</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">No Action Items Found</h3>
            <p className="text-sm text-muted-foreground">
              {isFiltering ? "Try adjusting your filters" : "Add some action items to get started"}
            </p>
          </div>
        </div>
      )}

      <Dialog open={!!selectedActionItem} onOpenChange={(open) => !open && handleCloseDialog()}>
        {selectedActionItem && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedActionItem.title}</DialogTitle>
              <DialogDescription className="text-base font-normal text-foreground mt-2">
                {selectedActionItem.content}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Related Insights</h4>
              
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
              ) : relatedInsights.length > 0 ? (
                <div className="space-y-3">
                  {relatedInsights.map((insight) => (
                    <Card key={insight.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h5 className="font-medium">{insight.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {insight.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No related insights found.</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ActionItems;
