import React, { useState } from 'react';
import { useInsightsData, InsightWithLabelDetails, useInsightChunksData } from '@/hooks/use-insights-data';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb, Sparkles, ChevronDown, ChevronUp, BarChart2, X, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShareMenu } from '@/components/share/ShareMenu';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

const MAX_CONTENT_LENGTH = 150; // Maximum characters to show before truncating
const MAX_INSIGHTS_PER_LABEL = 3;

const InsightCard = ({ insight, onClick }: { insight: InsightWithLabelDetails, onClick: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = insight.content && insight.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? `${insight.content.substring(0, MAX_CONTENT_LENGTH)}...`
    : insight.content;
  const [isShareClicked, setIsShareClicked] = useState(false);
  const [userCount, setUserCount] = useState<number>(0);
  const { data: chunks } = useInsightChunksData(insight.insight_key);

  React.useEffect(() => {
    if (chunks) {
      setUserCount(chunks.length);
    }
  }, [chunks]);

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

  // Calculate progress bar value (assuming max 20 users for full bar)
  const progressValue = Math.min((userCount / 20) * 100, 100);

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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">{userCount}</span>
              <span className="text-sm text-muted-foreground">users mentioned this</span>
            </div>
          </div>
          <div className="space-y-1">
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Strength</span>
              <span>{userCount} mentions</span>
            </div>
          </div>
        </div>
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

const LabelSection = ({ 
  label, 
  insights, 
  onInsightClick 
}: { 
  label: string, 
  insights: InsightWithLabelDetails[], 
  onInsightClick: (insight: InsightWithLabelDetails) => void 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedInsights = isExpanded ? insights : insights.slice(0, MAX_INSIGHTS_PER_LABEL);
  const hasMore = insights.length > MAX_INSIGHTS_PER_LABEL;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-base">
            {label}
          </Badge>
          <span className="text-sm text-muted-foreground">({insights.length} insights)</span>
        </h3>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show More
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedInsights.map(insight => (
          <InsightCard
            key={insight.insight_key}
            insight={insight}
            onClick={() => onInsightClick(insight)}
          />
        ))}
      </div>
    </div>
  );
};

const LabelFilter = ({ 
  labels, 
  selectedLabel, 
  onSelectLabel 
}: { 
  labels: string[], 
  selectedLabel: string | null, 
  onSelectLabel: (label: string | null) => void 
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Filter by Label</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectLabel(null)}
          className={cn(
            "text-xs px-2 h-6",
            selectedLabel === null ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Clear Filter
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {labels.map((label) => (
          <button
            key={label}
            onClick={() => onSelectLabel(label)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-all duration-200",
              "border border-border/50 hover:border-border",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              selectedLabel === label
                ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                : "bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const InsightSidebar = ({ 
  insight, 
  onClose,
  chunks,
  isLoadingChunks
}: { 
  insight: InsightWithLabelDetails,
  onClose: () => void,
  chunks: any[] | undefined,
  isLoadingChunks: boolean
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Mock assistant response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm analyzing this insight. Would you like to know more about specific aspects of it?" 
      }]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[800px] bg-background border-l border-border/50 shadow-2xl overflow-hidden flex flex-col z-50">
        <div className="sticky top-0 z-10 bg-background border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold">{insight.Title || 'Insight Details'}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">{chunks?.length || 0}</span>
              <span className="text-sm text-muted-foreground">users mentioned this</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Segment analysis feature will be available soon",
                });
              }}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Analyze by Segments
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
            <p className="text-base p-3 bg-slate-50 rounded-md border">
              {insight.content}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Labels</h3>
            <div className="flex flex-wrap gap-1">
              {insight.label_details && insight.label_details.length > 0 ? (
                insight.label_details.map(label => (
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

          {/* Chat Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask about this insight
            </h3>
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg",
                    msg.role === 'user' 
                      ? "bg-blue-50 text-blue-900 ml-auto w-fit" 
                      : "bg-muted text-muted-foreground w-fit"
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Ask a question about this insight..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Insights = () => {
  const { toast } = useToast();
  const { data: insights = [], isLoading, error, refetch } = useInsightsData();
  
  const [selectedInsight, setSelectedInsight] = useState<InsightWithLabelDetails | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: chunks, isLoading: isLoadingChunks } = useInsightChunksData(selectedInsight?.insight_key);
  const [selectedLabel, setSelectedLabel] = useState<string | null>("Pain Points");

  // Group insights by label
  const insightsByLabel = React.useMemo(() => {
    const groups: { [key: string]: InsightWithLabelDetails[] } = {};
    
    insights.forEach(insight => {
      insight.label_details?.forEach(label => {
        if (!groups[label.label]) {
          groups[label.label] = [];
        }
        groups[label.label].push(insight);
      });
    });
    
    return groups;
  }, [insights]);

  // Get all unique labels
  const allLabels = React.useMemo(() => {
    const labels = new Set<string>();
    insights.forEach(insight => {
      insight.label_details?.forEach(label => {
        labels.add(label.label);
      });
    });
    return Array.from(labels).sort();
  }, [insights]);

  // Filter insights based on selected label
  const filteredInsightsByLabel = React.useMemo(() => {
    if (!selectedLabel) {
      return insightsByLabel;
    }
    return { [selectedLabel]: insightsByLabel[selectedLabel] || [] };
  }, [insightsByLabel, selectedLabel]);

  const handleInsightClick = (insight: InsightWithLabelDetails) => {
    setSelectedInsight(insight);
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
    <div className="space-y-8 animate-fade-in">
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

      {!isLoading && allLabels.length > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <LabelFilter 
            labels={allLabels} 
            selectedLabel={selectedLabel} 
            onSelectLabel={setSelectedLabel} 
          />
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : Object.keys(filteredInsightsByLabel).length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No insights found</h3>
          <p className="text-muted-foreground mt-2">
            {selectedLabel 
              ? `No insights found for the "${selectedLabel}" label.` 
              : "Insights will be generated based on feedback analysis."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredInsightsByLabel).map(([label, labelInsights]) => (
            <LabelSection
              key={label}
              label={label}
              insights={labelInsights}
              onInsightClick={handleInsightClick}
            />
          ))}
        </div>
      )}

      {selectedInsight && (
        <InsightSidebar
          insight={selectedInsight}
          onClose={() => setSelectedInsight(null)}
          chunks={chunks}
          isLoadingChunks={isLoadingChunks}
        />
      )}
    </div>
  );
};

export default Insights;
