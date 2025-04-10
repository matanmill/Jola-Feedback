import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useInsightsData, InsightWithLabelDetails } from '@/hooks/use-insights-data';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ShareMenu } from '@/components/share/ShareMenu';
import { useLabelsData } from '@/hooks/use-insights-data';

const MAX_CONTENT_LENGTH = 150; // Maximum characters to show before truncating

const InsightCard = ({ insight }: { insight: InsightWithLabelDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = insight.content && insight.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? `${insight.content.substring(0, MAX_CONTENT_LENGTH)}...`
    : insight.content;

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
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
            onClick={() => setIsExpanded(!isExpanded)}
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
  
  // Find the current label details
  const currentLabel = labels.find(label => label.label_key === labelId);

  useEffect(() => {
    // Debug logging
    console.log(`InsightsByLabel component rendering with labelId: ${labelId}`);
    console.log('Current insights data:', insights);
  }, [labelId, insights]);

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
            <InsightCard key={insight.insight_key} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsByLabel;
