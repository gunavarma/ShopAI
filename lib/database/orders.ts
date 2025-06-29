import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from './types';

export class OrdersAPI {
  static async getOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async getOrder(userId: string, orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  static async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]): Promise<Order> {
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        ...item,
        order_id: orderData.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return orderData;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async updateOrderStatus(userId: string, orderId: string, status: Order['status']): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  static async updateTrackingInfo(userId: string, orderId: string, trackingNumber: string, estimatedDelivery?: string): Promise<Order> {
    try {
      const updates: any = {
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      };

      if (estimatedDelivery) {
        updates.estimated_delivery = estimatedDelivery;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('user_id', userId)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tracking info:', error);
      throw error;
    }
  }

  static async markAsDelivered(userId: string, orderId: string): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          actual_delivery: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking as delivered:', error);
      throw error;
    }
  }

  static async cancelOrder(userId: string, orderId: string): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  static async getOrdersByStatus(userId: string, status: Order['status']): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  }

  static async getOrderStats(userId: string): Promise<{
    total: number;
    pending: number;
    delivered: number;
    cancelled: number;
    totalSpent: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total_amount')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        totalSpent: 0
      };

      data.forEach(order => {
        switch (order.status) {
          case 'pending':
          case 'confirmed':
          case 'shipped':
            stats.pending++;
            break;
          case 'delivered':
            stats.delivered++;
            stats.totalSpent += order.total_amount;
            break;
          case 'cancelled':
          case 'returned':
            stats.cancelled++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
}