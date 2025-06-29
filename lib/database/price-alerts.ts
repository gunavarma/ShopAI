import { supabase } from '@/lib/supabase';
import { PriceAlert } from './types';

export class PriceAlertsAPI {
  static async getPriceAlerts(userId: string): Promise<PriceAlert[]> {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          wishlist_items (
            product_name,
            product_brand,
            product_image,
            current_price,
            target_price
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      throw error;
    }
  }

  static async createPriceAlert(alert: Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>): Promise<PriceAlert> {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert([alert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating price alert:', error);
      throw error;
    }
  }

  static async updatePriceAlert(userId: string, alertId: string, updates: Partial<PriceAlert>): Promise<PriceAlert> {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating price alert:', error);
      throw error;
    }
  }

  static async deletePriceAlert(userId: string, alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('user_id', userId)
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting price alert:', error);
      throw error;
    }
  }

  static async toggleAlert(userId: string, alertId: string, isActive: boolean): Promise<PriceAlert> {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling alert:', error);
      throw error;
    }
  }

  static async checkPriceAlerts(): Promise<PriceAlert[]> {
    try {
      // Get all active alerts with their wishlist items
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          wishlist_items (
            id,
            current_price,
            product_name,
            product_brand
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      const triggeredAlerts: PriceAlert[] = [];

      for (const alert of data || []) {
        const wishlistItem = alert.wishlist_items;
        if (!wishlistItem) continue;

        let shouldTrigger = false;

        if (alert.alert_type === 'drops_below') {
          shouldTrigger = wishlistItem.current_price <= alert.target_price;
        } else if (alert.alert_type === 'percentage_discount' && alert.percentage) {
          const discountPrice = wishlistItem.current_price * (1 - alert.percentage / 100);
          shouldTrigger = wishlistItem.current_price <= discountPrice;
        }

        if (shouldTrigger) {
          triggeredAlerts.push(alert);
          
          // Update last_checked timestamp
          await supabase
            .from('price_alerts')
            .update({ last_checked: new Date().toISOString() })
            .eq('id', alert.id);
        }
      }

      return triggeredAlerts;
    } catch (error) {
      console.error('Error checking price alerts:', error);
      throw error;
    }
  }

  static async getAlertsByWishlistItem(userId: string, wishlistItemId: string): Promise<PriceAlert[]> {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('wishlist_item_id', wishlistItemId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching alerts by wishlist item:', error);
      throw error;
    }
  }
}