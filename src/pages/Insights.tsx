import React, { useState } from 'react';
import { useInsightsData, useInsightFeedbacksData, InsightWithLabelDetails } from '@/hooks/use-insights-data';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardContent,
  CardFooter 
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
import { ShareMenu } from '@/components/share/ShareMenu';

const MAX_CONTENT_LENGTH = 150; // Maximum characters to show before truncating

const InsightCard = ({ insight, onClick }: { insight: InsightWithLabelDetails, onClick: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = insight.content && insight.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? `${insight.content.substring(0, MAX_CONTENT_LENGTH)}...`
    : insight.content;
  const [isShareClicked, setIsShareClicked] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    setIsShareClicked(true);
    e.stopPropagation();
    // The actual onClick handler is in the ShareMenu component
  };

  const handleCardClick = () => {
    if (!isShareClicked) {
      onClick();
    }
    // Reset share clicked state for next interaction
    setIsShareClicked(false);
  };

  return (
    <Card 
      className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">
            {insight.Title || 'Untitled Insight'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <p className="text-gray-700">
          {displayContent || 'No content available for this insight.'}
        </p>
        {shouldTruncate && (
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? 'See Less' : 'See More'}
          </Button>
        )}
        <div className="mt-4 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1 mb-2">
            {insight.label_details && insight.label_details.map(label => (
              <Badge key={label.label_key} variant="outline" className="bg-blue-50 text-blue-700">
                {label.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end border-t mt-auto">
        <ShareMenu 
          title={insight.Title || 'Insight'}
          contentPreview={insight.content || ''}
          onClick={handleShareClick}
          variant="gradient"
          size="sm"
        />
      </CardFooter>
    </Card>
  );
};

const Insights = () => {
  const { toast } = useToast();
  const { data: insights = [], isLoading, error, refetch } = useInsightsData();
  
  const [selectedInsight, setSelectedInsight] = useState<InsightWithLabelDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: relatedFeedbacks = [], isLoading: isLoadingFeedbacks } = useInsightFeedbacksData(
    selectedInsight?.insight_key
  );

  const handleInsightClick = (insight: InsightWithLabelDetails) => {
    setSelectedInsight(insight);
    setIsDialogOpen(true);
  };

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

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading insights",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
            <InsightCard
              key={insight.insight_key}
              insight={insight}
              onClick={() => handleInsightClick(insight)}
            />
          ))}
        </div>
      )}

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
