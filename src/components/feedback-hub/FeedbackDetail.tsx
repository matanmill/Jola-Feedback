
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
  Tag, 
  User, 
  Building,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';

interface FeedbackDetailProps {
  feedback: Feedback;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <ThumbsUp className="h-5 w-5 text-sentiment-positive" />;
      case 'negative':
        return <ThumbsDown className="h-5 w-5 text-sentiment-negative" />;
      case 'mixed':
        return <AlertCircle className="h-5 w-5 text-sentiment-mixed" />;
      default:
        return null;
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-sentiment-positive';
      case 'negative':
        return 'text-sentiment-negative';
      case 'mixed':
        return 'text-sentiment-mixed';
      default:
        return 'text-sentiment-neutral';
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          {feedback.title}
          {feedback.sentiment && getSentimentIcon(feedback.sentiment)}
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
            {feedback.client && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {feedback.client}
              </Badge>
            )}
            {feedback.segment && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {feedback.segment}
              </Badge>
            )}
            {feedback.sentiment && (
              <Badge variant="outline" className={`flex items-center gap-1 ${getSentimentTextColor(feedback.sentiment)}`}>
                {feedback.sentiment}
              </Badge>
            )}
          </div>
        </DialogDescription>
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
          {/* Customer Information */}
          {(feedback.customer_name || feedback.customer_email) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {feedback.customer_name && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Name:</dt>
                      <dd className="text-sm">{feedback.customer_name}</dd>
                    </div>
                  )}
                  {feedback.customer_email && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                      <dd className="text-sm">{feedback.customer_email}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
          
          {/* Additional Information - will display any other properties in the feedback object */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {Object.entries(feedback)
                  .filter(([key]) => !['id', 'title', 'content', 'sentiment', 'source', 'segment', 'client',
                                      'customer_name', 'customer_email', 'created_at'].includes(key))
                  .map(([key, value]) => value && (
                    <div key={key} className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">
                        {key.replace(/_/g, ' ')}:
                      </dt>
                      <dd className="text-sm">{value.toString()}</dd>
                    </div>
                  ))}
                {Object.entries(feedback)
                  .filter(([key]) => !['id', 'title', 'content', 'sentiment', 'source', 'segment', 'client',
                                      'customer_name', 'customer_email', 'created_at'].includes(key) && !!feedback[key])
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
