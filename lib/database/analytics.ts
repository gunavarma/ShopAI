import { supabase } from '@/lib/supabase';
import { ProductView, SearchHistory } from './types';

export class AnalyticsAPI {
  static async trackProductView(view: Omit<ProductView, 'id' | 'viewed_at'>): Promise<ProductView> {
    try {
      const { data, error } = await supabase
        .from('product_views')
        .insert([{
          ...view,
          viewed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error tracking product view:', error);
      throw error;
    }
  }

  static async trackSearch(search: Omit<SearchHistory, 'id' | 'created_at'>): Promise<SearchHistory> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .insert([search])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error tracking search:', error);
      throw error;
    }
  }

  static async getRecentViews(userId: string, limit: number = 10): Promise<ProductView[]> {
    try {
      const { data, error } = await supabase
        .from('product_views')
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent views:', error);
      throw error;
    }
  }

  static async getSearchHistory(userId: string, limit: number = 20): Promise<SearchHistory[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      throw error;
    }
  }

  static async getPopularProducts(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_views')
        .select('product_id, product_name, product_brand, category, count(*)')
        .group('product_id, product_name, product_brand, category')
        .order('count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular products:', error);
      throw error;
    }
  }

  static async getPopularSearches(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('query, count(*)')
        .group('query')
        .order('count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      throw error;
    }
  }

  static async getUserStats(userId: string): Promise<{
    totalViews: number;
    totalSearches: number;
    favoriteCategory: string;
    recentActivity: number;
  }> {
    try {
      // Get total views
      const { count: totalViews } = await supabase
        .from('product_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get total searches
      const { count: totalSearches } = await supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get favorite category
      const { data: categoryData } = await supabase
        .from('product_views')
        .select('category, count(*)')
        .eq('user_id', userId)
        .group('category')
        .order('count', { ascending: false })
        .limit(1);

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentActivity } = await supabase
        .from('product_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('viewed_at', sevenDaysAgo.toISOString());

      return {
        totalViews: totalViews || 0,
        totalSearches: totalSearches || 0,
        favoriteCategory: categoryData?.[0]?.category || 'electronics',
        recentActivity: recentActivity || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
}