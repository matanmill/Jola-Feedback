
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
import { Separator } from '@/components/ui/separator';

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
  size?: "default" | "sm" | "lg";
}

export function ShareMenu({ 
  title, 
  contentPreview, 
  allowEmail = false, 
  className = '',
  iconOnly = false,
  onClick,
  size = "default"
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
    setCustomMessage('');
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
            variant="outline"
            size={iconOnly ? "icon" : size} 
            className={`${className} hover:bg-slate-100 hover:border-slate-300 transition-all`}
            onClick={(e) => {
              if (onClick) {
                onClick(e);
                e.stopPropagation();
              }
            }}
          >
            <Share2 className={iconOnly ? "h-4 w-4" : "h-5 w-5"} />
            {!iconOnly && <span>Share</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          {shareOptions.map((option) => (
            <DropdownMenuItem 
              key={option.id}
              onClick={(e) => {
                e.stopPropagation();
                handleShareClick(option);
              }}
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
              Add your message before sharing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Your message:</p>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                placeholder="Add your message here..."
                className="w-full"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Content being shared:</p>
              <div className="bg-slate-50 p-3 rounded-md border text-sm">
                <p className="font-medium">{title}</p>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{contentPreview}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShareOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} className="bg-blue-600 hover:bg-blue-700">
              Share Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
