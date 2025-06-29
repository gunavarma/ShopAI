"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, AlertCircle, Zap, ShoppingBag, Plus, Paperclip, Mic, Menu, ShoppingCart, Settings, Wifi, WifiOff, User, MessageSquare, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from './chat-message';
import { ProductCarousel } from './product-carousel';
import { SuggestedActions } from './suggested-actions';
import { QuizModal } from './quiz-modal';
import { Sidebar } from '../sidebar/sidebar';
import { SettingsScreen } from '../settings/settings-screen';
import { CartScreen } from '../cart/cart-screen';
import { WishlistScreen } from '../wishlist/wishlist-screen';
import { BooksScreen } from '../books/books-screen';
import { OrdersScreen } from '../orders/orders-screen';
import { Message } from '@/types/chat';
import { EnhancedAIAssistant } from '@/lib/ai-responses-enhanced';
import { EnhancedRealtimeProduct } from '@/lib/realtime-products-enhanced';
import { ShoppingAssistantResponse } from '@/lib/shopping-assistant';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '../auth/auth-modal';
import { ProfileDropdown } from '../auth/profile-dropdown';
import { useRealtimeChat } from '@/lib/hooks/use-realtime-chat';
import { useRealtimeAnalytics } from '@/lib/hooks/use-realtime-analytics';
import { toast } from 'sonner';

