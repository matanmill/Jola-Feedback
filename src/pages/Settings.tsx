
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Copy, 
  RefreshCw, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Globe, 
  MessageSquare,
  Lock,
  Key,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile Saved",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("api_key_12345abcdef");
    toast({
      title: "API Key Copied",
      description: "API key has been copied to clipboard."
    });
  };

  const handleRegenerateKey = () => {
    toast({
      title: "API Key Regenerated",
      description: "A new API key has been generated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveProfile}>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="general">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your profile information and account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Your email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your company" defaultValue="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title</Label>
                  <Input id="role" placeholder="Your job title" defaultValue="Product Manager" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" className="h-24" placeholder="A brief description about yourself" defaultValue="Product manager with over 5 years of experience in SaaS products." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Password must be at least 8 characters
              </div>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the application appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-view" className="text-base">Compact View</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing for a more compact interface</p>
                </div>
                <Switch 
                  id="compact-view" 
                  checked={compactView} 
                  onCheckedChange={setCompactView} 
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-base mb-2 block">Language</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start" id="english">English (US)</Button>
                  <Button variant="outline" className="justify-start">Spanish</Button>
                  <Button variant="outline" className="justify-start">French</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications from the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="browser-notifications" className="text-base">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                </div>
                <Switch 
                  id="browser-notifications" 
                  checked={browserNotifications} 
                  onCheckedChange={setBrowserNotifications} 
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Notification Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>New Feedback</span>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </Card>
                  <Card className="p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Action Items</span>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                API Settings
              </CardTitle>
              <CardDescription>Manage your API keys and integration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-base">API Key</Label>
                <div className="flex">
                  <Input 
                    id="api-key" 
                    value="api_key_12345abcdef" 
                    readOnly 
                    className="flex-1 font-mono bg-muted" 
                  />
                  <Button variant="outline" className="ml-2" onClick={handleCopyApiKey}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Use this key to authenticate with the API</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="text-base">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-app.com/webhooks/jola" />
                <p className="text-sm text-muted-foreground">Receive real-time updates via webhook</p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <h4 className="text-base font-medium">Regenerate API Key</h4>
                  <p className="text-sm text-muted-foreground">This will invalidate your existing API key</p>
                </div>
                <Button variant="outline" onClick={handleRegenerateKey}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
