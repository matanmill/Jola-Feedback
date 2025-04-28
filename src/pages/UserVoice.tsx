import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, FileText, Search, Users, TrendingUp, Lightbulb, ExternalLink, Link, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const UserVoice = () => {
  // Mock data for word cloud
  const wordCloudData = [
    { 
      word: 'integration', 
      count: 45, 
      quotes: [
        { text: 'The integration process was seamless', users: 12, source: 'https://example.com/feedback/1' },
        { text: 'We needed better integration with our existing tools', users: 8, source: 'https://example.com/feedback/2' }
      ] 
    },
    { 
      word: 'pricing', 
      count: 38, 
      quotes: [
        { text: 'The pricing model is very competitive', users: 15, source: 'https://example.com/feedback/3' },
        { text: 'We had questions about the enterprise pricing', users: 10, source: 'https://example.com/feedback/4' }
      ] 
    },
    { 
      word: 'support', 
      count: 32, 
      quotes: [
        { text: 'Customer support has been excellent', users: 20, source: 'https://example.com/feedback/5' },
        { text: 'We needed more responsive support', users: 5, source: 'https://example.com/feedback/6' }
      ] 
    },
    { 
      word: 'features', 
      count: 28, 
      quotes: [
        { text: 'The feature set is comprehensive', users: 18, source: 'https://example.com/feedback/7' },
        { text: 'We needed more advanced features', users: 7, source: 'https://example.com/feedback/8' }
      ] 
    },
    { 
      word: 'UI', 
      count: 25, 
      quotes: [
        { text: 'The UI is very intuitive', users: 15, source: 'https://example.com/feedback/9' },
        { text: 'The interface could be more user-friendly', users: 3, source: 'https://example.com/feedback/10' }
      ] 
    },
  ];

  // Mock data for marketing assets mentions
  const marketingAssets = [
    {
      asset: 'Pricing Page',
      quotes: [
        { text: 'The pricing page was very clear and helped us understand the value', users: 8, source: 'https://example.com/feedback/11' },
        { text: 'We had some questions after reviewing the pricing page', users: 5, source: 'https://example.com/feedback/12' },
        { text: 'The pricing structure was well explained', users: 10, source: 'https://example.com/feedback/13' }
      ]
    },
    {
      asset: 'Product Demo',
      quotes: [
        { text: 'The demo was very impressive and showed all the key features', users: 12, source: 'https://example.com/feedback/14' },
        { text: 'We would have liked to see more use cases in the demo', users: 4, source: 'https://example.com/feedback/15' },
        { text: 'The demo helped us understand the product better', users: 9, source: 'https://example.com/feedback/16' }
      ]
    },
    {
      asset: 'Case Studies',
      quotes: [
        { text: 'The case studies were very relevant to our industry', users: 7, source: 'https://example.com/feedback/17' },
        { text: 'We would like to see more detailed case studies', users: 3, source: 'https://example.com/feedback/18' },
        { text: 'The success stories were very compelling', users: 6, source: 'https://example.com/feedback/19' }
      ]
    }
  ];

  // Updated market trend data with more dynamic values
  const marketTrends = [
    {
      date: '2024-01',
      pricing: 85,
      ui: 65,
      integration: 120,
      marketSentiment: 0.75,
      keyFeedback: {
        gong: [
          { quote: "The integration capabilities are exactly what we need for our tech stack", user: "CTO, TechCorp" },
          { quote: "Looking for better automation in our workflow", user: "Product Manager, StartupX" }
        ],
        reddit: [
          { quote: "Anyone else seeing great results with the new API features?", user: "u/dev_enthusiast" },
          { quote: "The pricing model makes sense for enterprise use", user: "u/enterprise_user" }
        ],
        gartner: [
          { quote: "Emerging as a strong contender in the automation space", source: "Market Guide 2024" }
        ]
      }
    },
    {
      date: '2024-02',
      pricing: 92,
      ui: 78,
      integration: 145,
      marketSentiment: 0.78,
      keyFeedback: {
        gong: [
          { quote: "The UI improvements have made a significant difference", user: "UX Lead, DesignCo" },
          { quote: "Integration with our existing tools was seamless", user: "IT Director, EnterpriseCorp" }
        ],
        reddit: [
          { quote: "Feature request: More customization options for dashboards", user: "u/power_user" },
          { quote: "The community support is excellent", user: "u/new_user" }
        ],
        gartner: [
          { quote: "Noted for innovation in user experience", source: "Cool Vendors Report" }
        ]
      }
    },
    {
      date: '2024-03',
      pricing: 78,
      ui: 92,
      integration: 132,
      marketSentiment: 0.82,
      keyFeedback: {
        gong: [
          { quote: "The new pricing tiers are more competitive", user: "CFO, GrowthCorp" },
          { quote: "UI customization options are impressive", user: "Product Lead, TechStart" }
        ],
        reddit: [
          { quote: "Integration with Salesforce is a game-changer", user: "u/salesforce_user" },
          { quote: "Pricing transparency could be improved", user: "u/community_voice" }
        ],
        gartner: [
          { quote: "Strong showing in integration capabilities", source: "Market Analysis Q1" }
        ]
      }
    },
    {
      date: '2024-04',
      pricing: 105,
      ui: 85,
      integration: 118,
      marketSentiment: 0.79,
      keyFeedback: {
        gong: [
          { quote: "Enterprise pricing needs more flexibility", user: "VP, EnterpriseCorp" },
          { quote: "UI performance has improved significantly", user: "UX Director, DesignCo" }
        ],
        reddit: [
          { quote: "API integration documentation is excellent", user: "u/api_dev" },
          { quote: "Pricing calculator is very helpful", user: "u/decision_maker" }
        ],
        gartner: [
          { quote: "Noted for strong UI/UX capabilities", source: "Market Pulse" }
        ]
      }
    },
    {
      date: '2024-05',
      pricing: 95,
      ui: 110,
      integration: 142,
      marketSentiment: 0.85,
      keyFeedback: {
        gong: [
          { quote: "New UI features are exactly what we needed", user: "Product Manager, InnovateCo" },
          { quote: "Integration process could be smoother", user: "CTO, ScaleUp" }
        ],
        reddit: [
          { quote: "Pricing model is very competitive", user: "u/market_watcher" },
          { quote: "UI customization is a major plus", user: "u/design_enthusiast" }
        ],
        gartner: [
          { quote: "Strong market position in integration space", source: "Market Guide Update" }
        ]
      }
    },
    {
      date: '2024-06',
      pricing: 112,
      ui: 98,
      integration: 156,
      marketSentiment: 0.88,
      keyFeedback: {
        gong: [
          { quote: "Pricing structure works well for our needs", user: "CEO, StartupX" },
          { quote: "UI improvements have reduced training time", user: "Training Lead, EnterpriseCo" }
        ],
        reddit: [
          { quote: "Integration capabilities are industry-leading", user: "u/tech_analyst" },
          { quote: "Pricing transparency is much better now", user: "u/community_voice" }
        ],
        gartner: [
          { quote: "Recognized as market leader in integration", source: "Market Leaders Report" }
        ]
      }
    }
  ];

  // Current trending topics with source breakdown
  const trendingTopics = [
    {
      topic: "Integration Capabilities",
      totalMentions: 156,
      sources: {
        customers: 45,
        social: 78,
        market: 33
      },
      sentiment: 0.82,
      keyQuotes: [
        {
          text: "The integration process was smoother than expected",
          source: "Gong Call",
          user: "Enterprise Customer"
        },
        {
          text: "API documentation could be more detailed",
          source: "Reddit",
          user: "Developer Community"
        }
      ]
    },
    {
      topic: "Pricing Structure",
      totalMentions: 132,
      sources: {
        customers: 38,
        social: 64,
        market: 30
      },
      sentiment: 0.75,
      keyQuotes: [
        {
          text: "Enterprise pricing aligns with market expectations",
          source: "Gartner",
          user: "Market Analyst"
        },
        {
          text: "Looking for more flexible payment options",
          source: "Zendesk",
          user: "SMB Customer"
        }
      ]
    }
  ];

  // Mock data for content recommendations
  const contentRecommendations = [
    {
      type: 'campaign',
      title: 'Integration Success Stories',
      description: 'Create a campaign showcasing successful integrations with popular tools',
      source: 'Based on 12 customer feedbacks'
    },
    {
      type: 'page',
      title: 'Advanced Features Guide',
      description: 'Develop a comprehensive guide for advanced features',
      source: 'Based on 8 customer requests'
    },
    {
      type: 'webinar',
      title: 'Pricing Strategy Webinar',
      description: 'Host a webinar explaining our pricing model and value proposition',
      source: 'Based on 15 discovery calls'
    }
  ];

  // Mock data for case studies
  const caseStudies = [
    {
      title: 'Enterprise Integration Success',
      metrics: {
        improvement: '45%',
        timeSaved: '3 months',
        roi: '300%'
      },
      dealSize: '$250,000',
      feedback: [
        '"The integration process was smooth and well-supported"',
        '"The ROI exceeded our expectations"',
        '"The team was very responsive to our needs"'
      ]
    }
  ];

  // Custom tooltip component with proper TypeScript types
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = marketTrends.find(d => d.date === label);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <p className="text-sm">
                  {entry.name}: {entry.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium mb-2">Key Feedback:</p>
            <ScrollArea className="h-32">
              {data?.keyFeedback.gong.map((feedback, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs italic">"{feedback.quote}"</p>
                  <p className="text-xs text-muted-foreground">- {feedback.user}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Market & Customer Trends</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
          <TabsTrigger value="sources">Source Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Word Cloud Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Most Mentioned Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 p-4">
                {wordCloudData.map((item, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded-full transition-all duration-200
                        ${index === 0 ? 'text-2xl' : index === 1 ? 'text-xl' : 'text-lg'}
                        bg-primary/10 hover:bg-primary/20 cursor-pointer`}
                    >
                      {item.word}
                    </span>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-3 mt-2 z-10 w-64">
                      <p className="text-sm font-medium mb-2">Mentioned {item.count} times</p>
                      <ScrollArea className="h-32">
                        {item.quotes.map((quote, i) => (
                          <div key={i} className="mb-2">
                            <p className="text-sm italic">{quote.text}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">{quote.users} users</span>
                              <a href={quote.source} className="text-xs text-primary hover:underline flex items-center gap-1">
                                <Link className="h-3 w-3" />
                                Source
                              </a>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Assets Mentions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Marketing Assets Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketingAssets.map((asset, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{asset.asset}</h3>
                    <ScrollArea className="h-48">
                      {asset.quotes.map((quote, i) => (
                        <div key={i} className="mb-3 p-2 bg-muted/50 rounded">
                          <p className="text-sm italic">{quote.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{quote.users} users</span>
                            <a href={quote.source} className="text-xs text-primary hover:underline flex items-center gap-1">
                              <Link className="h-3 w-3" />
                              Source
                            </a>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Market Trends Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Market & Customer Sentiment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
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

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Current Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{topic.topic}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{topic.totalMentions} mentions</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          topic.sentiment > 0.8 ? 'bg-green-100 text-green-800' :
                          topic.sentiment > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.sentiment.toFixed(2)} sentiment
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-sm font-medium">{topic.sources.customers}</p>
                        <p className="text-xs text-muted-foreground">Customers</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-sm font-medium">{topic.sources.social}</p>
                        <p className="text-xs text-muted-foreground">Social</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-sm font-medium">{topic.sources.market}</p>
                        <p className="text-xs text-muted-foreground">Market</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {topic.keyQuotes.map((quote, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded">
                          <p className="text-sm italic mb-1">"{quote.text}"</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{quote.user}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                              {quote.source}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          {/* ... other tabs content ... */}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Content Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contentRecommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                        {rec.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{rec.source}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Userify It Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Userify It
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your content here..."
                  className="min-h-[100px]"
                />
                <Button className="w-full">Transform to User Voice</Button>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm italic">Userified version will appear here...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Suggested Case Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {caseStudies.map((study, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{study.title}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{study.metrics.improvement}</p>
                      <p className="text-sm text-muted-foreground">Improvement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{study.metrics.timeSaved}</p>
                      <p className="text-sm text-muted-foreground">Time Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{study.metrics.roi}</p>
                      <p className="text-sm text-muted-foreground">ROI</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                        Deal Size: {study.dealSize}
                      </span>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View in Salesforce
                    </Button>
                  </div>
                  <ScrollArea className="h-32">
                    {study.feedback.map((quote, i) => (
                      <div key={i} className="mb-2 p-2 bg-muted/30 rounded">
                        <p className="text-sm italic">"{quote}"</p>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserVoice; 