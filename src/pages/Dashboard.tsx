import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MessageSquare, Download, Lightbulb, Activity, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboardData } from '@/hooks/use-dashboard-data';

export default function Dashboard() {
  const { 
    data, 
    isLoading, 
    error, 
    metadataDistribution, 
    sourcesDistribution, 
    sentimentDistribution, 
    counts,
    exportToSlack
  } = useDashboardData();

  // Color configurations
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const SENTIMENT_COLORS = {
    positive: '#10b981',
    neutral: '#6b7280',
    negative: '#ef4444'
  };

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl font-bold">{isLoading ? '...' : counts?.feedback || 0}</div>
              <p className="text-xs text-muted-foreground">+{isLoading ? '...' : counts?.newFeedback || 0} since last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl font-bold">{isLoading ? '...' : counts?.insights || 0}</div>
              <p className="text-xs text-muted-foreground">+{isLoading ? '...' : counts?.newInsights || 0} since last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-medium">Action Items</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl font-bold">{isLoading ? '...' : counts?.actionItems || 0}</div>
              <p className="text-xs text-muted-foreground">+{isLoading ? '...' : counts?.newActionItems || 0} since last month</p>
            </CardContent>
          </Card>

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
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Feedback Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[250px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.timeSeriesData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

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
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Roles Distribution</CardTitle>
              <CardDescription className="text-xs">By company role</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metadataDistribution?.roles || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Feedback Sources</CardTitle>
              <CardDescription className="text-xs">Distribution by source</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourcesDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {sourcesDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">ARR Distribution</CardTitle>
              <CardDescription className="text-xs">By company revenue</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metadataDistribution?.arr || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Company Size</CardTitle>
              <CardDescription className="text-xs">By employee count</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metadataDistribution?.employeeCount || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </div>
  );
} 