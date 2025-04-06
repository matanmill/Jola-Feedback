
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
import { MessageSquare, Database, Settings, ChevronDown, ChevronRight, User, Activity } from 'lucide-react';

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
            <div className="flex items-center h-16 px-4">
              <h1 className="text-2xl font-bold tracking-tight">
                JOLA
              </h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {/* Feedback Hub with sub-items */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isFeedbackHubActive}
                  tooltip="Feedback Hub"
                  className="text-base py-3"
                >
                  <Database className="h-5 w-5" />
                  <span>Feedback Hub</span>
                  {isFeedbackHubActive ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
                
                {isFeedbackHubActive && (
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === '/feedback-hub'}
                        className="text-base"
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
                        className="text-base"
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
                        className="text-base"
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
                  className="text-base py-3"
                >
                  <Link to="/chat">
                    <MessageSquare className="h-5 w-5" />
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
                  className="text-base py-3"
                >
                  <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
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
              {isFeedbackHubActive ? 'Feedback Hub' : ''}
              {location.pathname === '/chat' ? 'Chat' : ''}
              {location.pathname === '/settings' ? 'Settings' : ''}
              {location.pathname === '/feedback-hub' ? ' / Repository' : ''}
              {location.pathname === '/action-items' ? ' / Action Items' : ''}
              {location.pathname === '/insights' ? ' / Insights' : ''}
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
