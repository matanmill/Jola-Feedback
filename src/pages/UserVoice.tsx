import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Quote, TrendingUp, Search, Lightbulb } from 'lucide-react';

const userVoiceData = [
  {
    quote: "Jola has completely transformed how we handle customer feedback. The insights are game-changing.",
    role: "Product Manager",
    company: "TechCorp"
  },
  {
    quote: "The AI-powered analysis saves us countless hours. It's like having an extra team member.",
    role: "Customer Success",
    company: "StartupX"
  },
  {
    quote: "Finally, a tool that helps us truly understand what our customers want.",
    role: "CEO",
    company: "GrowthLabs"
  }
];

const discoverabilityData = [
  { source: "LinkedIn", percentage: 35 },
  { source: "Word of Mouth", percentage: 25 },
  { source: "Industry Events", percentage: 20 },
  { source: "Content Marketing", percentage: 15 },
  { source: "Other", percentage: 5 }
];

const assetMentionsData = [
  { month: "Jan", mentions: 12 },
  { month: "Feb", mentions: 18 },
  { month: "Mar", mentions: 15 },
  { month: "Apr", mentions: 22 },
  { month: "May", mentions: 28 },
  { month: "Jun", mentions: 25 }
];

const marketingOpportunities = [
  {
    problem: "Struggling to analyze customer feedback at scale",
    theme: "Scale & Efficiency",
    contentIdeas: [
      "Case study: How Company X analyzed 10,000 feedback points in a day",
      "Guide: Scaling customer feedback analysis",
      "Webinar: Automating feedback analysis"
    ]
  },
  {
    problem: "Missing key insights in customer conversations",
    theme: "Deep Insights",
    contentIdeas: [
      "Blog: The hidden patterns in customer feedback",
      "Infographic: Common feedback analysis pitfalls",
      "Video: Extracting actionable insights from feedback"
    ]
  }
];

const trendsData = [
  { date: "2024-01", "Customer Insights": 12, "AI Analysis": 8, "Feedback Automation": 5 },
  { date: "2024-02", "Customer Insights": 15, "AI Analysis": 10, "Feedback Automation": 7 },
  { date: "2024-03", "Customer Insights": 18, "AI Analysis": 14, "Feedback Automation": 9 },
  { date: "2024-04", "Customer Insights": 22, "AI Analysis": 18, "Feedback Automation": 12 },
  { date: "2024-05", "Customer Insights": 25, "AI Analysis": 22, "Feedback Automation": 15 },
  { date: "2024-06", "Customer Insights": 28, "AI Analysis": 25, "Feedback Automation": 18 }
];

export default function UserVoice() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Positioning, Messaging & User Voice</h1>
        <p className="text-muted-foreground">Understanding how customers perceive and interact with Jola</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Voice Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-primary" />
              User Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userVoiceData.map((item, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm italic mb-2">"{item.quote}"</p>
                <div className="text-xs text-muted-foreground">
                  {item.role} at {item.company}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Brand Discoverability Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Brand Discoverability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={discoverabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Mentions Tracker */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Asset Mentions Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={assetMentionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="mentions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Asset Mentions</p>
              <div className="text-sm text-muted-foreground">
                "The case study really helped us understand the value proposition"
                <br />
                "The demo video was very clear and concise"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Opportunities */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Marketing Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketingOpportunities.map((item, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-2">{item.problem}</p>
                <p className="text-xs text-muted-foreground mb-2">Theme: {item.theme}</p>
                <ul className="text-xs space-y-1">
                  {item.contentIdeas.map((idea, i) => (
                    <li key={i} className="text-muted-foreground">• {idea}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emerging Trends */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Emerging Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Customer Insights" stroke="#8884d8" />
                <Line type="monotone" dataKey="AI Analysis" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Feedback Automation" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 