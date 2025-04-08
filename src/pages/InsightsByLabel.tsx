
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useInsightsData } from '@/hooks/use-insights-data';

const InsightsByLabel = () => {
  const { labelId } = useParams();
  const { data: insights, isLoading, error } = useInsightsData(labelId);

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
      <div>
        <h1 className="text-3xl font-bold">Insights: {labelId}</h1>
        <p className="text-muted-foreground mt-2">
          Displaying insights for the category {labelId}
        </p>
      </div>

      {insights?.length === 0 ? (
        <div className="p-6 border rounded-md bg-muted/30">
          <h3 className="text-xl font-medium">No insights found</h3>
          <p className="text-muted-foreground mt-2">
            There are currently no insights available for this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights?.map((insight) => (
            <Card key={insight.insight_key} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  {insight.Title || 'Untitled Insight'}
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-1 mt-2">
                  {insight.label_details.map(label => (
                    <Badge key={label.label_key} variant="outline" className="bg-blue-50 text-blue-700">
                      {label.label}
                    </Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{insight.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsByLabel;
