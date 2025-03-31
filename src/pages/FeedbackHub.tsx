
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackRepository from '@/components/feedback-hub/FeedbackRepository';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

const FeedbackHub = () => {
  const { toast } = useToast();
  const [isDebugMode, setIsDebugMode] = useState(false);

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
    toast({
      title: isDebugMode ? "Debug Mode Disabled" : "Debug Mode Enabled",
      description: isDebugMode 
        ? "Hiding detailed debug information." 
        : "Showing detailed debug information and logs.",
      variant: isDebugMode ? "default" : "destructive",
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
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
      
      <Tabs defaultValue="repository" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="repository">Feedback Repository</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="repository">
          <FeedbackRepository isDebugMode={isDebugMode} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="p-6 text-center border rounded-lg bg-gray-50">
            <h3 className="text-xl font-medium text-gray-500">Analytics coming soon</h3>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="p-6 text-center border rounded-lg bg-gray-50">
            <h3 className="text-xl font-medium text-gray-500">Settings coming soon</h3>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackHub;
