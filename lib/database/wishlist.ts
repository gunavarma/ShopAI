import { supabase } from '@/lib/supabase';
import { WishlistItem } from './types';

export class WishlistAPI {
  static async getWishlist(userId: string): Promise<WishlistItem[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  static async addToWishlist(item: Omit<WishlistItem, 'id' | 'created_at' | 'updated_at'>): Promise<WishlistItem> {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', item.user_id)
        .eq('product_id', item.product_id)
        .single();

      if (existing) {
        throw new Error('Item already in wishlist');
      }

      const { data, error } = await supabase
        .from('wishlist_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  static async removeFromWishlist(userId: string, itemId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  static async updateWishlistItem(userId: string, itemId: string, updates: Partial<WishlistItem>): Promise<WishlistItem> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      throw error;
    }
  }

  static async toggleAlert(userId: string, itemId: string, enabled: boolean): Promise<WishlistItem> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .update({
          alert_enabled: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling alert:', error);
      throw error;
    }
  }

  static async updatePrice(itemId: string, newPrice: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .update({
          current_price: newPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating price:', error);
      throw error;
    }
  }

  static async getItemsByCategory(userId: string, category: string): Promise<WishlistItem[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist by category:', error);
      throw error;
    }
  }

  static async searchWishlist(userId: string, query: string): Promise<WishlistItem[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .or(`product_name.ilike.%${query}%,product_brand.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching wishlist:', error);
      throw error;
    }
  }
}