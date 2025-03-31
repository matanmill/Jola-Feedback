
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
  SidebarFooter
} from '@/components/ui/sidebar';
import { MessageSquare, Lightbulb, LayoutDashboard, Settings, Users } from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { title: 'Feedback Repository', path: '/feedback-hub', icon: LayoutDashboard },
    { title: 'Action Items', path: '/action-items', icon: Users },
    { title: 'Insights', path: '/insights', icon: Lightbulb },
    { title: 'Chat', path: '/chat', icon: MessageSquare },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center h-16 px-4">
              <h1 className="text-xl font-bold">
                Jola Feedback Hub
              </h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t">
            <div className="px-4 py-2 text-xs text-muted-foreground">
              Jola Feedback Hub v1.0.0
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="h-16 flex items-center px-6 border-b">
            <SidebarTrigger className="lg:hidden" />
            <div className="ml-4 text-lg font-medium">
              {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
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
