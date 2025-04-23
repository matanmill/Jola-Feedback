import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import FeedbackHub from "./pages/FeedbackHub";
import Insights from "./pages/Insights";
import ActionItems from "./pages/ActionItems";
import FeatureDiscovery from "./pages/FeatureDiscovery";
import SuccessStories from "./pages/SuccessStories";
import InsightsByLabel from "./pages/InsightsByLabel";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/app/SidebarLayout";
import Dashboard from '@/pages/Dashboard';
import UserVoice from '@/pages/UserVoice';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Sidebar Layout routes */}
          <Route element={<SidebarLayout><Outlet /></SidebarLayout>}>
            <Route path="feedback-hub" element={<FeedbackHub />} />
            <Route path="insights" element={<Insights />} />
            <Route path="insights/:labelId" element={<InsightsByLabel />} />
            <Route path="feature-discovery" element={<FeatureDiscovery />} />
            <Route path="success-stories" element={<SuccessStories />} />
            <Route path="action-items" element={<ActionItems />} />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-voice" element={<UserVoice />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
