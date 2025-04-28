import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MessageSquare, Download, Lightbulb, Activity, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { IntegrationsSection } from '@/components/IntegrationsSection';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useInsightsData, useInsightChunksData } from '@/hooks/use-insights-data';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShareMenu } from '@/components/share/ShareMenu';

const MAX_CONTENT_LENGTH = 150; // Maximum characters to show before truncating

const DemoInsightCard = ({ insight }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const shouldTruncate = insight.content && insight.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? `${insight.content.substring(0, MAX_CONTENT_LENGTH)}...`
    : insight.content;
  const [isShareClicked, setIsShareClicked] = React.useState(false);
  const [userCount, setUserCount] = React.useState(0);
  const { data: chunks } = useInsightChunksData(insight.insight_key);

  React.useEffect(() => {
    if (chunks) {
      setUserCount(chunks.length);
    }
  }, [chunks]);

  const handleShareClick = (e) => {
    setIsShareClicked(true);
    e.stopPropagation();
  };

  // Calculate progress bar value (assuming max 20 users for full bar)
  const progressValue = Math.min((userCount / 20) * 100, 100);

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 min-h-[72px]">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <CardTitle className="text-lg line-clamp-2 leading-tight">
            {insight.Title || 'Untitled Insight'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
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
        <p className="text-gray-700 mt-4">
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
            {insight.label_details?.map(label => (
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

export default function Dashboard() {
  const { 
    data, 
    isLoading, 
    error, 
    sentimentDistribution,
    counts,
    exportToSlack
  } = useDashboardData();

  const { data: insights = [], isLoading: isLoadingInsights } = useInsightsData();
  const [expandedDemoInsights, setExpandedDemoInsights] = React.useState(false);
  const MAX_DEMO_INSIGHTS = 3;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const SENTIMENT_COLORS = {
    positive: '#10b981',
    neutral: '#6b7280',
    negative: '#ef4444'
  };

  // Filter Demo insights
  const demoInsights = React.useMemo(() => {
    if (!insights || !Array.isArray(insights)) return [];
    return insights.filter(insight => 
      insight?.label_details?.some(label => label?.label === 'Demo')
    );
  }, [insights]);

  // Get displayed insights based on expanded state
  const displayedDemoInsights = expandedDemoInsights 
    ? demoInsights 
    : demoInsights.slice(0, MAX_DEMO_INSIGHTS);
  
  const hasMoreDemoInsights = demoInsights.length > MAX_DEMO_INSIGHTS;

  const handleExportToSlack = async () => {
    try {
      await exportToSlack();
      toast.success('Dashboard exported to Slack successfully');
    } catch (err) {
      toast.error('Failed to export to Slack');
      console.error('Export error:', err);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <CardTitle className="text-red-500">Error Loading Dashboard</CardTitle>
          <p className="mt-4">Failed to load dashboard data: {error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your feedback analytics dashboard
        </p>
      </div>

      <div className="space-y-8">
        {/* Integrations Section */}
        <IntegrationsSection />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <Button 
            onClick={handleExportToSlack} 
            disabled={isLoading}
            className="flex items-center gap-2"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Export to Slack
          </Button>
        </div>

        {/* Sentiment Score */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold">{isLoading ? '...' : (counts?.sentimentScore || 0).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : 
                counts?.sentimentTrend > 0 
                  ? `↑ ${counts.sentimentTrend.toFixed(1)} increase` 
                  : `↓ ${Math.abs(counts?.sentimentTrend || 0).toFixed(1)} decrease`}
            </p>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card className="shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3">
            <div className="h-[250px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sentimentDistribution?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={SENTIMENT_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Examples */}
        <div className="grid gap-3 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-green-500">Positive Feedback Examples</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  data?.positiveFeedbacks?.map((feedback, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded-md">
                      <p className="text-xs">{feedback.content}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        <span>{feedback.source}</span>
                        {feedback.role && (
                          <span> • {feedback.role}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-red-500">Negative Feedback Examples</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  data?.negativeFeedbacks?.map((feedback, index) => (
                    <div key={index} className="p-2 bg-red-50 rounded-md">
                      <p className="text-xs">{feedback.content}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        <span>{feedback.source}</span>
                        {feedback.role && (
                          <span> • {feedback.role}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Insights Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-base">
                Demo Insights
              </Badge>
              <span className="text-sm text-muted-foreground">({demoInsights.length} insights)</span>
            </h2>
            {hasMoreDemoInsights && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setExpandedDemoInsights(!expandedDemoInsights)}
              >
                {expandedDemoInsights ? (
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

          {isLoadingInsights ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : demoInsights.length === 0 ? (
            <div className="p-8 text-center border rounded-lg bg-muted/30">
              <h3 className="text-xl font-medium text-muted-foreground">No Demo insights found</h3>
              <p className="text-muted-foreground mt-2">
                Insights labeled as "Demo" will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedDemoInsights.map((insight) => (
                <DemoInsightCard key={insight.insight_key} insight={insight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 