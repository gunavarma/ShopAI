"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Bell, 
  BellOff,
  Star, 
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Trash2,
  Mail,
  Phone,
  Settings,
  Filter,
  Search,
  SortAsc,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PriceAlertModal } from './price-alert-modal';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '../auth/protected-route';
import { WishlistAPI, CartAPI, PriceAlertsAPI } from '@/lib/database';

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  targetPrice?: number;
  image: string;
  rating: number;
  category: string;
  inStock: boolean;
  priceHistory: Array<{ date: string; price: number }>;
  alertEnabled: boolean;
  lastPriceChange: 'up' | 'down' | 'same';
  priceChangePercent: number;
  addedDate: string;
}

interface WishlistScreenProps {
  open: boolean;
  onClose: () => void;
}

export function WishlistScreen({ open, onClose }: WishlistScreenProps) {
  const { isAuthenticated, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('added');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: user?.email || 'john@example.com',
    phone: '+91 9876543210',
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    instantAlerts: true,
    dailyDigest: false,
    weeklyReport: true
  });

  // Fetch wishlist items from database
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!isAuthenticated || !user) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const items = await WishlistAPI.getWishlist(user.id);
        
        // Transform database items to component format
        const transformedItems = items.map(item => ({
          id: item.id,
          name: item.product_name,
          brand: item.product_brand,
          currentPrice: item.current_price,
          originalPrice: item.original_price || item.current_price,
          targetPrice: item.target_price,
          image: item.product_image,
          rating: item.rating,
          category: item.category,
          inStock: item.in_stock,
          priceHistory: [{ date: item.created_at, price: item.current_price }],
          alertEnabled: item.alert_enabled,
          lastPriceChange: 'same' as 'up' | 'down' | 'same',
          priceChangePercent: 0,
          addedDate: item.created_at
        }));
        
        setWishlistItems(transformedItems);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        toast.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlistItems();
  }, [isAuthenticated, user]);

  const handlePriceAlertSave = async (targetPrice: number, alertType: string) => {
    if (!isAuthenticated || !user || !selectedItem) {
      toast.error('You must be logged in to set price alerts');
      setShowPriceAlertModal(false);
      return;
    }
    
    try {
      // Update wishlist item with target price and enable alert
      await WishlistAPI.updateWishlistItem(user.id, selectedItem.id, {
        target_price: targetPrice,
        alert_enabled: true
      });
      
      // Create price alert in database
      await PriceAlertsAPI.createPriceAlert({
        user_id: user.id,
        wishlist_item_id: selectedItem.id,
        target_price: targetPrice,
        alert_type: alertType === 'drops below' ? 'drops_below' : 'percentage_discount',
        percentage: alertType === 'percentage' ? 10 : undefined,
        is_active: true,
        last_checked: new Date().toISOString()
      });
      
      // Update local state
      setWishlistItems(items =>
        items.map(item =>
          item.id === selectedItem.id 
            ? { ...item, targetPrice, alertEnabled: true }
            : item
        )
      );
      
      toast.success('Price alert set!', {
        description: `You'll be notified when ${selectedItem.name} ${alertType} ₹${targetPrice.toLocaleString()}`
      });
      
      setShowPriceAlertModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error setting price alert:', error);
      toast.error('Failed to set price alert');
    }
  };

  const toggleAlert = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to manage alerts');
      return;
    }
    
    const item = wishlistItems.find(item => item.id === id);
    if (!item) return;
    
    try {
      // Toggle alert in database
      await WishlistAPI.toggleAlert(user.id, id, !item.alertEnabled);
      
      // Update local state
      setWishlistItems(items =>
        items.map(item =>
          item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item
        )
      );
      
      toast.success(
        item.alertEnabled ? 'Price alert disabled' : 'Price alert enabled',
        {
          description: item.alertEnabled 
            ? 'You will no longer receive notifications for this item'
            : 'You will be notified when the price drops'
        }
      );
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Failed to update alert settings');
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to manage your wishlist');
      return;
    }
    
    try {
      // Remove from database
      await WishlistAPI.removeFromWishlist(user.id, id);
      
      // Update local state
      const item = wishlistItems.find(item => item.id === id);
      setWishlistItems(items => items.filter(item => item.id !== id));
      
      if (item) {
        toast.success('Removed from wishlist', {
          description: `${item.name} has been removed from your wishlist`
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to add items to your cart');
      return;
    }
    
    const item = wishlistItems.find(item => item.id === id);
    if (!item) return;
    
    try {
      // Add to cart in database
      await CartAPI.addToCart({
        user_id: user.id,
        product_id: id,
        product_name: item.name,
        product_brand: item.brand,
        product_image: item.image,
        price: item.currentPrice,
        original_price: item.originalPrice,
        quantity: 1,
        category: item.category,
        rating: item.rating,
        in_stock: item.inStock,
        source: 'wishlist'
      });
      
      toast.success('Added to cart', {
        description: `${item.name} has been added to your cart`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const setPriceAlert = (item: WishlistItem) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to set price alerts');
      return;
    }
    
    setSelectedItem(item);
    setShowPriceAlertModal(true);
  };

  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'discount':
          return b.priceChangePercent - a.priceChangePercent;
        case 'added':
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

  const categories = ['all', 'smartphone', 'laptop', 'headphones', 'smartwatch', 'tablet'];
  const activeAlerts = wishlistItems.filter(item => item.alertEnabled).length;
  const totalSavings = wishlistItems.reduce((sum, item) => 
    sum + (item.originalPrice - item.currentPrice), 0
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-background border-border/50">
          <ProtectedRoute>
            <DialogHeader className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Wishlist & Price Alerts</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {wishlistItems.length} items • {activeAlerts} active alerts
                  </p>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="wishlist" className="flex-1">
              <div className="border-b border-border/50 px-6">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                  <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="flex-1 m-0">
                <div className="p-6 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{wishlistItems.length}</p>
                          <p className="text-sm text-muted-foreground">Items in Wishlist</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-card rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{activeAlerts}</p>
                          <p className="text-sm text-muted-foreground">Active Alerts</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-card rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingDown className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">₹{totalSavings.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Savings</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search wishlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="added">Recently Added</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="discount">Biggest Discount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wishlist Items */}
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <AnimatePresence>
                        {filteredItems.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                          >
                            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                              {searchQuery || filterCategory !== 'all' ? 'No items found' : 'Your wishlist is empty'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {searchQuery || filterCategory !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'Start adding items to your wishlist to track prices'
                              }
                            </p>
                            <Button onClick={onClose}>Start Shopping</Button>
                          </motion.div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredItems.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-lg p-4 hover:neon-glow transition-all duration-300"
                              >
                                <div className="flex gap-4">
                                  {/* Product Image */}
                                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="secondary" className="text-xs">
                                            {item.brand}
                                          </Badge>
                                          <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs text-muted-foreground">{item.rating}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Alert Toggle */}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleAlert(item.id)}
                                        className={`h-8 w-8 p-0 ${item.alertEnabled ? 'text-blue-500' : 'text-muted-foreground'}`}
                                      >
                                        {item.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                                      </Button>
                                    </div>

                                    {/* Price Info */}
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-semibold">
                                        ₹{item.currentPrice.toLocaleString()}
                                      </span>
                                      {item.originalPrice !== item.currentPrice && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          ₹{item.originalPrice.toLocaleString()}
                                        </span>
                                      )}
                                      {item.lastPriceChange !== 'same' && (
                                        <div className={`flex items-center gap-1 text-xs ${
                                          item.lastPriceChange === 'down' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {item.lastPriceChange === 'down' ? 
                                            <TrendingDown className="w-3 h-3" /> : 
                                            <TrendingUp className="w-3 h-3" />
                                          }
                                          <span>{Math.abs(item.priceChangePercent)}%</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Target Price */}
                                    {item.targetPrice && (
                                      <div className="text-xs text-muted-foreground mb-2">
                                        Target: ₹{item.targetPrice.toLocaleString()}
                                        {item.currentPrice <= item.targetPrice && (
                                          <Badge variant="default" className="ml-2 text-xs">
                                            Target Reached!
                                          </Badge>
                                        )}
                                      </div>
                                    )}

                                    {/* Stock Status */}
                                    {!item.inStock && (
                                      <Badge variant="destructive" className="text-xs mb-2">
                                        Out of Stock
                                      </Badge>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => addToCart(item.id)}
                                        disabled={!item.inStock}
                                        className="flex-1"
                                      >
                                        <ShoppingCart className="w-3 h-3 mr-1" />
                                        Add to Cart
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPriceAlert(item)}
                                      >
                                        <Bell className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    </ScrollArea>
                  )}
                </div>
              </TabsContent>

              {/* Price Alerts Tab */}
              <TabsContent value="alerts" className="flex-1 m-0">
                <div className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Active Price Alerts</h3>
                    
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : activeAlerts === 0 ? (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No active alerts</h3>
                        <p className="text-muted-foreground mb-4">
                          Set up price alerts to get notified when prices drop
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {wishlistItems
                          .filter(item => item.alertEnabled)
                          .map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="glass-card rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>Current: ₹{item.currentPrice.toLocaleString()}</span>
                                      {item.targetPrice && (
                                        <>
                                          <span>•</span>
                                          <span>Target: ₹{item.targetPrice.toLocaleString()}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {item.targetPrice && item.currentPrice <= item.targetPrice ? (
                                    <Badge variant="default" className="bg-green-600">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Target Reached
                                      </Badge>
                                  ) : (
                                    <Badge variant="secondary">
                                      <Bell className="w-3 h-3 mr-1" />
                                      Monitoring
                                    </Badge>
                                  )}
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleAlert(item.id)}
                                  >
                                    <BellOff className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="flex-1 m-0">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                    
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div className="glass-card rounded-lg p-4">
                        <h4 className="font-medium mb-4">Contact Information</h4>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <div className="flex gap-2 mt-1">
                              <Mail className="w-5 h-5 text-muted-foreground mt-2" />
                              <Input
                                id="email"
                                type="email"
                                value={notificationSettings.email}
                                onChange={(e) => setNotificationSettings(prev => 
                                  ({ ...prev, email: e.target.value })
                                )}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex gap-2 mt-1">
                              <Phone className="w-5 h-5 text-muted-foreground mt-2" />
                              <Input
                                id="phone"
                                type="tel"
                                value={notificationSettings.phone}
                                onChange={(e) => setNotificationSettings(prev => 
                                  ({ ...prev, phone: e.target.value })
                                )}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div className="glass-card rounded-lg p-4">
                        <h4 className="font-medium mb-4">Notification Preferences</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive price alerts via email</p>
                            </div>
                            <Switch
                              checked={notificationSettings.emailEnabled}
                              onCheckedChange={(checked) => setNotificationSettings(prev => 
                                ({ ...prev, emailEnabled: checked })
                              )}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>SMS Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive price alerts via SMS</p>
                            </div>
                            <Switch
                              checked={notificationSettings.smsEnabled}
                              onCheckedChange={(checked) => setNotificationSettings(prev => 
                                ({ ...prev, smsEnabled: checked })
                              )}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">Browser notifications for instant alerts</p>
                            </div>
                            <Switch
                              checked={notificationSettings.pushEnabled}
                              onCheckedChange={(checked) => setNotificationSettings(prev => 
                                ({ ...prev, pushEnabled: checked })
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Alert Frequency */}
                      <div className="glass-card rounded-lg p-4">
                        <h4 className="font-medium mb-4">Alert Frequency</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Instant Alerts</Label>
                              <p className="text-sm text-muted-foreground">Get notified immediately when target price is reached</p>
                            </div>
                            <Switch
                              checked={notificationSettings.instantAlerts}
                              onCheckedChange={(checked) => setNotificationSettings(prev => 
                                ({ ...prev, instantAlerts: checked })
                              )}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Daily Digest</Label>
                              <p className="text-sm text-muted-foreground">Daily summary of price changes</p>
                            </div>
                            <Switch
                              checked={notificationSettings.dailyDigest}
                              onCheckedChange={(checked) => setNotificationSettings(prev => 
                                ({ ...prev, dailyDigest: checked })
                              )}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Weekly Report</Label>
                              <p className="text-sm text-muted-foreground">Weekly summary of all wishlist items</p>
                            </div>
                            <Switch
                              checked={notificationSettings.weeklyReport}
                              onCheckedChange={(checked) => setNotificationSettings(prev => 
                                ({ ...prev, weeklyReport: checked })
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ProtectedRoute>
        </DialogContent>
      </Dialog>

      <PriceAlertModal
        open={showPriceAlertModal}
        onClose={() => setShowPriceAlertModal(false)}
        item={selectedItem}
        onSave={handlePriceAlertSave}
      />
    </>
  );
}