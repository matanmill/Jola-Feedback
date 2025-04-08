
import React from 'react';
import { useActionItemsData } from '@/hooks/use-action-items-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Defining correct types for action items
export interface ActionItem {
  actionitem_key: string;
  content: string;
  related_insights_data: {
    insight_key: string;
    insight_content: string;
    insight_created_at?: string;
  }[];
}

const ActionItems = () => {
  const { data: actionItems, isLoading, error } = useActionItemsData();

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
        <h3 className="text-xl font-medium mb-2">Error loading action items</h3>
        <p>{error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Action Items</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage tasks that need to be completed based on feedback insights.
        </p>
      </div>

      {actionItems?.length === 0 ? (
        <div className="p-6 border rounded-md bg-muted/30">
          <h3 className="text-xl font-medium">No action items found</h3>
          <p className="text-muted-foreground mt-2">
            There are currently no action items in the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {actionItems?.map((item) => (
            <Card key={item.actionitem_key} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Action Required</CardTitle>
                <CardDescription className="mt-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    Action Item
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Description</h3>
                    <p>{item.content}</p>
                  </div>
                  
                  {item.related_insights_data && item.related_insights_data.length > 0 && (
                    <div>
                      <h3 className="font-medium text-lg mb-2">Related Insights</h3>
                      <ul className="space-y-2">
                        {item.related_insights_data.map((insight, idx) => (
                          <li key={insight.insight_key || idx} className="p-3 bg-muted rounded-md">
                            {insight.insight_content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionItems;
