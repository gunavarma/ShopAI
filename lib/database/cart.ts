import { supabase } from '@/lib/supabase';
import { CartItem } from './types';

export class CartAPI {
  static async getCart(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  static async addToCart(item: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>): Promise<CartItem> {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', item.user_id)
        .eq('product_id', item.product_id)
        .single();

      if (existing) {
        // Update quantity instead of creating new item
        return await CartAPI.updateQuantity(item.user_id, existing.id, existing.quantity + item.quantity);
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async removeFromCart(userId: string, itemId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  static async updateQuantity(userId: string, itemId: string, quantity: number): Promise<CartItem> {
    try {
      if (quantity <= 0) {
        await CartAPI.removeFromCart(userId, itemId);
        throw new Error('Item removed from cart');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  static async clearCart(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  static async getCartTotal(userId: string): Promise<{ subtotal: number; itemCount: number }> {
    try {
      const items = await CartAPI.getCart(userId);
      
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return { subtotal, itemCount };
    } catch (error) {
      console.error('Error calculating cart total:', error);
      throw error;
    }
  }

  static async moveToWishlist(userId: string, itemId: string): Promise<void> {
    try {
      // Get cart item
      const { data: cartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('id', itemId)
        .single();

      if (fetchError) throw fetchError;

      // Add to wishlist
      const wishlistItem = {
        user_id: cartItem.user_id,
        product_id: cartItem.product_id,
        product_name: cartItem.product_name,
        product_brand: cartItem.product_brand,
        product_image: cartItem.product_image,
        current_price: cartItem.price,
        original_price: cartItem.original_price,
        category: cartItem.category,
        rating: cartItem.rating,
        review_count: 0,
        in_stock: cartItem.in_stock,
        availability: cartItem.in_stock ? 'In Stock' : 'Out of Stock',
        alert_enabled: false,
        product_url: cartItem.product_url,
        source: cartItem.source
      };

      const { error: wishlistError } = await supabase
        .from('wishlist_items')
        .insert([wishlistItem]);

      if (wishlistError) throw wishlistError;

      // Remove from cart
      await CartAPI.removeFromCart(userId, itemId);
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      throw error;
    }
  }
}