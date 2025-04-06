import React from 'react';
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
import { MessageSquare, Lightbulb, Settings, ChevronDown, ChevronRight, Database, Sparkles } from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const feedbackHubPaths = ['/feedback-hub', '/action-items', '/insights'];
  const isFeedbackHubActive = feedbackHubPaths.includes(location.pathname);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center h-16 px-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold tracking-tight">
                  JOLA
                </h1>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {/* Feedback Hub with sub-items */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isFeedbackHubActive}
                  tooltip="Feedback Hub"
                  className="h-12 text-base"
                >
                  <Database className="w-5 h-5" />
                  <span>Feedback Hub</span>
                  {isFeedbackHubActive ? <ChevronDown className="ml-auto w-4 h-4" /> : <ChevronRight className="ml-auto w-4 h-4" />}
                </SidebarMenuButton>
                
                {isFeedbackHubActive && (
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === '/feedback-hub'}
                        className="h-10 text-sm"
                      >
                        <Link to="/feedback-hub">
                          <span>Repository</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === '/action-items'}
                        className="h-10 text-sm"
                      >
                        <Link to="/action-items">
                          <span>Action Items</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === '/insights'}
                        className="h-10 text-sm"
                      >
                        <Link to="/insights">
                          <span>Insights</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
              
              {/* Chat */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/chat'}
                  tooltip="Chat"
                  className="h-12 text-base"
                >
                  <Link to="/chat">
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/settings'}
                  tooltip="Settings"
                  className="h-12 text-base"
                >
                  <Link to="/settings">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t">
            <div className="px-6 py-4 text-sm text-muted-foreground">
              <div className="font-medium">Jola Feedback Hub</div>
              <div className="text-xs mt-1">v1.0.0</div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="h-16 flex items-center px-6 border-b bg-white">
            <SidebarTrigger className="lg:hidden" />
            <div className="ml-4 text-lg font-medium tracking-tight">
              {isFeedbackHubActive ? 'Feedback Hub' : ''}
              {location.pathname === '/chat' ? 'Chat' : ''}
              {location.pathname === '/settings' ? 'Settings' : ''}
              {location.pathname === '/feedback-hub' ? ' / Repository' : ''}
              {location.pathname === '/action-items' ? ' / Action Items' : ''}
              {location.pathname === '/insights' ? ' / Insights' : ''}
            </div>
          </div>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
