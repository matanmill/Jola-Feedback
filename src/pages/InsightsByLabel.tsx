
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFirstNWords } from '@/lib/utils';

interface Insight {
  insight_key: string;
  title: string;
  content: string;
  label: string;
}

const InsightsByLabel = () => {
  const { labelId } = useParams<{ labelId: string }>();
  const { toast } = useToast();
  
  const { data: insights = [], isLoading, error } = useQuery<Insight[]>({
    queryKey: ['insights', labelId],
    queryFn: async () => {
      // Fetch the label first to get its name
      const { data: labelData, error: labelError } = await supabase
        .from('labels')
        .select('label')
        .eq('label_key', labelId)
        .single();
      
      if (labelError) throw labelError;
      
      // Then fetch insights with this label
      const { data, error } = await supabase
        .from('insights')
        .select(`
          insight_key,
          title,
          content,
          insights_labels!inner(label_key)
        `)
        .eq('insights_labels.label_key', labelId);
      
      if (error) throw error;
      
      // Add the label to each insight
      return data.map(insight => ({
        insight_key: insight.insight_key,
        title: insight.title || `Insight #${insight.insight_key.substring(0, 8)}`,
        content: insight.content || '',
        label: labelData.label
      }));
    },
  });

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Lightbulb className="h-6 w-6" />
        <span>Insights</span>
        {!isLoading && insights.length > 0 && (
          <Badge className="ml-2">{insights[0].label}</Badge>
        )}
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : insights.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No insights found</h3>
          <p className="text-muted-foreground mt-2">
            No insights are available for this label.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map(insight => (
            <Card 
              key={insight.insight_key} 
              className="border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">
                  {insight.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {insight.content || 'No content available for this insight.'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {insight.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsByLabel;
