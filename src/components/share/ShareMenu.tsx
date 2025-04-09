import React, { useState } from 'react';
import { Share2, Slack, Mail, FileEdit } from 'lucide-react';
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
  DialogClose,
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
  variant?: "default" | "gradient" | "outline";
}

export function ShareMenu({ 
  title, 
  contentPreview, 
  allowEmail = false, 
  className = '',
  iconOnly = false,
  onClick,
  size = "default",
  variant = "default"
}: ShareMenuProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ShareOption | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const shareOptions: ShareOption[] = [
    { id: 'slack', label: 'Share to Slack', icon: Slack, color: '#2563eb' },
    { id: 'jira', label: 'Share to Jira', icon: FileEdit, color: '#2563eb' },
  ];

  if (allowEmail) {
    shareOptions.push({ id: 'email', label: 'Share via Email', icon: Mail, color: '#2563eb' });
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

  // Define different button styles based on the variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg';
      case 'outline':
        return 'bg-transparent border-2 border-blue-400 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm hover:shadow-md';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            size={iconOnly ? "icon" : size} 
            className={`${className} ${getButtonStyle()} rounded-full`}
            onClick={(e) => {
              if (onClick) {
                onClick(e);
                e.stopPropagation();
              }
            }}
          >
            <Share2 className={iconOnly ? "h-4 w-4" : "h-5 w-5 mr-1"} />
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
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50">
          <DialogHeader className="border-b pb-4">
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
                className="w-full border-blue-200 focus:border-blue-400 transition-all"
              />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Content being shared:</p>
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 shadow-inner text-sm">
                <p className="font-medium text-blue-600">{title}</p>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{contentPreview}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-300">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleShare} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              Share Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
