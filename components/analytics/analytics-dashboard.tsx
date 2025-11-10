'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Eye, 
  Search, 
  Star, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { AnalyticsAPI } from '@/lib/database/analytics';
import { useAuth } from '@/contexts/auth-context';
import { AnalyticsCharts } from './analytics-charts';

interface AnalyticsData {
  userStats: {
    totalViews: number;
    totalSearches: number;
    favoriteCategory: string;
    recentActivity: number;
  };
  popularProducts: any[];
  popularSearches: any[];
  recentViews: any[];
  searchHistory: any[];
  timeBasedStats: {
    dailyViews: { date: string; count: number }[];
    dailySearches: { date: string; count: number }[];
    categoryTrends: { category: string; count: number }[];
  };
  productInsights: {
    priceRange: { min: number; max: number; average: number };
    topBrands: { brand: string; count: number }[];
    categoryPerformance: { category: string; views: number; avgPrice: number }[];
  };
}

interface AnalyticsDashboardProps {
  open?: boolean;
  onClose?: () => void;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export default function AnalyticsDashboard({ open, onClose }: AnalyticsDashboardProps) {
  const { user, isLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoading) {
      loadAnalyticsData();
    }
  }, [user, isLoading, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userStats, popularProducts, popularSearches, recentViews, searchHistory, timeBasedStats, productInsights] = await Promise.all([
        AnalyticsAPI.getUserStats(user.id),
        AnalyticsAPI.getPopularProducts(10),
        AnalyticsAPI.getPopularSearches(10),
        AnalyticsAPI.getRecentViews(user.id, 20),
        AnalyticsAPI.getSearchHistory(user.id, 20),
        AnalyticsAPI.getTimeBasedStats(user.id, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90),
        AnalyticsAPI.getProductInsights(user.id)
      ]);

      setAnalyticsData({
        userStats,
        popularProducts,
        popularSearches,
        recentViews,
        searchHistory,
        timeBasedStats,
        productInsights
      });
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 7 days';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      electronics: 'bg-blue-100 text-blue-800',
      clothing: 'bg-purple-100 text-purple-800',
      books: 'bg-green-100 text-green-800',
      home: 'bg-orange-100 text-orange-800',
      sports: 'bg-red-100 text-red-800',
      beauty: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadAnalyticsData}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no user, show a message
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Please sign in to view your analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData) return null;

  const content = (
    <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your shopping behavior and discover insights
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadAnalyticsData}>
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.userStats.totalViews)}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.userStats.recentActivity} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.userStats.totalSearches)}</div>
            <p className="text-xs text-muted-foreground">
              Product searches performed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Category</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {analyticsData.userStats.favoriteCategory}
            </div>
            <p className="text-xs text-muted-foreground">
              Most viewed category
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((analyticsData.userStats.recentActivity / 7) * 10)}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Daily activity average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts & Insights</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="searches">Searches</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Popular Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Popular Products
                </CardTitle>
                <CardDescription>
                  Most viewed products in your browsing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.popularProducts.slice(0, 5).map((product, index) => (
                    <div key={product.product_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.product_name}</p>
                          <p className="text-xs text-muted-foreground">{product.product_brand}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{product.count} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Distribution
                </CardTitle>
                <CardDescription>
                  Your browsing activity by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['electronics', 'clothing', 'books', 'home', 'sports', 'beauty'].map((category) => {
                    const categoryViews = analyticsData.recentViews.filter(
                      view => view.category === category
                    ).length;
                    const percentage = analyticsData.recentViews.length > 0 
                      ? (categoryViews / analyticsData.recentViews.length) * 100 
                      : 0;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="space-y-6">
            {/* Price Insights */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Price Range</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Min:</span>
                      <span className="font-medium">${analyticsData.productInsights.priceRange.min.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Max:</span>
                      <span className="font-medium">${analyticsData.productInsights.priceRange.max.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average:</span>
                      <span className="font-medium">${analyticsData.productInsights.priceRange.average.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {analyticsData.userStats.favoriteCategory}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Most viewed category
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Activity Trend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.userStats.recentActivity}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Views this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <AnalyticsCharts
              dailyViews={analyticsData.timeBasedStats.dailyViews}
              dailySearches={analyticsData.timeBasedStats.dailySearches}
              categoryTrends={analyticsData.timeBasedStats.categoryTrends}
              categoryPerformance={analyticsData.productInsights.categoryPerformance}
              topBrands={analyticsData.productInsights.topBrands}
            />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product View History</CardTitle>
              <CardDescription>
                Detailed view of all products you've browsed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentViews.map((view) => (
                  <div key={view.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{view.product_name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{view.product_brand}</span>
                          <span>•</span>
                          <Badge variant="outline" className={getCategoryColor(view.category)}>
                            {view.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${view.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(view.viewed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="searches" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Popular Searches */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Searches</CardTitle>
                <CardDescription>
                  Most common search terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.popularSearches.map((search, index) => (
                    <div key={search.query} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{search.query}</span>
                      </div>
                      <Badge variant="secondary">{search.count} searches</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>
                  Your latest search activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.searchHistory.slice(0, 10).map((search) => (
                    <div key={search.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{search.query}</p>
                        <p className="text-xs text-muted-foreground">
                          {search.results_count} results found
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(search.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Your shopping activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentViews.slice(0, 15).map((view) => (
                  <div key={view.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{view.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Viewed {view.product_brand} • ${view.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(view.viewed_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(view.viewed_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // If no `open` prop is provided, render as a full-page block (for /analytics route)
  if (typeof open === 'undefined') {
    return content;
  }

  // Otherwise, render inside a dialog (for in-app modal usage)
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        {content}
      </DialogContent>
    </Dialog>
  );
}
