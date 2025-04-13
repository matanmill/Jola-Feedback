import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { 
  Database, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  User, 
  MessageSquare, 
  Lightbulb,
  Zap,
  Award,
  CheckSquare,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface Label {
  label_key: string;
  label: string;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  
  // Fetch labels from the database
  const { data: labels = [] } = useQuery<Label[]>({
    queryKey: ['labels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('labels')
        .select('label_key, label');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const feedbackHubPath = '/feedback-hub';
  const featureDiscoveryPath = '/feature-discovery';
  const successStoriesPath = '/success-stories';
  const actionItemsPath = '/action-items';
  const insightsPaths = ['/insights', ...labels.map(l => `/insights/${l.label_key}`)];
  
  const isInsightsActive = insightsPaths.some(path => location.pathname.startsWith(path));
  const isFeedbackHubActive = location.pathname === feedbackHubPath;
  const isFeatureDiscoveryActive = location.pathname === featureDiscoveryPath;
  const isSuccessStoriesActive = location.pathname === successStoriesPath;
  const isActionItemsActive = location.pathname === actionItemsPath;
  const isChatActive = location.pathname === '/chat';
  const isSettingsActive = location.pathname === '/settings';
  const isDashboardActive = location.pathname === '/dashboard';
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center h-16 px-4">
              <h1 className="text-2xl font-bold tracking-tight">
                JOLA
              </h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isDashboardActive}
                  tooltip="Dashboard"
                  className="text-base py-3"
                >
                  <Link to="/dashboard">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-base">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Feedback Hub */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isFeedbackHubActive}
                  tooltip="Feedback Hub"
                  className="text-base py-3"
                >
                  <Link to="/feedback-hub">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-base">Feedback Hub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Insights with dropdown */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isInsightsActive}
                  tooltip="Insights"
                  className="text-base py-3"
                  onClick={() => setIsInsightsOpen(!isInsightsOpen)}
                >
                  <Lightbulb className="h-5 w-5" />
                  <span className="text-base">Insights</span>
                  {isInsightsOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
                
                {isInsightsOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === '/insights'}
                        className="text-base"
                      >
                        <Link to="/insights">
                          <span>All Insights</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                    
                    {labels.map((label) => (
                      <SidebarMenuItem key={label.label_key}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === `/insights/${label.label_key}`}
                          className="text-base"
                        >
                          <Link to={`/insights/${label.label_key}`}>
                            <span>{label.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
              
              {/* Feature Discovery */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isFeatureDiscoveryActive}
                  tooltip="Feature Discovery"
                  className="text-base py-3"
                >
                  <Link to="/feature-discovery">
                    <Zap className="h-5 w-5" />
                    <span className="text-base">Feature Discovery</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Success Stories */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isSuccessStoriesActive}
                  tooltip="Success Stories"
                  className="text-base py-3"
                >
                  <Link to="/success-stories">
                    <Award className="h-5 w-5" />
                    <span className="text-base">Success Stories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Action Items */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActionItemsActive}
                  tooltip="Action Items"
                  className="text-base py-3"
                >
                  <Link to="/action-items">
                    <CheckSquare className="h-5 w-5" />
                    <span className="text-base">Action Items</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Chat */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isChatActive}
                  tooltip="Chat"
                  className="text-base py-3"
                >
                  <Link to="/chat">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-base">Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isSettingsActive}
                  tooltip="Settings"
                  className="text-base py-3"
                >
                  <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span className="text-base">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t">
            <div className="p-4 flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Jola Feedback Hub v1.0</span>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="h-16 flex items-center px-6 border-b bg-white">
            <SidebarTrigger className="lg:hidden" />
            <div className="ml-4 text-lg font-medium tracking-tight">
              {isDashboardActive && 'Dashboard'}
              {isFeedbackHubActive && 'Feedback Hub'}
              {isInsightsActive && 'Insights'}
              {isFeatureDiscoveryActive && 'Feature Discovery'}
              {isSuccessStoriesActive && 'Success Stories'}
              {isActionItemsActive && 'Action Items'}
              {isChatActive && 'Chat'}
              {isSettingsActive && 'Settings'}
            </div>
          </div>
          <div className="container mx-auto p-6 h-[calc(100vh-4rem)]">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
