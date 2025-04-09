
import React, { useState } from 'react';
import { Share2, Slack, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ShareOption {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface ShareMenuProps {
  title: string;
  contentPreview: string;
  allowEmail?: boolean;
  className?: string;
  iconOnly?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function ShareMenu({ 
  title, 
  contentPreview, 
  allowEmail = false, 
  className = '',
  iconOnly = false,
  onClick
}: ShareMenuProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ShareOption | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const shareOptions: ShareOption[] = [
    { id: 'slack', label: 'Share to Slack', icon: Slack, color: '#4A154B' },
    { id: 'jira', label: 'Share to Jira', icon: Share2, color: '#0052CC' },
  ];

  if (allowEmail) {
    shareOptions.push({ id: 'email', label: 'Share via Email', icon: Mail, color: '#EA4335' });
  }

  const handleShareClick = (option: ShareOption) => {
    setSelectedOption(option);
    setCustomMessage(`${title}\n\n${contentPreview}`);
    setShareOpen(true);
  };

  const handleShare = () => {
    toast({
      title: `Shared to ${selectedOption?.label.split(' ')[2]}`,
      description: "This is a demo of the sharing UI. No actual sharing occurred.",
    });
    setShareOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size={iconOnly ? "icon" : "sm"} 
            className={className}
            onClick={(e) => {
              if (onClick) {
                onClick(e);
                e.stopPropagation();
              }
            }}
          >
            <Share2 className="h-4 w-4" />
            {!iconOnly && <span>Share</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          {shareOptions.map((option) => (
            <DropdownMenuItem 
              key={option.id}
              onClick={() => handleShareClick(option)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <option.icon className="h-4 w-4" style={{ color: option.color }} />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedOption && (
                <selectedOption.icon 
                  className="h-5 w-5" 
                  style={{ color: selectedOption.color }} 
                />
              )}
              {selectedOption?.label}
            </DialogTitle>
            <DialogDescription>
              Customize your message before sharing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              placeholder="Add additional context..."
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>Share Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
