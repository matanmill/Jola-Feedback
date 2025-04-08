
import React, { useState } from 'react';
import { useInsightsData, useInsightFeedbacksData, InsightWithLabelDetails } from '@/hooks/use-insights-data';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Insights = () => {
  const { toast } = useToast();
  const { data: insights = [], isLoading, error, refetch } = useInsightsData();
  
  const [selectedInsight, setSelectedInsight] = useState<InsightWithLabelDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fetch related feedbacks when an insight is selected
  const { data: relatedFeedbacks = [], isLoading: isLoadingFeedbacks } = useInsightFeedbacksData(
    selectedInsight?.insight_key
  );

  // Handle click on an insight
  const handleInsightClick = (insight: InsightWithLabelDetails) => {
    setSelectedInsight(insight);
    setIsDialogOpen(true);
  };

  // Handle generate insights
  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting insights generation...');
      const response = await fetch('https://test-python-backend-1.onrender.com/generate-insights', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Insights generation response:', data);
      
      toast({
        title: "Success",
        description: "Insights generation started successfully",
      });

      // Refetch insights after a short delay to get new data
      setTimeout(() => {
        refetch();
      }, 5000);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          <span>Insights</span>
        </h2>
        <Button 
          onClick={handleGenerateInsights} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
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
              key={insight.insight_key} 
              className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleInsightClick(insight)}
            >
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">
                  {insight.Title || 'Untitled Insight'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {insight.content || 'No content available for this insight.'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {insight.label_details && insight.label_details.map(label => (
                      <Badge key={label.label_key} variant="outline" className="bg-blue-50 text-blue-700">
                        {label.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insight Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              {selectedInsight?.Title || 'Insight Details'}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this insight
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
                <p className="text-base p-3 bg-slate-50 rounded-md border">
                  {selectedInsight.content}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Labels</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedInsight.label_details && selectedInsight.label_details.length > 0 ? (
                    selectedInsight.label_details.map(label => (
                      <Badge key={label.label_key} variant="outline" className="bg-blue-50 text-blue-700">
                        {label.label}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No labels assigned</p>
                  )}
                </div>
              </div>
              
              {/* Related Feedbacks Table */}
              <div>
                <h3 className="text-base font-medium mb-2">Related Feedbacks</h3>
                {isLoadingFeedbacks ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : relatedFeedbacks.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Source</TableHead>
                          <TableHead className="w-[100px]">Role</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead className="w-[150px]">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatedFeedbacks.map(feedback => (
                          <TableRow key={feedback.feedback_key}>
                            <TableCell className="font-medium">
                              {feedback.source || 'Unknown'}
                            </TableCell>
                            <TableCell>
                              {feedback.role ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {feedback.role}
                                </Badge>
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {feedback.feedback_content || 'No content'}
                            </TableCell>
                            <TableCell>
                              {formatDate(feedback.feedback_created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-4 bg-slate-50 rounded border">
                    No related feedbacks found for this insight.
                  </p>
                )}
              </div>
              
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
