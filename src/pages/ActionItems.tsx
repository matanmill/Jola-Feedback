
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ActionItems = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Action Items</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Action Items Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display action items based on customer feedback.
            Connect action items to specific feedback and track their progress.
          </p>
          <div className="mt-6 p-12 border rounded-md flex items-center justify-center">
            <p className="text-muted-foreground text-center">Action items will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionItems;
