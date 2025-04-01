import React, { useState } from 'react';
import { useInsightsData, Insight } from '@/hooks/use-insights-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Update the Insight interface to match the one from use-insights-data
interface InsightWithFeedbacks extends Insight {
  related_feedbacks_data: {
    feedback_key: number;
    feedback_content: string;
    source: string;
    segment: string;
    sentiment: string;
    feedback_created_at: string;
  }[];
}

const Insights = () => {
  const { toast } = useToast();
  const { data: insights = [], isLoading, error, isSuccess } = useInsightsData() as { 
    data: InsightWithFeedbacks[], 
    isLoading: boolean, 
    error: any, 
    isSuccess: boolean 
  };
  
  const [selectedInsight, setSelectedInsight] = useState<InsightWithFeedbacks | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle click on an insight
  const handleInsightClick = (insight: InsightWithFeedbacks) => {
    setSelectedInsight(insight);
    setIsDialogOpen(true);
  };

  // Show error toast if data fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading insights",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Insights</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : insights.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No insights found</h3>
          <p className="text-muted-foreground mt-2">
            Insights will be generated based on feedback analysis.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map(insight => (
            <Card 
              key={insight.id} 
              className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleInsightClick(insight)}
            >
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
                    {insight.related_feedbacks && insight.related_feedbacks.length > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {insight.related_feedbacks.length} related feedback{insight.related_feedbacks.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insight Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              {selectedInsight ? `Insight #${selectedInsight.id}` : 'Insight Details'}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this insight
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
                <p className="text-base">{selectedInsight.content}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <p className="text-sm">{new Date(selectedInsight.created_at).toLocaleString()}</p>
              </div>
              
              {(selectedInsight.related_feedbacks_data?.length > 0 || selectedInsight.related_feedbacks?.length > 0) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Related Feedbacks</h3>
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Content</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Source</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Segment</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Sentiment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(selectedInsight.related_feedbacks_data || []).map(feedback => (
                          <tr key={feedback.feedback_key} className="hover:bg-muted/30">
                            <td className="px-4 py-2 text-sm font-medium">
                              #{feedback.feedback_key}
                            </td>
                            <td className="px-4 py-2">
                              <div className="max-h-24 overflow-y-auto text-sm">
                                {feedback.feedback_content}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <Badge variant="secondary" className="text-xs">
                                {feedback.source}
                              </Badge>
                            </td>
                            <td className="px-4 py-2">
                              <Badge variant="secondary" className="text-xs">
                                {feedback.segment}
                              </Badge>
                            </td>
                            <td className="px-4 py-2">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  feedback.sentiment.toLowerCase() === 'positive' ? 'bg-green-50 text-green-700' :
                                  feedback.sentiment.toLowerCase() === 'negative' ? 'bg-red-50 text-red-700' :
                                  'bg-gray-50 text-gray-700'
                                }`}
                              >
                                {feedback.sentiment}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Insights;
