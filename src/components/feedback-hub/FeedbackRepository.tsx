import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Building, 
  DollarSign, 
  Users,
  UserRound,
  Filter,
  BriefcaseBusiness
} from 'lucide-react';
import { useFeedbackData, Feedback } from '@/hooks/use-feedback-data';
import DebugPanel from '@/components/feedback-hub/DebugPanel';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShareMenu } from '@/components/share/ShareMenu';

interface FeedbackRepositoryProps {
  isDebugMode: boolean;
}

const FeedbackRepository: React.FC<FeedbackRepositoryProps> = ({ isDebugMode }) => {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  const { 
    data: feedbacks = [], 
    isLoading, 
    error, 
    refetch 
  } = useFeedbackData();

  const uniqueRoles = [...new Set(feedbacks.map(fb => fb.role).filter(Boolean))];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const roleMatch = !roleFilter || feedback.role === roleFilter;
    return roleMatch;
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading feedback data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleItemClick = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      {isDebugMode && (
        <DebugPanel 
          data={{ 
            feedbacks, 
            filteredCount: filteredFeedbacks.length,
            activeFilters: {
              role: roleFilter
            },
            error: error?.message || null
          }} 
          onRefresh={() => refetch()}
        />
      )}

      <div className="flex items-center space-x-4 mb-4 bg-slate-50 p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <Select value={roleFilter || 'all'} onValueChange={(value) => setRoleFilter(value === 'all' ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map((role) => (
                role && <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No feedback found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden shadow-sm">
          <div className="grid grid-cols-6 bg-slate-100 px-4 py-3 font-medium text-sm">
            <div>Name</div>
            <div>Company</div>
            <div>Company ARR</div>
            <div>Employee Count</div>
            <div>Role</div>
            <div>Content</div>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto bg-white">
            {filteredFeedbacks.map((feedback) => (
              <Collapsible 
                key={feedback.feedback_key}
                open={expandedId === feedback.feedback_key}
                onOpenChange={() => handleItemClick(feedback.feedback_key)}
                className="border-b last:border-b-0"
              >
                <CollapsibleTrigger asChild>
                  <div 
                    className="grid grid-cols-6 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-slate-400" />
                      <span>{feedback.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span>{feedback.company || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span>{feedback.company_arr || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{feedback.employee_count || 'N/A'}</span>
                    </div>
                    <div>
                      {feedback.role ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {feedback.role}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="truncate">{truncateText(feedback.content || '', 50)}</span>
                      {expandedId === feedback.feedback_key ? (
                        <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-slate-50 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
                          {feedback.role ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {feedback.role}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not specified</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Source</h3>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{feedback.source || 'Unknown source'}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Content</h3>
                          <p className="text-sm whitespace-pre-wrap p-3 bg-white border rounded-md">
                            {feedback.content || 'No content available'}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(feedback.created_at).toLocaleDateString()} {new Date(feedback.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <ShareMenu
                        iconOnly
                        title={`Feedback from ${feedback.name || 'Anonymous'}`}
                        contentPreview={feedback.content || ''}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackRepository;