export function ChatInterfaceEnhanced() {
  const { isAuthenticated, user } = useAuth();
  const {
    chats,
    currentChat,
    loading: chatLoading,
    createNewChat,
    selectChat,
    addMessage,
    clearCurrentChat
  } = useRealtimeChat();
  const { trackSearch, trackChatInteraction, trackProductView } = useRealtimeAnalytics();

  // Local state for current conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm ShopWhiz, your AI shopping assistant powered by real-time data from Google Shopping and Amazon India. I can search across ALL product categories with live prices, reviews, and availability - just like the best shopping platforms! What are you looking for today?",
      role: 'assistant',
      timestamp: Date.now(),
      suggestedActions: ['iPhone 15 Pro Max', 'Samsung Galaxy S24', 'MacBook Pro M3', 'Sony headphones', 'Nike running shoes', 'Gaming laptops']
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [realtimeProducts, setRealtimeProducts] = useState<EnhancedRealtimeProduct[]>([]);
  const [structuredRecommendations, setStructuredRecommendations] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataSource, setDataSource] = useState<'real_time' | 'ai_generated' | 'mixed'>('ai_generated');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages from current chat
  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    } else {
      // Reset to welcome message when no chat is selected
      setMessages([
        {
          id: '1',
          content: "Hello! I'm ShopWhiz, your AI shopping assistant powered by real-time data from Google Shopping and Amazon India. I can search across ALL product categories with live prices, reviews, and availability - just like the best shopping platforms! What are you looking for today?",
          role: 'assistant',
          timestamp: Date.now(),
          suggestedActions: ['iPhone 15 Pro Max', 'Samsung Galaxy S24', 'MacBook Pro M3', 'Sony headphones', 'Nike running shoes', 'Gaming laptops']
        }
      ]);
    }
  }, [currentChat]);

  // Set sidebar default state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check API configuration
  useEffect(() => {
    const hasGeminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY && 
                        process.env.NEXT_PUBLIC_GEMINI_API_KEY !== 'your_gemini_api_key_here';
    const hasScraperKey = process.env.NEXT_PUBLIC_SCRAPER_API_KEY && 
                         process.env.NEXT_PUBLIC_SCRAPER_API_KEY !== 'your_scraper_api_key_here';

    if (!hasGeminiKey) {
      setApiError('Gemini AI key not configured. Please add your API key to .env.local');
    } else if (!hasScraperKey) {
      setApiError('ScraperAPI key not configured. Using AI-generated product data only.');
    } else {
      setApiError(null);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now()
    };

    // Update local messages immediately
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsLoading(true);
    setApiError(null);

    // Create new chat if none exists and user is authenticated
    let chatToUse = currentChat;
    if (!chatToUse && isAuthenticated) {
      chatToUse = await createNewChat(undefined, userMessage);
    }

    // Add message to database if chat exists
    if (chatToUse && isAuthenticated) {
      await addMessage(userMessage);
    }

    // Track search analytics
    await trackSearch(content, undefined, 0);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await EnhancedAIAssistant.processQuery(content);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      // Store real-time products and data source
      if (response.products) {
        setRealtimeProducts(response.products);
        setDataSource(response.dataSource || 'ai_generated');
        
        // Track product views
        for (const product of response.products.slice(0, 3)) {
          await trackProductView(
            product.id,
            product.name,
            product.brand,
            product.category,
            product.price,
            product.source
          );
        }
      } else {
        if (response.needsMoreInfo) {
          setRealtimeProducts([]);
        }
      }
      
      if (response.structuredRecommendations) {
        setStructuredRecommendations(response.structuredRecommendations);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: Date.now(),
        hasProducts: response.products && response.products.length > 0,
        suggestedActions: response.suggestedActions,
        clarifyingQuestions: response.clarifyingQuestions,
        brandSuggestions: response.brandSuggestions,
        needsMoreInfo: response.needsMoreInfo,
        category: response.category
      };

      // Update local messages
      setMessages(prev => [...prev, aiMessage]);

      // Save AI message to database if chat exists
      if (chatToUse && isAuthenticated) {
        await addMessage(aiMessage);
      }

      // Track chat interaction
      await trackChatInteraction(
        content,
        response.needsMoreInfo ? 'clarification' : 'product_search',
        response.products?.length || 0
      );

      if (response.requiresQuiz) {
        setShowQuiz(true);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while searching for products. This might be due to API configuration issues or network connectivity. Please try again or check if the API keys are properly set up.",
        role: 'assistant',
        timestamp: Date.now(),
        suggestedActions: ['Try again', 'Check API setup', 'Show popular products', 'Browse categories']
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to database if chat exists
      if (chatToUse && isAuthenticated) {
        await addMessage(errorMessage);
      }
      
      setApiError('Failed to get product data. Please check your API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandPriceSelection = async (brand: string, priceRange: string, category: string) => {
    setIsLoading(true);
    setApiError(null);

    const typingMessage: Message = {
      id: 'typing-selection',
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await EnhancedAIAssistant.processBrandPriceSelection(brand, priceRange, category);
      
      setMessages(prev => prev.filter(msg => msg.id !== 'typing-selection'));

      if (response.products) {
        setRealtimeProducts(response.products);
        setDataSource(response.dataSource || 'ai_generated');
        
        // Track product views
        for (const product of response.products.slice(0, 3)) {
          await trackProductView(
            product.id,
            product.name,
            product.brand,
            product.category,
            product.price,
            product.source
          );
        }
      }
      
      if (response.structuredRecommendations) {
        setStructuredRecommendations(response.structuredRecommendations);
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response.message,
        role: 'assistant',
        timestamp: Date.now(),
        hasProducts: response.products && response.products.length > 0,
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to database if chat exists
      if (currentChat && isAuthenticated) {
        await addMessage(aiMessage);
      }

      // Track selection
      await trackSearch(`${brand} ${category} ${priceRange}`, category, response.products?.length || 0);

    } catch (error) {
      console.error('Error processing brand/price selection:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing-selection'));
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I encountered an error while searching for products based on your selection. Please try again.",
        role: 'assistant',
        timestamp: Date.now(),
        suggestedActions: ['Try again', 'Browse categories', 'Show popular products']
      };
      setMessages(prev => [...prev, errorMessage]);

      if (currentChat && isAuthenticated) {
        await addMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedAction = (action: string) => {
    if (action === 'Help me choose' || action === 'Start quiz') {
      setShowQuiz(true);
    } else {
      handleSendMessage(action);
    }
  };

  const handleQuizComplete = async (answers: Array<{questionId: string, answer: string}>) => {
    setShowQuiz(false);
    setIsLoading(true);
    setApiError(null);

    const typingMessage: Message = {
      id: 'typing-quiz',
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await EnhancedAIAssistant.processQuizAnswers(answers);
      
      setMessages(prev => prev.filter(msg => msg.id !== 'typing-quiz'));

      if (response.products) {
        setRealtimeProducts(response.products);
        setDataSource(response.dataSource || 'ai_generated');
        
        // Track product views
        for (const product of response.products.slice(0, 3)) {
          await trackProductView(
            product.id,
            product.name,
            product.brand,
            product.category,
            product.price,
            product.source
          );
        }
      }
      
      if (response.structuredRecommendations) {
        setStructuredRecommendations(response.structuredRecommendations);
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response.message,
        role: 'assistant',
        timestamp: Date.now(),
        hasProducts: response.products && response.products.length > 0,
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to database if chat exists
      if (currentChat && isAuthenticated) {
        await addMessage(aiMessage);
      }

      // Track quiz completion
      await trackChatInteraction('quiz_completion', 'quiz_results', response.products?.length || 0);
    } catch (error) {
      console.error('Error processing quiz:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing-quiz'));
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I encountered an error while processing your quiz responses. Please try again.",
        role: 'assistant',
        timestamp: Date.now(),
        suggestedActions: ['Try again', 'Browse categories', 'Search directly']
      };
      setMessages(prev => [...prev, errorMessage]);

      if (currentChat && isAuthenticated) {
        await addMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    clearCurrentChat();
    setRealtimeProducts([]);
    setStructuredRecommendations(null);
    setDataSource('ai_generated');
    
    if (isAuthenticated) {
      // Create a new chat in the database
      await createNewChat();
    }
  };

  const handleChatSelect = async (chatId: string) => {
    await selectChat(chatId);
  };

  const getDataSourceInfo = () => {
    switch (dataSource) {
      case 'real_time':
        return {
          icon: <Wifi className="w-4 h-4 text-green-500" />,
          text: 'Live data from Google Shopping & Amazon',
          color: 'text-green-600'
        };
      case 'mixed':
        return {
          icon: <Zap className="w-4 h-4 text-blue-500" />,
          text: 'Real-time + AI recommendations',
          color: 'text-blue-600'
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-purple-500" />,
          text: 'AI-powered recommendations',
          color: 'text-purple-600'
        };
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onSettingsClick={() => setShowSettings(true)}
        onCartClick={() => setShowCart(true)}
        onWishlistClick={() => setShowWishlist(true)}
        onBooksClick={() => setShowBooks(true)}
        onOrdersClick={() => setShowOrders(true)}
        currentChatId={currentChat?.id}
        chats={chats}
        loading={chatLoading}
      />

      {/* Mobile Sidebar Toggle */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors lg:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-5 h-5 text-primary" />
      </motion.button>

      {/* Logo - Desktop when sidebar closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-4 left-4 z-40 hidden lg:flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold gradient-text">ShopWhiz</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Icon - Desktop when sidebar closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setShowSettings(true)}
            className="fixed bottom-4 left-4 z-40 hidden lg:flex w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 items-center justify-center hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-primary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex flex-col h-screen w-full">
        {/* API Error Alert */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="m-4 border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {apiError}
                {apiError.includes('Gemini') && (
                  <span className="block mt-1 text-xs text-muted-foreground">
                    Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                  </span>
                )}
                {apiError.includes('ScraperAPI') && (
                  <span className="block mt-1 text-xs text-muted-foreground">
                    Get your API key from <a href="https://www.scraperapi.com/" target="_blank" rel="noopener noreferrer" className="underline">ScraperAPI</a> for real-time product data
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4"
        >
          {/* Data Source Indicator and Chat Info */}
          <div className="flex items-center gap-4">
            {realtimeProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full"
              >
                {getDataSourceInfo().icon}
                <span className={`text-xs font-medium ${getDataSourceInfo().color}`}>
                  {getDataSourceInfo().text}
                </span>
              </motion.div>
            )}
            
            {currentChat && isAuthenticated && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">{currentChat.title}</span>
                <Badge variant="outline" className="text-xs">
                  {currentChat.message_count} messages
                </Badge>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCart(true)}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Authentication */}
            {isAuthenticated ? (
              <ProfileDropdown
                onSettingsClick={() => setShowSettings(true)}
                onCartClick={() => setShowCart(true)}
                onWishlistClick={() => setShowWishlist(true)}
                onOrdersClick={() => setShowOrders(true)}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </motion.div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="p-4 space-y-6 w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <ChatMessage
                    message={message}
                    onSuggestedAction={handleSuggestedAction}
                    onBrandPriceSelection={handleBrandPriceSelection}
                  />
                  {message.hasProducts && realtimeProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 0.3,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 120,
                        damping: 20
                      }}
                      className="mt-4"
                    >
                      <ProductCarousel products={realtimeProducts} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 w-full"
        >
          <div className="relative max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(currentMessage);
              }}
              className="relative"
            >
              {/* Shining Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-2xl opacity-30 blur-sm animate-pulse"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-2xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Input Field */}
              <div className="relative flex items-center bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:bg-background/80 transition-all duration-200 shadow-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted/50 mr-2 transition-colors"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </Button>

                <input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Search for any product..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground/70 resize-none"
                  style={{ minHeight: '20px' }}
                />

                <div className="flex items-center gap-1 ml-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || !currentMessage.trim()}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 neon-glow"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4 text-primary-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <QuizModal
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />

      <SettingsScreen
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <CartScreen
        open={showCart}
        onClose={() => setShowCart(false)}
      />

      <WishlistScreen
        open={showWishlist}
        onClose={() => setShowWishlist(false)}
      />

      <BooksScreen
        open={showBooks}
        onClose={() => setShowBooks(false)}
      />

      <OrdersScreen
        open={showOrders}
        onClose={() => setShowOrders(false)}
      />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </div>
  );
}