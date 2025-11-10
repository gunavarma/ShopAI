"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Settings, 
  History,
  Loader2,
  Plus, 
  Search,
  Trash2,
  Edit3,
  MoreVertical,
  Sun,
  Moon,
  Monitor,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink,
  Zap,
  Headphones,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '../auth/auth-modal';
import { useRealtimeChat } from '@/lib/hooks/use-realtime-chat';
import { ProfileDropdown } from '../auth/profile-dropdown';
import { ChatHistory } from '@/lib/database/types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onSettingsClick: () => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onBooksClick?: () => void;
  onOrdersClick: () => void;
  onAnalyticsClick: () => void;
  currentChatId?: string;
  chats?: ChatHistory[];
  loading?: boolean;
}

export function Sidebar({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  onChatSelect, 
  onSettingsClick,
  onCartClick,
  onWishlistClick,
  onBooksClick,
  onOrdersClick,
  onAnalyticsClick,
  currentChatId,
  chats: externalChats,
  loading: externalLoading = false
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { chats: dbChats, loading: dbLoading } = useRealtimeChat();

  // Use external chats if provided, otherwise use database chats
  const chatHistory = externalChats || dbChats || [];
  const isLoading = externalLoading || dbLoading;

  const filteredHistory = chatHistory.filter(chat =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <TooltipProvider>
      {/* Mobile Overlay - Only show when sidebar is open on mobile */}
    
      {/* Absolute Positioned Sidebar */}
    <motion.aside
  initial={false}
  animate={{ 
    width: isOpen ? 320 : 60,
    x: 0
  }}
  transition={{ 
    type: "spring", 
    damping: 30, 
    stiffness: 300
  }}
  className={`fixed left-0 top-0 h-full  z-50 flex flex-col overflow-hidden ${
    isOpen ? 'glass-card' : ''
  }`}
  onMouseEnter={() => {
    if (window.innerWidth >= 1024 && !isOpen) {
      onToggle(); // open
    }
  }}
  onMouseLeave={() => {
    if (window.innerWidth >= 1024 && isOpen) {
      onToggle(); // close
    }
  }}
>

        {/* Collapsed State - Icons Only */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full w-full p-3 space-y-3"
          >
          
          </motion.div>
        )}

        {/* Expanded State - Full Content */}
       {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full w-full glass-card"
          >
            {/* Header with User Avatar and App Info */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-3 mb-4">
                
                {/* User Profile Section */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 mb-4">
                    <ProfileDropdown
                      onSettingsClick={onSettingsClick}
                      onCartClick={onCartClick}
                      onWishlistClick={onWishlistClick}
                      onOrdersClick={onOrdersClick}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAuthModal(true)}
                      className="flex-1"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
                      <ShoppingBag className="w-3 h-3 text-white" />
                    </div>
                  <h2 className="font-semibold gradient-text">ShopAI</h2>
                  </div>
                  <p className="text-xs text-muted-foreground">AI Shopping Assistant</p>
                </div>
                {/* Collapse Button - Desktop Only */}
                <div className="hidden lg:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* New Chat Button */}
              <Button
                onClick={onNewChat}
                className="w-full neon-glow"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-hidden">
              <div className="p-4 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Recent Chats</span>
                  <Badge variant="secondary" className="text-xs">
                    {isLoading ? '...' : filteredHistory.length}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1 px-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredHistory.map((chat) => (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                          currentChatId === chat.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/30'
                        }`}
                        onClick={() => onChatSelect(chat.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <h4 className="text-sm font-medium truncate">{chat.title}</h4>
                            </div>
                            {chat.last_message && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {chat.last_message}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(chat.updated_at)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {chat.message_count}
                              </Badge>
                            </div>
                          </div>

                          {/* Chat Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem>
                                <Edit3 className="w-3 h-3 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}

                    {filteredHistory.length === 0 && !isLoading && (
                      <div className="text-center py-8">
                        <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ? 'No chats found' : 'No chat history yet'}
                        </p>
                        {!searchQuery && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Start a conversation to see your chat history
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Settings & Actions */}
            <div className="p-4 border-t border-border/50 space-y-3">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      {getThemeIcon()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      <Monitor className="w-4 h-4 mr-2" />
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onAnalyticsClick}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onOrdersClick}
                >
                  <Package className="w-4 h-4 mr-2" />
                  My Orders
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onWishlistClick}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist & Alerts
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onCartClick}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping Cart
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onSettingsClick}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="login"
        />
      </motion.aside>
    </TooltipProvider>
  );
}