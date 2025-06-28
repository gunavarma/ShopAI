"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Key,
  Download,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface SettingsScreenProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsScreen({ open, onClose }: SettingsScreenProps) {
  const { theme, setTheme } = useTheme();
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    // Profile
    name: 'John Doe',
    email: 'john@example.com',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    
    // Privacy
    dataCollection: true,
    analytics: true,
    personalizedAds: false,
    
    // AI Settings
    aiModel: 'gemini-pro',
    responseLength: 'medium',
    language: 'en',
    
    // API
    geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated.'
    });
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopwhiz-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported!', {
      description: 'Your data has been downloaded.'
    });
  };

  const handleClearData = () => {
    toast.success('Data cleared!', {
      description: 'All local data has been removed.'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-background border-border/50">
        <DialogHeader className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
              <p className="text-sm text-muted-foreground">Manage your preferences and account</p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  AI Settings
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={settings.name}
                          onChange={(e) => handleSettingChange('name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleSettingChange('email', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Theme Preference</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gray-900"></div>
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-gray-900"></div>
                              System
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Browser notifications for important updates</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Privacy & Data</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Collection</Label>
                        <p className="text-sm text-muted-foreground">Allow collection of usage data to improve the service</p>
                      </div>
                      <Switch
                        checked={settings.dataCollection}
                        onCheckedChange={(checked) => handleSettingChange('dataCollection', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics</Label>
                        <p className="text-sm text-muted-foreground">Help us understand how you use ShopWhiz</p>
                      </div>
                      <Switch
                        checked={settings.analytics}
                        onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Personalized Ads</Label>
                        <p className="text-sm text-muted-foreground">Show relevant product recommendations</p>
                      </div>
                      <Switch
                        checked={settings.personalizedAds}
                        onCheckedChange={(checked) => handleSettingChange('personalizedAds', checked)}
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* AI Settings Tab */}
              <TabsContent value="ai" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">AI Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>AI Model</Label>
                      <Select value={settings.aiModel} onValueChange={(value) => handleSettingChange('aiModel', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-pro">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Pro</Badge>
                              Gemini Pro - Best performance
                            </div>
                          </SelectItem>
                          <SelectItem value="gemini-flash">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Fast</Badge>
                              Gemini Flash - Faster responses
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Response Length</Label>
                      <Select value={settings.responseLength} onValueChange={(value) => handleSettingChange('responseLength', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short - Concise answers</SelectItem>
                          <SelectItem value="medium">Medium - Balanced responses</SelectItem>
                          <SelectItem value="long">Long - Detailed explanations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Language</Label>
                      <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                          <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">Gemini API Key</Label>
                      <div className="relative mt-1">
                        <Input
                          id="apiKey"
                          type={showApiKey ? "text" : "password"}
                          value={settings.geminiApiKey}
                          onChange={(e) => handleSettingChange('geminiApiKey', e.target.value)}
                          placeholder="Enter your Gemini API key"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Export Settings</Label>
                        <p className="text-sm text-muted-foreground">Download your settings and data</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Clear Local Data</Label>
                        <p className="text-sm text-muted-foreground">Remove all stored data from this device</p>
                      </div>
                      <Button variant="destructive" onClick={handleClearData}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Data
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Changes are saved automatically
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="neon-glow">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}