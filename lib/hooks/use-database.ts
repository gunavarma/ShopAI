"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  WishlistAPI,
  CartAPI,
  OrdersAPI,
  ChatHistoryAPI,
  AnalyticsAPI,
  type WishlistItem,
  type CartItem,
  type Order,
  type ChatHistory
} from '@/lib/database';

// Custom hook for wishlist management
export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const items = await WishlistAPI.getWishlist(user.id);
      setWishlist(items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newItem = await WishlistAPI.addToWishlist({
        ...item,
        user_id: user.id
      });
      setWishlist(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await WishlistAPI.removeFromWishlist(user.id, itemId);
      setWishlist(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove from wishlist');
    }
  };

  const toggleAlert = async (itemId: string, enabled: boolean) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const updatedItem = await WishlistAPI.toggleAlert(user.id, itemId, enabled);
      setWishlist(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to toggle alert');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user, fetchWishlist]);

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleAlert,
    refetch: fetchWishlist
  };
}

// Custom hook for cart management
export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const items = await CartAPI.getCart(user.id);
      setCart(items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newItem = await CartAPI.addToCart({
        ...item,
        user_id: user.id
      });
      await fetchCart(); // Refetch to get updated quantities
      return newItem;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await CartAPI.removeFromCart(user.id, itemId);
      setCart(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      
      const updatedItem = await CartAPI.updateQuantity(user.id, itemId, quantity);
      setCart(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      if (err instanceof Error && err.message === 'Item removed from cart') {
        setCart(prev => prev.filter(item => item.id !== itemId));
        return;
      }
      throw new Error(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await CartAPI.clearCart(user.id);
      setCart([]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  };

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    refetch: fetchCart
  };
}

// Custom hook for orders management
export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userOrders = await OrdersAPI.getOrders(user.id);
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      return await OrdersAPI.getOrder(user.id, orderId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, fetchOrders]);

  return {
    orders,
    loading,
    error,
    getOrder,
    refetch: fetchOrders
  };
}

// Custom hook for chat history
export function useChatHistory() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const chatHistory = await ChatHistoryAPI.getChatHistory(user.id);
      setChats(chatHistory);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chat history');
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string, initialMessage?: any) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newChat = await ChatHistoryAPI.createChat({
        user_id: user.id,
        title,
        messages: initialMessage ? [initialMessage] : [],
        last_message: initialMessage?.content || '',
        message_count: initialMessage ? 1 : 0
      });
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create chat');
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await ChatHistoryAPI.deleteChat(user.id, chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete chat');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user, fetchChats]);

  return {
    chats,
    loading,
    error,
    createChat,
    deleteChat,
    refetch: fetchChats
  };
}

// Custom hook for analytics tracking
export function useAnalytics() {
  const { user } = useAuth();

  const trackProductView = async (productId: string, productName: string, productBrand: string, category: string, price: number, source: string = 'ai_generated') => {
    if (!user) return;
    
    try {
      await AnalyticsAPI.trackProductView({
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        product_brand: productBrand,
        category,
        price,
        source
      });
    } catch (err) {
      console.error('Failed to track product view:', err);
    }
  };

  const trackSearch = async (query: string, category?: string, resultsCount: number = 0, clickedProductId?: string) => {
    if (!user) return;
    
    try {
      await AnalyticsAPI.trackSearch({
        user_id: user.id,
        query,
        category,
        results_count: resultsCount,
        clicked_product_id: clickedProductId
      });
    } catch (err) {
      console.error('Failed to track search:', err);
    }
  };

  return {
    trackProductView,
    trackSearch
  };
}