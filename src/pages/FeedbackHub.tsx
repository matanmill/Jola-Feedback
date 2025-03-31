
import React, { useState } from 'react';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Repository</h1>
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
      
      <FeedbackRepository isDebugMode={isDebugMode} />
    </div>
  );
};

export default FeedbackHub;
