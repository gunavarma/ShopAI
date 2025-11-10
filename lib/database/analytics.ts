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

  // New enhanced analytics methods
  static async getTimeBasedStats(userId: string, days: number = 7): Promise<{
    dailyViews: { date: string; count: number }[];
    dailySearches: { date: string; count: number }[];
    categoryTrends: { category: string; count: number }[];
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get daily views
      const { data: viewsData } = await supabase
        .from('product_views')
        .select('viewed_at, category')
        .eq('user_id', userId)
        .gte('viewed_at', startDate.toISOString());

      // Get daily searches
      const { data: searchesData } = await supabase
        .from('search_history')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      // Process daily views
      const dailyViews = this.groupByDate(viewsData || [], 'viewed_at');
      
      // Process daily searches
      const dailySearches = this.groupByDate(searchesData || [], 'created_at');

      // Process category trends
      const categoryTrends = this.groupByCategory(viewsData || []);

      return {
        dailyViews,
        dailySearches,
        categoryTrends
      };
    } catch (error) {
      console.error('Error fetching time-based stats:', error);
      throw error;
    }
  }

  static async getProductInsights(userId: string): Promise<{
    priceRange: { min: number; max: number; average: number };
    topBrands: { brand: string; count: number }[];
    categoryPerformance: { category: string; views: number; avgPrice: number }[];
  }> {
    try {
      const { data: viewsData } = await supabase
        .from('product_views')
        .select('price, product_brand, category')
        .eq('user_id', userId);

      if (!viewsData || viewsData.length === 0) {
        return {
          priceRange: { min: 0, max: 0, average: 0 },
          topBrands: [],
          categoryPerformance: []
        };
      }

      // Calculate price statistics
      const prices = viewsData.map(v => v.price).filter(p => p > 0);
      const priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices),
        average: prices.reduce((a, b) => a + b, 0) / prices.length
      };

      // Get top brands
      const brandCounts = viewsData.reduce((acc, view) => {
        acc[view.product_brand] = (acc[view.product_brand] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topBrands = Object.entries(brandCounts)
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get category performance
      const categoryStats = viewsData.reduce((acc, view) => {
        if (!acc[view.category]) {
          acc[view.category] = { views: 0, totalPrice: 0, count: 0 };
        }
        acc[view.category].views += 1;
        acc[view.category].totalPrice += view.price || 0;
        acc[view.category].count += 1;
        return acc;
      }, {} as Record<string, { views: number; totalPrice: number; count: number }>);

      const categoryPerformance = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        views: stats.views,
        avgPrice: stats.totalPrice / stats.count
      }));

      return {
        priceRange,
        topBrands,
        categoryPerformance
      };
    } catch (error) {
      console.error('Error fetching product insights:', error);
      throw error;
    }
  }

  private static groupByDate(data: any[], dateField: string): { date: string; count: number }[] {
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private static groupByCategory(data: any[]): { category: string; count: number }[] {
    const grouped = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }
}