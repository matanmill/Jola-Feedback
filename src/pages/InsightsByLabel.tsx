import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useInsightsData, InsightWithLabelDetails, useInsightChunksData } from '@/hooks/use-insights-data';
import { Button } from '@/components/ui/button';
import { ShareMenu } from '@/components/share/ShareMenu';
import { useLabelsData } from '@/hooks/use-insights-data';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';

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
  };

  const handleCardClick = () => {
    if (!isShareClicked) {
      onClick();
    }
    setIsShareClicked(false);
  };

  return (
    <Card 
      className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-4 min-h-[72px]">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <CardTitle className="text-lg line-clamp-2 leading-tight">
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
            {insight.label_details.map(label => (
              <Badge key={label.label_key} variant="outline" className="bg-blue-50 text-blue-700">
                {label.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-end border-t mt-auto">
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

const InsightsByLabel = () => {
  const { labelId } = useParams();
  const { data: insights, isLoading, error } = useInsightsData(labelId);
  const { data: labels = [] } = useLabelsData();
  
  const [selectedInsight, setSelectedInsight] = useState<InsightWithLabelDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: chunks, isLoading: isLoadingChunks } = useInsightChunksData(selectedInsight?.insight_key);
  
  // Find the current label details
  const currentLabel = labels.find(label => label.label_key === labelId);

  const handleInsightClick = (insight: InsightWithLabelDetails) => {
    setSelectedInsight(insight);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-md bg-red-50 text-red-700">
        <h3 className="text-xl font-medium mb-2">Error loading insights</h3>
        <p>{error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {currentLabel?.label || 'Unknown Label'} insights
      </h1>

      {!insights || insights.length === 0 ? (
        <div className="p-6 border rounded-md bg-muted/30">
          <h3 className="text-xl font-medium">No insights found</h3>
          <p className="text-muted-foreground mt-2">
            There are currently no insights available for this category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => (
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

              {/* Related Chunks Table */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Related Chunks</h3>
                {isLoadingChunks ? (
                  <div className="flex justify-center items-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : chunks && chunks.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Source</TableHead>
                          <TableHead className="w-[100px]">Role</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead className="w-[150px]">Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chunks.map((chunk) => (
                          <TableRow key={chunk.chunk_key}>
                            <TableCell className="font-medium">{chunk.source}</TableCell>
                            <TableCell>{chunk.role}</TableCell>
                            <TableCell>
                              <div className="max-h-[100px] overflow-y-auto">
                                {chunk.chunk_content}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(chunk.feedback_created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground border rounded-md">
                    No related chunks found
                  </div>
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

export default InsightsByLabel;
