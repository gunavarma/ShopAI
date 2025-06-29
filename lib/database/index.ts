// Database API exports for ShopWhiz
export { ProfilesAPI } from './profiles';
export { WishlistAPI } from './wishlist';
export { CartAPI } from './cart';
export { OrdersAPI } from './orders';
export { PriceAlertsAPI } from './price-alerts';
export { ChatHistoryAPI } from './chat-history';
export { AnalyticsAPI } from './analytics';

// Re-export types
export * from './types';

// Database utilities
export class DatabaseUtils {
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  static formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static generateProductId(name: string, brand: string): string {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `${cleanBrand}-${cleanName}-${timestamp}`;
  }

  static calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static sanitizeSearchQuery(query: string): string {
    return query.trim().toLowerCase().replace(/[^\w\s]/g, '');
  }

  static generateChatTitle(firstMessage: string): string {
    const words = firstMessage.split(' ').slice(0, 6);
    let title = words.join(' ');
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    return title || 'New Chat';
  }
}

// Database connection health check
export class DatabaseHealth {
  static async checkConnection(): Promise<boolean> {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
  }

  static async getTableCounts(): Promise<Record<string, number>> {
    try {
      const { supabase } = await import('@/lib/supabase');
      
      const tables = [
        'profiles',
        'wishlist_items',
        'cart_items',
        'orders',
        'order_items',
        'price_alerts',
        'chat_history',
        'product_views',
        'search_history'
      ];

      const counts: Record<string, number> = {};

      for (const table of tables) {
        try {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          counts[table] = count || 0;
        } catch (error) {
          counts[table] = -1; // Indicates error
        }
      }

      return counts;
    } catch (error) {
      console.error('Error getting table counts:', error);
      return {};
    }
  }
}