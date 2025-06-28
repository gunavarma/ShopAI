"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, AlertCircle, Zap, ShoppingBag, Plus, Paperclip, Mic, Menu, ShoppingCart, Settings, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { AIAssistant } from '@/lib/ai-responses';
import { RealtimeProduct } from '@/lib/realtime-products';
import { ShoppingAssistantResponse } from '@/lib/shopping-assistant';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm ShopWhiz, your AI shopping assistant powered by Gemini AI. I can search across ALL product categories - electronics, fashion, home, beauty, sports, books, toys, automotive, and more! Just like Amazon, I'll help you find anything you need. What are you looking for today?",
      role: 'assistant',
      timestamp: Date.now(),
      suggestedActions: ['Show me smartphones', 'Find running shoes', 'Kitchen appliances', 'Beauty products', 'Books to read', 'Gaming accessories']
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
  const [realtimeProducts, setRealtimeProducts] = useState<RealtimeProduct[]>([]);
  const [structuredRecommendations, setStructuredRecommendations] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('current');
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available categories and price ranges
  const categories = [
    'all', 'smartphone', 'laptop', 'monitor', 'headphones', 'smartwatch', 
    'tablet', 'camera', 'speaker', 'keyboard', 'mouse', 'clothing', 'shoes', 
    'bag', 'watch', 'furniture', 'appliance', 'kitchen', 'fitness', 'sports', 
    'beauty', 'skincare', 'book', 'toy', 'game', 'automotive', 'car'
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-10000', label: 'Under ₹10,000' },
    { value: '10000-25000', label: '₹10,000 - ₹25,000' },
    { value: '25000-50000', label: '₹25,000 - ₹50,000' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000-999999', label: 'Above ₹1,00,000' }
  ];

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    if (!realtimeProducts || realtimeProducts.length === 0) return [];

    return realtimeProducts.filter(product => {
      // Category filter
      const matchesCategory = categoryFilter === 'all' || 
        product.category.toLowerCase() === categoryFilter.toLowerCase();

      // Price filter
      let matchesPrice = true;
      if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        matchesPrice = product.price >= min && product.price <= max;
      }

      return matchesCategory && matchesPrice;
    });
  }, [realtimeProducts, categoryFilter, priceFilter]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set sidebar default state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Open on desktop
      } else {
        setSidebarOpen(false); // Closed on mobile
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if Gemini API key is configured
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY === 'your_gemini_api_key_here') {
      setApiError('Gemini API key not configured. Please add your API key to .env.local');
    }
  }, []);

  // Show filters when products are available
  useEffect(() => {
    setShowFilters(realtimeProducts.length > 0);
  }, [realtimeProducts]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setApiError(null);

    // Add typing indicator with animation
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await AIAssistant.processQuery(content);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      // Store real-time products and structured recommendations
      if (response.products) {
        setRealtimeProducts(response.products);
        // Reset filters when new products are loaded
        setCategoryFilter('all');
        setPriceFilter('all');
      } else {
        // Clear products if this is a clarifying question response
        if (response.needsMoreInfo) {
          setRealtimeProducts([]);
          setShowFilters(false);
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
        needsMoreInfo: response.needsMoreInfo
      };

      setMessages(prev => [...prev, aiMessage]);

      if (response.requiresQuiz) {
        setShowQuiz(true);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while searching for products across our vast catalog. This might be due to API configuration issues or network connectivity. Please try again or check if the Gemini API key is properly set up.",
        role: 'assistant',
        timestamp: Date.now(),
        suggestedActions: ['Try again', 'Check API setup', 'Show popular products', 'Browse categories']
      };
      setMessages(prev => [...prev, errorMessage]);
      
      setApiError('Failed to get product data. Please check your API configuration.');
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
      const response = await AIAssistant.processQuizAnswers(answers);
      
      setMessages(prev => prev.filter(msg => msg.id !== 'typing-quiz'));

      // Store real-time products and structured recommendations
      if (response.products) {
        setRealtimeProducts(response.products);
        // Reset filters when new products are loaded
        setCategoryFilter('all');
        setPriceFilter('all');
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
    } catch (error) {
      console.error('Error processing quiz:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing-quiz'));
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I encountered an error while processing your quiz responses and searching across our product catalog. Please try again.",
        role: 'assistant',
        timestamp: Date.now(),
        suggestedActions: ['Try again', 'Browse categories', 'Search directly']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm ShopWhiz, your AI shopping assistant. What are you looking for today?",
        role: 'assistant',
        timestamp: Date.now(),
        suggestedActions: ['Show me smartphones', 'Find running shoes', 'Kitchen appliances', 'Beauty products']
      }
    ]);
    setRealtimeProducts([]);
    setStructuredRecommendations(null);
    setCurrentChatId(Date.now().toString());
    // Reset filters
    setCategoryFilter('all');
    setPriceFilter('all');
    setShowFilters(false);
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    // In a real app, you would load the chat history here
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setPriceFilter('all');
  };

  return (
    <div className="flex h-screen relative">
      {/* Absolute Positioned Sidebar */}
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
        currentChatId={currentChatId}
      />

      {/* Sidebar Toggle Button - Mobile Only */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors lg:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-5 h-5 text-primary" />
      </motion.button>

      {/* Logo - Only show when sidebar is closed on desktop */}
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

      {/* Settings Icon - Bottom when sidebar closed */}
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

      {/* Main Chat Area - Full Width */}
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
                {apiError.includes('API key') && (
                  <span className="block mt-1 text-xs text-muted-foreground">
                    Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Clean Header - Minimal Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end p-4"
        >
          {/* Cart Button - Right Side Only */}
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
        </motion.div>

        {/* Product Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border/50 bg-background/95 backdrop-blur-sm"
            >
              <div className="max-w-4xl mx-auto p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(categoryFilter !== 'all' || priceFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear Filters
                    </Button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant="secondary" className="text-xs">
                      {filteredProducts.length} of {realtimeProducts.length} products
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area - Full Width */}
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
                  />
                  {message.hasProducts && filteredProducts.length > 0 && (
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
                      <ProductCarousel products={filteredProducts} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Modern Input Area with Shining Border - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 w-full"
        >
          {/* Input Container with Shining Border */}
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
              
              {/* Main Input Field */}
              <div className="relative flex items-center bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:bg-background/80 transition-all duration-200 shadow-lg">
                {/* Attachment Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted/50 mr-2 transition-colors"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </Button>

                {/* Text Input */}
                <input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground/70 resize-none"
                  style={{ minHeight: '20px' }}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-1 ml-2">
                  {/* Voice Input Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  {/* Send Button */}
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
    </div>
  );
}