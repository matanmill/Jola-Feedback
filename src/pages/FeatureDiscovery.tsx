
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Building, 
  User, 
  Calendar, 
  Link, 
  Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFeatureRequests, useFeatureEvidence } from '@/hooks/use-feature-data';

const FeatureDiscovery = () => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const { data: features, isLoading: featuresLoading, error: featuresError } = useFeatureRequests();
  const { data: evidenceItems, isLoading: evidenceLoading } = useFeatureEvidence(selectedFeatureId || undefined);
  const { toast } = useToast();
  
  // Track which feature items are open in the collapsible list
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (featureId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
    
    // If we're opening this item, also set it as the selected feature
    if (!openItems[featureId]) {
      setSelectedFeatureId(featureId);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  if (featuresLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (featuresError) {
    return (
      <div className="p-6 border rounded-md bg-red-50 text-red-700">
        <h3 className="text-xl font-medium mb-2">Error loading features</h3>
        <p>{featuresError.toString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Feature Discovery</h1>
      <p className="text-muted-foreground">
        Discover feature requests and their supporting evidence from customer feedback.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        {features && features.length > 0 ? (
          features.map(feature => (
            <Collapsible
              key={feature.id}
              open={openItems[feature.id]}
              onOpenChange={() => toggleItem(feature.id)}
              className="border rounded-lg overflow-hidden"
            >
              <div className="bg-muted/30 px-4 py-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleItem(feature.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="text-amber-500 h-5 w-5" />
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    {feature.role && (
                      <Badge variant="outline" className="ml-2">{feature.role}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created: {formatDate(feature.created_at)}
                  </p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                    {openItems[feature.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="p-4 bg-background border-t">
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{feature.description || 'No description provided.'}</p>
                  </div>
                  
                  <h4 className="font-medium mb-3">Evidence Chain</h4>
                  {evidenceLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : evidenceItems && evidenceItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[15%]">Source</TableHead>
                            <TableHead className="w-[20%]">Role</TableHead>
                            <TableHead className="w-[20%]">Company</TableHead>
                            <TableHead className="w-[45%]">Content</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {evidenceItems.map(item => (
                            <TableRow key={item.id}>
                              <TableCell>{item.source || 'Unknown'}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{item.role || 'Unknown'}</span>
                                  {item.detailed_role && (
                                    <span className="text-xs text-muted-foreground">{item.detailed_role}</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {item.company && (
                                  <div className="flex flex-col">
                                    <span>{item.company}</span>
                                    {item.company_arr && (
                                      <span className="text-xs text-muted-foreground">ARR: {item.company_arr}</span>
                                    )}
                                    {item.employee_count && (
                                      <span className="text-xs text-muted-foreground">Size: {item.employee_count}</span>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="whitespace-normal break-words">
                                <div className="max-w-prose">{item.content || 'No content'}</div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No evidence available for this feature request.
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Feature Requests</CardTitle>
              <CardDescription>
                There are no feature requests available at this time.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeatureDiscovery;
