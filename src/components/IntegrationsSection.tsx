import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, PlusCircle } from 'lucide-react';

const integrations = [
  {
    name: 'Google Drive',
    icon: '📁',
    connected: true,
    description: 'Access and analyze feedback from your Google Drive files',
  },
  {
    name: 'Salesforce',
    icon: '📊',
    connected: false,
    description: 'Track feature requests and lost deals in your CRM',
  },
  {
    name: 'Gong',
    icon: '🎤',
    connected: false,
    description: 'Capture insights from your sales calls and meetings',
  },
  {
    name: 'Zendesk',
    icon: '🎫',
    connected: false,
    description: 'Analyze customer support tickets and feedback',
  },
  {
    name: 'Slack',
    icon: '💬',
    connected: false,
    description: 'Gather feedback from your team conversations',
  },
  {
    name: 'Jira',
    icon: '📋',
    connected: false,
    description: 'Track feedback and insights in your project management',
  },
];

export function IntegrationsSection() {
  return (
    <Card className="shadow-lg border border-primary/10">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-bold">Integrations</CardTitle>
        <p className="text-base text-muted-foreground mt-2">
          Connect your favorite tools to gather and analyze feedback
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col items-center justify-center p-5 border rounded-lg hover:bg-muted/50 transition-colors hover:shadow-sm"
            >
              <div className="text-4xl mb-4">{integration.icon}</div>
              <div className="text-base font-medium mb-2">{integration.name}</div>
              <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">
                {integration.description}
              </p>
              {integration.connected ? (
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 mr-1.5" />
                  Connected
                </div>
              ) : (
                <Button variant="outline" size="default" className="w-full h-11">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 