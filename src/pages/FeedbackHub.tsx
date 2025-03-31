
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FeedbackRepository from '@/components/feedback-hub/FeedbackRepository';
import { useToast } from '@/hooks/use-toast';
import ActionItems from '@/pages/ActionItems';
import Insights from '@/pages/Insights';
import { Lightbulb, CheckSquare, MessageSquare } from 'lucide-react';

const FeedbackHub = () => {
  const { toast } = useToast();
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [activeTab, setActiveTab] = useState('feedbacks');

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
    toast({
      title: isDebugMode ? "Debug Mode Disabled" : "Debug Mode Enabled",
      description: isDebugMode 
        ? "Hiding detailed debug information." 
        : "Showing detailed debug information and logs.",
      variant: isDebugMode ? "default" : "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Hub</h1>
        <button
          onClick={toggleDebugMode}
          className={`px-4 py-2 rounded-md transition-colors ${
            isDebugMode 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {isDebugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
        </button>
      </div>
      
      <Tabs 
        defaultValue="feedbacks" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger 
            value="feedbacks"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Feedbacks</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="insights"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="action-items"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <CheckSquare className="h-4 w-4" />
            <span>Action Items</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedbacks" className="mt-0 focus-visible:outline-none">
          <FeedbackRepository isDebugMode={isDebugMode} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0 focus-visible:outline-none">
          <Insights />
        </TabsContent>
        
        <TabsContent value="action-items" className="mt-0 focus-visible:outline-none">
          <ActionItems />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackHub;
