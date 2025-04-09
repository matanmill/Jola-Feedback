
import React from 'react';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Feedback } from '@/types/feedback';
import { formatDate } from '@/lib/utils';
import { 
  MessageSquare, 
  Calendar, 
  Building, 
  Users,
  UserRound,
  BriefcaseBusiness
} from 'lucide-react';
import { ShareMenu } from '@/components/share/ShareMenu';

interface FeedbackDetailProps {
  feedback: Feedback;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback }) => {
  return (
    <>
      <DialogHeader className="flex flex-row justify-between items-start">
        <div>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Feedback from {feedback.name || 'Anonymous'}
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {feedback.source && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {feedback.source}
                </Badge>
              )}
              {feedback.created_at && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(feedback.created_at)}
                </Badge>
              )}
              {feedback.company && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {feedback.company}
                </Badge>
              )}
              {feedback.role && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <BriefcaseBusiness className="h-3 w-3" />
                  {feedback.role}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </div>
        <ShareMenu 
          title={`Feedback from ${feedback.name || 'Anonymous'}`}
          contentPreview={feedback.content || ''}
          iconOnly
        />
      </DialogHeader>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        {/* Feedback Content */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Feedback</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="whitespace-pre-line">
                {feedback.content || 'No content available'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Information */}
          {(feedback.company || feedback.company_arr || feedback.employee_count) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {feedback.company && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Company:</dt>
                      <dd className="text-sm">{feedback.company}</dd>
                    </div>
                  )}
                  {feedback.company_arr && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Company ARR:</dt>
                      <dd className="text-sm">{feedback.company_arr}</dd>
                    </div>
                  )}
                  {feedback.employee_count && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Employee Count:</dt>
                      <dd className="text-sm">{feedback.employee_count}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
          
          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {Object.entries(feedback)
                  .filter(([key]) => !['feedback_key', 'content', 'source', 'name',
                                      'company', 'company_arr', 'employee_count', 'role', 'created_at'].includes(key))
                  .map(([key, value]) => value && (
                    <div key={key} className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">
                        {key.replace(/_/g, ' ')}:
                      </dt>
                      <dd className="text-sm">{value.toString()}</dd>
                    </div>
                  ))}
                {Object.entries(feedback)
                  .filter(([key]) => !['feedback_key', 'content', 'source', 'name',
                                      'company', 'company_arr', 'employee_count', 'role', 'created_at'].includes(key) && !!feedback[key])
                  .length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No additional details available</p>
                  )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
