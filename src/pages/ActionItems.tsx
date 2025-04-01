import React, { useState } from 'react';
import { useActionItemsData, ActionItem } from '@/hooks/use-action-items-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Add this interface at the top of the file
interface ActionItemWithInsights extends ActionItem {
  related_insights_data: {
    insight_key: number;
    insight_content: string;
  }[];
}

const ActionItems = () => {
  const { toast } = useToast();
  const { data: actionItems = [], isLoading, error, isSuccess } = useActionItemsData();
  
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle click on an action item
  const handleActionItemClick = (actionItem: ActionItem) => {
    setSelectedActionItem(actionItem);
    setIsDialogOpen(true);
  };

  // Show error toast if data fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading action items",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Action Items</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : actionItems.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No action items found</h3>
          <p className="text-muted-foreground mt-2">
            Action items will be created based on insights and feedback analysis.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actionItems.map(actionItem => (
            <Card 
              key={actionItem.id} 
              className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleActionItemClick(actionItem)}
            >
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Action Item #{actionItem.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {actionItem.content || 'No content available for this action item.'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-gray-50">
                      {new Date(actionItem.created_at).toLocaleDateString()}
                    </Badge>
                    {actionItem.related_insights && actionItem.related_insights.length > 0 && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        {actionItem.related_insights.length} related insight{actionItem.related_insights.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Item Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              {selectedActionItem ? `Action Item #${selectedActionItem.id}` : 'Action Item Details'}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this action item
            </DialogDescription>
          </DialogHeader>
          
          {selectedActionItem && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
                <p className="text-base">{selectedActionItem.content}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <p className="text-sm">{new Date(selectedActionItem.created_at).toLocaleString()}</p>
              </div>
              
              {(selectedActionItem.related_insights_data?.length > 0) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Related Insights</h3>
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Content</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedActionItem.related_insights_data.map(insight => (
                          <tr key={insight.insight_key} className="hover:bg-muted/30">
                            <td className="px-4 py-2 text-sm font-medium">
                              #{insight.insight_key}
                            </td>
                            <td className="px-4 py-2">
                              <div className="max-h-24 overflow-y-auto text-sm">
                                {insight.insight_content}
                              </div>
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

export default ActionItems;
