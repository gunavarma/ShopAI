"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Tag,
  Gift,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '../auth/protected-route';
import { CartAPI } from '@/lib/database';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
  rating: number;
  category: string;
}

interface CartScreenProps {
  open: boolean;
  onClose: () => void;
}

export function CartScreen({ open, onClose }: CartScreenProps) {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Fetch cart items from database
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user) {
        setCartItems([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const items = await CartAPI.getCart(user.id);
        
        // Transform database items to component format
        const transformedItems = items.map(item => ({
          id: item.id,
          name: item.product_name,
          brand: item.product_brand,
          price: item.price,
          originalPrice: item.original_price,
          image: item.product_image,
          quantity: item.quantity,
          inStock: item.in_stock,
          rating: item.rating,
          category: item.category
        }));
        
        setCartItems(transformedItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, [isAuthenticated, user]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    if (isAuthenticated && user) {
      // Update in database
      CartAPI.updateQuantity(user.id, id, newQuantity)
        .then(() => {
          setCartItems(items => 
            items.map(item => 
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
          );
        })
        .catch(error => {
          console.error('Error updating quantity:', error);
          toast.error('Failed to update quantity');
        });
    } else {
      // Just update local state for non-authenticated users
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    if (isAuthenticated && user) {
      // Remove from database
      CartAPI.removeFromCart(user.id, id)
        .then(() => {
          setCartItems(items => items.filter(item => item.id !== id));
          toast.success('Item removed from cart');
        })
        .catch(error => {
          console.error('Error removing item:', error);
          toast.error('Failed to remove item');
        });
    } else {
      // Just update local state for non-authenticated users
      setCartItems(items => items.filter(item => item.id !== id));
      toast.success('Item removed from cart');
    }
  };

  const moveToWishlist = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      removeItem(id);
      toast.success(`${item.name} moved to wishlist`);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo('SAVE10');
      toast.success('Promo code applied! 10% discount');
    } else {
      toast.error('Invalid promo code');
    }
    setPromoCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price;
    return sum + ((originalPrice - item.price) * item.quantity);
  }, 0);
  const promoDiscount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 50000 ? 0 : 299;
  const tax = Math.round((subtotal - promoDiscount) * 0.18);
  const total = subtotal - promoDiscount + shipping + tax;

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...', {
      description: 'You will be redirected to the payment page.'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-background border-border/50">
        <ProtectedRoute requireAuth={false}>
          <DialogHeader className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Shopping Cart</DialogTitle>
                <p className="text-sm text-muted-foreground">
                    : 'You haven&apos;t placed any orders yet'
                  {!isAuthenticated && ' (Guest)'}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 p-6">
              {loading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <AnimatePresence>
                    {cartItems.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                        <p className="text-muted-foreground mb-4">
                          Start shopping to add items to your cart
                          {!isAuthenticated && '. Sign in to save your cart across devices.'}
                        </p>
                        <Button onClick={onClose}>Continue Shopping</Button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                            className={`glass-card rounded-lg p-4 ${!item.inStock ? 'opacity-60' : ''}`}
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
                                <div className="flex items-start justify-between">
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
                                    
                                    {!item.inStock && (
                                      <Badge variant="destructive" className="text-xs mt-1">
                                        Out of Stock
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1 ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => moveToWishlist(item.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Heart className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(item.id)}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Price and Quantity */}
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                      ₹{item.price.toLocaleString()}
                                    </span>
                                    {item.originalPrice && (
                                      <span className="text-sm text-muted-foreground line-through">
                                        ₹{item.originalPrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1 || !item.inStock}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      disabled={!item.inStock}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
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

            {/* Order Summary - Right Side */}
            <div className="bg-muted/30 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                {/* Guest Notice */}
                {!isAuthenticated && (
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Sign in to save your cart and get personalized recommendations
                    </p>
                  </div>
                )}
                
                {/* Promo Code */}
                <div className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                    >
                      <Tag className="w-4 h-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                  
                  {appliedPromo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-green-600"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Promo code "{appliedPromo}" applied</span>
                    </motion.div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>You saved</span>
                      <span>-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Promo discount (10%)</span>
                      <span>-₹{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span>Free delivery on orders above ₹50,000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>1 year warranty included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>30-day easy returns</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || cartItems.some(item => !item.inStock)}
                  className="w-full h-12 text-base font-medium neon-glow"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Secure checkout with 256-bit SSL encryption
                </span>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      </DialogContent>
    </Dialog>
  );
}