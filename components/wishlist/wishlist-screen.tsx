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
  CheckCircle
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
import { Loader2 } from 'lucide-react';
import { WishlistAPI, PriceAlertsAPI } from '@/lib/database';
import { ProtectedRoute } from '../auth/protected-route';

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
  const [activeAlerts, setActiveAlerts] = useState<number>(0);
  
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

  const [notificationSettings, setNotificationSettings] = useState({
    email: 'john@example.com',
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
        setActiveAlerts(items.filter(item => item.alert_enabled).length);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        toast.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlistItems();
  }, [isAuthenticated, user]);

  // Rest of the code remains the same...

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-background border-border/50">
          <ProtectedRoute>
            {/* Rest of the JSX remains the same... */}
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