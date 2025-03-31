
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FeedbackRepository from '@/components/feedback-hub/FeedbackRepository';
import Insights from './Insights';
import ActionItems from './ActionItems';
import { MessageSquare, Lightbulb, CheckSquare } from 'lucide-react';

const FeedbackHub = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
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
      
      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="w-full bg-transparent border-b border-border p-0 mb-6">
          <TabsTrigger 
            value="feedback" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-3 bg-transparent flex gap-2 items-center font-medium"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback Repository
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-3 bg-transparent flex gap-2 items-center font-medium"
          >
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger 
            value="action-items" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-3 bg-transparent flex gap-2 items-center font-medium"
          >
            <CheckSquare className="h-4 w-4" />
            Action Items
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="mt-0 animate-fade-in">
          <FeedbackRepository isDebugMode={isDebugMode} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0 animate-fade-in">
          <Insights />
        </TabsContent>
        
        <TabsContent value="action-items" className="mt-0 animate-fade-in">
          <ActionItems />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackHub;
