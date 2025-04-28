import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MessageSquare, Download, Lightbulb, Activity, CheckSquare, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { IntegrationsSection } from '@/components/IntegrationsSection';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useInsightsData, InsightWithLabelDetails } from '@/hooks/use-insights-data';
import { BarChart2 } from 'lucide-react';
import { useFeatureRequests } from '@/hooks/use-feature-data';
import { ShareMenu } from '@/components/share/ShareMenu';
import { useNavigate } from 'react-router-dom';

const MAX_DASHBOARD_INSIGHTS = 3;

const marketTrends = [
  { date: '2024-01', pricing: 15, ui: 5, integration: 120, marketSentiment: 0.15 },
  { date: '2024-02', pricing: 92, ui: 8, integration: 145, marketSentiment: 0.48 },
  { date: '2024-03', pricing: 48, ui: 92, integration: 132, marketSentiment: 0.77 },
  { date: '2024-04', pricing: 195, ui: 5, integration: 18, marketSentiment: 0.79 },
  { date: '2024-05', pricing: 95, ui: 120, integration: 42, marketSentiment: 0.45 },
  { date: '2024-06', pricing: 100, ui: 88, integration: 156, marketSentiment: 0.51 },
];

const DashboardInsightCard = ({ insight }: { insight: InsightWithLabelDetails }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = insight.content && insight.content.length > 150;
  const displayContent = shouldTruncate && !isExpanded 
    ? `${insight.content.substring(0, 150)}...`
    : insight.content;
  const [isShareClicked, setIsShareClicked] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    setIsShareClicked(true);
    e.stopPropagation();
  };

  const handleCardClick = () => {
    navigate('/insights');
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
      <CardFooter className="pt-4 flex justify-between border-t mt-auto">
        <div />
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

  const { data: insights = [], isLoading: isLoadingInsights, error: insightsError } = useInsightsData();
  const { data: features = [], isLoading: isLoadingFeatures, error: featuresError } = useFeatureRequests();
  const navigate = useNavigate();
  const [selectedInsight, setSelectedInsight] = useState<InsightWithLabelDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only show the first 3 insights
  const displayedInsights = insights.slice(0, MAX_DASHBOARD_INSIGHTS);

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

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          {/* Compact Sentiment Distribution */}
          <Card className="shadow-sm">
            <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie
                        data={sentimentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={false}
                      >
                        {sentimentDistribution?.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name.toLowerCase() === 'positive' ? '#10b981' : entry.name.toLowerCase() === 'neutral' ? '#6b7280' : '#ef4444'} 
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="ml-4 space-y-1">
                  {sentimentDistribution?.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <span className="inline-block w-3 h-3 rounded-full" style={{background: entry.name.toLowerCase() === 'positive' ? '#10b981' : entry.name.toLowerCase() === 'neutral' ? '#6b7280' : '#ef4444'}}></span>
                      <span>{entry.name}</span>
                      <span className="font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Feedback Examples */}
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

        {/* Market & Customer Sentiment Trends */}
        <Card className="shadow-sm">
          <CardHeader className="flex items-center gap-2 p-3 pb-1">
            <BarChart2 className="h-5 w-5 mr-2" />
            <CardTitle className="text-sm font-medium">Market & Customer Sentiment Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketTrends} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    height={60}
                    label={{ value: 'Time Period', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    label={{ value: 'Topic Mentions', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    label={{ value: 'Market Sentiment', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="pricing" 
                    stroke="#8884d8" 
                    name="Pricing Discussions" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="ui" 
                    stroke="#82ca9d" 
                    name="UI/UX Feedback" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="integration" 
                    stroke="#ffc658" 
                    name="Integration Topics" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="marketSentiment" 
                    stroke="#ff6b6b" 
                    name="Market Sentiment" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Insights Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Top insights from this week</h2>
          {isLoadingInsights ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : insightsError ? (
            <div className="p-4 text-red-600">Error loading insights: {insightsError.message}</div>
          ) : displayedInsights.length === 0 ? (
            <div className="p-4 text-muted-foreground">No insights available.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedInsights.map(insight => (
                <Card
                  key={insight.insight_key}
                  className="flex flex-col h-full cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate('/insights')}
                >
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Lightbulb className="h-6 w-6 text-amber-500 flex-shrink-0" />
                    <CardTitle className="font-bold text-lg truncate flex-1">
                      {insight.Title || 'Untitled Insight'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {insight.content || 'No content available for this insight.'}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t mt-auto flex justify-end">
                    <ShareMenu
                      title={insight.Title || 'Insight'}
                      contentPreview={insight.content || ''}
                      onClick={e => e.stopPropagation()}
                      variant="gradient"
                      size="sm"
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Latest Feature Discovery Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 tracking-tight flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            Latest feature discovery
          </h2>
          {isLoadingFeatures ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : featuresError ? (
            <div className="p-4 text-red-600">Error loading features: {featuresError.message}</div>
          ) : features.length === 0 ? (
            <div className="p-4 text-muted-foreground">No features available.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.slice(0, 3).map((feature, index) => {
                const lostDeals = [10, 6, 9, 12, 8, 14][index % 6];
                return (
                  <Card
                    key={feature.id}
                    className="flex flex-col h-full cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate('/feature-discovery')}
                  >
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                      <Lightbulb className="h-6 w-6 text-amber-500 flex-shrink-0" />
                      <CardTitle className="font-bold text-lg truncate flex-1">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {feature.description || 'No description provided.'}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 border-t mt-auto flex justify-between items-center">
                      <span className="text-xs flex items-center gap-1 font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        🔥 {lostDeals} Lost Deals
                      </span>
                      <ShareMenu
                        title={feature.title || 'Feature Request'}
                        contentPreview={feature.description || ''}
                        variant="gradient"
                        size="sm"
                        onClick={e => e.stopPropagation()}
                      />
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}