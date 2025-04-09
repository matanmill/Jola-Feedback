import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Building, 
  FileText, 
  MessageSquare,
  HeartHandshake,
  Megaphone
} from 'lucide-react';
import { ShareMenu } from '@/components/share/ShareMenu';

// Mock data for success stories
const successStories = [
  {
    id: 1,
    title: "Interactive Dashboard for NPS Feedback Analysis",
    segment: "Enterprise",
    customerName: "Ana Martinez",
    customerCompany: "DataVision Analytics",
    customerFeedbackId: "fb-12345-abcde",
    customerContact: "ana.martinez@datavision.example",
    csAgent: {
      name: "Michael Rodriguez",
      email: "m.rodriguez@ourcompany.example",
      lastContact: "2023-11-15"
    },
    challenge: "DataVision was struggling to extract meaningful insights from thousands of customer feedback responses they collected monthly. Their team spent 15+ hours each week manually categorizing feedback.",
    solution: "Implementation of our automated feedback tagging and sentiment analysis with custom visualization dashboards for their specific industry metrics.",
    feedback: "The insights dashboard has completely transformed our customer experience strategy. We can now detect emerging issues before they become widespread, and our product team has a direct line into customer needs. This has been game-changing for our roadmap planning.",
    marketingValue: "Perfect case study for enterprise customers in analytics space showing how qualitative feedback can be transformed into actionable intelligence at scale. Emphasize time savings and decision-making improvements.",
    potentialCustomers: [
      {
        id: "cust-78901",
        name: "MetricsMind Inc.",
        segments: ["Enterprise", "Analytics"],
        employeeCount: "210",
        companyARR: "$2.8M"
      },
      {
        id: "cust-45678",
        name: "InsightFlow Technologies",
        segments: ["Mid-Market", "Customer Experience"],
        employeeCount: "85",
        companyARR: "$950K"
      }
    ]
  },
  {
    id: 2,
    title: "Voice of Customer Integration Success",
    segment: "Mid-Market",
    customerName: "David Chen",
    customerCompany: "TechReach Solutions",
    customerFeedbackId: "fb-67890-fghij",
    customerContact: "david.chen@techreach.example",
    csAgent: {
      name: "Jessica Williams",
      email: "j.williams@ourcompany.example",
      lastContact: "2023-12-03"
    },
    challenge: "TechReach was collecting customer feedback across multiple channels (support, sales calls, NPS surveys) but had no way to consolidate this data to identify patterns or prioritize product improvements.",
    solution: "Implementation of our omnichannel feedback collection API with the theme detection engine to automatically categorize and prioritize customer insights.",
    feedback: "We've reduced our time-to-insight by 73% and have finally broken down the silos between our customer success, product, and marketing teams. For the first time, we have a unified view of what our customers are really saying.",
    marketingValue: "Highlights how mid-market companies can achieve enterprise-level customer intelligence without massive teams. Focus on the cross-department collaboration improvements and faster time-to-insight.",
    potentialCustomers: [
      {
        id: "cust-23456",
        name: "CloudComm Group",
        segments: ["Mid-Market", "SaaS"],
        employeeCount: "67",
        companyARR: "$720K"
      },
      {
        id: "cust-89012",
        name: "Nexus CX Platform",
        segments: ["Mid-Market", "Customer Experience"],
        employeeCount: "42",
        companyARR: "$550K"
      }
    ]
  }
];

const SuccessStories = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Success Stories</h1>
        <p className="text-muted-foreground mt-2">
          Real-world examples of how our feedback analytics platform has driven measurable impact
        </p>
      </div>

      {/* Success Story Cards */}
      {successStories.map(story => (
        <Card key={story.id} className="overflow-hidden bg-white shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b flex flex-row justify-between">
            <div>
              <Badge variant="outline" className="mb-2 bg-blue-100 text-blue-800 border-blue-200">
                {story.segment}
              </Badge>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                {story.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {story.customerCompany}
              </CardDescription>
            </div>
            <div className="flex items-start gap-2">
              <ShareMenu 
                title={story.title}
                contentPreview={`${story.challenge}\n\n${story.solution}\n\n${story.feedback}`}
                allowEmail={true}
                iconOnly
              />
              <TrendingUp className="h-12 w-12 text-green-500 opacity-75" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Customer and CS Agent Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4 bg-slate-50">
                <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
                  <Users className="h-4 w-4" /> Customer Information
                </h3>
                <dl className="space-y-1">
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Name:</dt>
                    <dd className="text-sm col-span-2">{story.customerName}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Company:</dt>
                    <dd className="text-sm col-span-2">{story.customerCompany}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Contact:</dt>
                    <dd className="text-sm col-span-2">{story.customerContact}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Feedback ID:</dt>
                    <dd className="text-sm col-span-2">
                      <code className="text-xs bg-slate-200 px-1 py-0.5 rounded">
                        {story.customerFeedbackId}
                      </code>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="border rounded-md p-4 bg-slate-50">
                <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
                  <HeartHandshake className="h-4 w-4" /> CS Agent Details
                </h3>
                <dl className="space-y-1">
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Agent:</dt>
                    <dd className="text-sm col-span-2">{story.csAgent.name}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                    <dd className="text-sm col-span-2">{story.csAgent.email}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-muted-foreground">Last Contact:</dt>
                    <dd className="text-sm col-span-2">{new Date(story.csAgent.lastContact).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Case Study Details */}
            <div>
              <h3 className="text-base font-medium flex items-center gap-1 mb-3">
                <FileText className="h-4 w-4" /> Case Study Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">The Challenge</h4>
                  <p className="mt-1">{story.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Our Solution</h4>
                  <p className="mt-1">{story.solution}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer Feedback</h4>
                  <blockquote className="mt-1 pl-4 border-l-4 border-blue-200 italic">
                    "{story.feedback}"
                  </blockquote>
                </div>
              </div>
            </div>
            
            {/* Marketing Value */}
            <div className="border rounded-md p-4 bg-amber-50 border-amber-100">
              <h3 className="text-base font-medium flex items-center gap-1 mb-2">
                <Megaphone className="h-4 w-4" /> Marketing Opportunity
              </h3>
              <p className="text-sm">{story.marketingValue}</p>
            </div>
          </CardContent>
          
          <CardFooter className="bg-slate-50 border-t">
            <div className="w-full">
              <h3 className="text-sm font-medium mb-2">Similar Customers Who May Benefit</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>ARR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {story.potentialCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.segments.map((segment, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                              {segment}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{customer.employeeCount} employees</TableCell>
                      <TableCell>{customer.companyARR}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SuccessStories;
