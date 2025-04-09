import React, { useState } from 'react';
import { Share2, Slack, Mail, GitBranch } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type ShareType = 'slack' | 'jira' | 'email';

interface ShareButtonProps {
  data: {
    title: string;
    content: string;
    type: string;
  };
}

export const ShareButton: React.FC<ShareButtonProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareType, setShareType] = useState<ShareType | null>(null);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleShare = (type: ShareType) => {
    setShareType(type);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    // In a real implementation, this would send the data to the respective service
    console.log('Sharing data:', {
      type: shareType,
      data,
      message,
      recipient,
    });
    setIsModalOpen(false);
    setMessage('');
    setRecipient('');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare('slack')}>
            <Slack className="mr-2 h-4 w-4" />
            Share to Slack
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('jira')}>
            <GitBranch className="mr-2 h-4 w-4" />
            Share to Jira
          </DropdownMenuItem>
          {data.type === 'success-story' && (
            <DropdownMenuItem onClick={() => handleShare('email')}>
              <Mail className="mr-2 h-4 w-4" />
              Share via Email
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Share to {shareType?.charAt(0).toUpperCase() + shareType?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Customize your share message below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to your share..."
              />
            </div>
            {shareType === 'email' && (
              <div className="grid gap-2">
                <label htmlFor="recipient" className="text-sm font-medium">
                  Recipient Email
                </label>
                <Input
                  id="recipient"
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Share</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 