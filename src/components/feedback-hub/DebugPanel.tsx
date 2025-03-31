
import React, { useState } from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw, ChevronDown, ChevronUp, Bug } from 'lucide-react';

interface DebugPanelProps {
  data: Record<string, any>;
  onRefresh: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ data, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-red-300 bg-red-50">
      <CardHeader className="pb-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-600" />
              <CardTitle className="text-sm text-red-700">Debug Mode</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 border-red-300 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh();
                }}
              >
                <RefreshCcw className="h-3.5 w-3.5 text-red-600 mr-1" />
                <span className="text-xs text-red-700">Refresh Data</span>
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-red-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-red-600" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-red-700">Data State:</h3>
                <pre className="text-xs bg-white/60 p-2 rounded-md border border-red-200 overflow-auto max-h-80">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default DebugPanel;
