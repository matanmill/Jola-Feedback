
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
  TableCaption, 
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
  BarChart3,
  HeartHandshake,
  Megaphone
} from 'lucide-react';

// Mock data for success stories
const successStories = [
  {
    id: 1,
    title: "SMB Dashboard Integration Success",
    segment: "SMB",
    customerName: "TechFlow Solutions",
    customerCompany: "TechFlow Inc.",
    customerFeedbackId: "fb-12345-abcde",
    customerContact: "sarah.johnson@techflow.example",
    csAgent: {
      name: "Michael Rodriguez",
      email: "m.rodriguez@ourcompany.example",
      lastContact: "2023-11-15"
    },
    challenge: "TechFlow needed a simpler way to track project metrics across their small team without expensive enterprise tools.",
    solution: "Custom dashboard integration with role-based access tailored for small teams.",
    feedback: "The new dashboard has saved us at least 5 hours per week in reporting time and helped us identify project bottlenecks we didn't even know existed!",
    metrics: [
      "68% reduction in reporting time",
      "22% increase in on-time project delivery",
      "100% team adoption within 2 weeks"
    ],
    marketingValue: "Perfect case study for SMB segment showing immediate ROI without enterprise-level complexity. Can highlight cost savings and quick team adoption.",
    potentialCustomers: [
      {
        id: "cust-78901",
        name: "Bright Media Group",
        segments: ["SMB", "Creative Agency"],
        employeeCount: "32",
        companyARR: "$450K"
      },
      {
        id: "cust-45678",
        name: "InnovateTech Solutions",
        segments: ["SMB", "Tech Consulting"],
        employeeCount: "27",
        companyARR: "$380K"
      }
    ]
  },
  {
    id: 2,
    title: "Automated Workflow Success for Accountants",
    segment: "Professional Services",
    customerName: "Financial Clarity Partners",
    customerCompany: "Financial Clarity LLC",
    customerFeedbackId: "fb-67890-fghij",
    customerContact: "david.chen@financialclarity.example",
    csAgent: {
      name: "Jessica Williams",
      email: "j.williams@ourcompany.example",
      lastContact: "2023-12-03"
    },
    challenge: "Managing complex client workflows during tax season created bottlenecks and increased error risk.",
    solution: "Implementation of automated approval workflows and status tracking.",
    feedback: "The workflow automation has been transformative for our busy season operations. We've cut review cycles by half and dramatically reduced follow-up emails.",
    metrics: [
      "53% reduction in approval cycle time",
      "87% decrease in status update meetings",
      "35% increase in client capacity"
    ],
    marketingValue: "Demonstrates direct impact on service business capacity and efficiency. Would resonate with time-constrained professional service firms.",
    potentialCustomers: [
      {
        id: "cust-23456",
        name: "PrecisionAccounts Group",
        segments: ["Professional Services", "Accounting"],
        employeeCount: "41",
        companyARR: "$520K"
      },
      {
        id: "cust-89012",
        name: "ClearView Financial Advisors",
        segments: ["Professional Services", "Financial Services"],
        employeeCount: "19",
        companyARR: "$310K"
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
          Real-world examples of how our solutions have driven measurable impact
        </p>
      </div>

      {/* Success Story Cards */}
      {successStories.map(story => (
        <Card key={story.id} className="overflow-hidden bg-white shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="flex justify-between items-start">
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
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" /> Key Metrics
                  </h4>
                  <ul className="mt-2 pl-5 list-disc">
                    {story.metrics.map((metric, idx) => (
                      <li key={idx} className="text-sm mt-1">{metric}</li>
                    ))}
                  </ul>
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
