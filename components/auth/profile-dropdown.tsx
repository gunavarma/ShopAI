"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Package,
  CreditCard,
  Bell,
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { CartAPI, WishlistAPI, OrdersAPI } from '@/lib/database';

interface ProfileDropdownProps {
  onSettingsClick?: () => void;
  onWishlistClick?: () => void;
  onCartClick?: () => void;
  onOrdersClick?: () => void;
}

export function ProfileDropdown({ 
  onSettingsClick, 
  onWishlistClick,
  onCartClick, 
  onOrdersClick 
}: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      
      try {
        // Get cart count
        const cartItems = await CartAPI.getCart(user.id);
        setCartCount(cartItems.length);
        
        // Get wishlist count
        const wishlistItems = await WishlistAPI.getWishlist(user.id);
        setWishlistCount(wishlistItems.length);
        
        // Get order count
        const orders = await OrdersAPI.getOrders(user.id);
        setOrderCount(orders.length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    
    fetchCounts();
  }, [user]);

  if (!user) return null;

  if (!user) return null;

  // Fetch counts from database

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto px-3 rounded-full hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-primary/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-purple-400 text-white text-sm">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 glass-card border-primary/30" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-purple-400 text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Premium Member
              </Badge>
              <Badge variant="outline" className="text-xs">
                Since {new Date(user.createdAt).getFullYear()}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onOrdersClick} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" />
          <span>My Orders</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {orderCount}
          </Badge>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onWishlistClick} className="cursor-pointer">
          <Heart className="mr-2 h-4 w-4" />
          <span>Wishlist</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {wishlistCount}
          </Badge>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onCartClick} className="cursor-pointer">
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Shopping Cart</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {cartCount}
          </Badge>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payment Methods</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}