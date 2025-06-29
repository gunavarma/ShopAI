import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'price_alert' | 'order_update' | 'wishlist_item' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export class NotificationsAPI {
  static async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Helper methods for specific notification types
  static async createPriceAlert(userId: string, productName: string, currentPrice: number, targetPrice: number): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'price_alert',
      title: 'Price Alert Triggered!',
      message: `${productName} is now ₹${currentPrice.toLocaleString()}, below your target of ₹${targetPrice.toLocaleString()}`,
      data: { productName, currentPrice, targetPrice },
      read: false
    });
  }

  static async createOrderUpdate(userId: string, orderNumber: string, status: string): Promise<void> {
    const statusMessages = {
      confirmed: 'Your order has been confirmed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled'
    };

    await this.createNotification({
      user_id: userId,
      type: 'order_update',
      title: 'Order Update',
      message: `Order ${orderNumber}: ${statusMessages[status as keyof typeof statusMessages] || `Status updated to ${status}`}`,
      data: { orderNumber, status },
      read: false
    });
  }

  static async createWishlistAlert(userId: string, productName: string, message: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'wishlist_item',
      title: 'Wishlist Update',
      message: `${productName}: ${message}`,
      data: { productName },
      read: false
    });
  }
}