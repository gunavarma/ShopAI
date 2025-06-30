"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RealtimeProduct } from '@/lib/realtime-products';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/auth/auth-modal';

interface PaymentModalProps {
  product: RealtimeProduct | null;
  open: boolean;
  onClose: () => void;
}

export function PaymentModal({ product, open, onClose }: PaymentModalProps) {
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    address: '',
    city: '',
    pincode: ''
  });

  if (!product) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    toast.success('Payment successful! 🎉', {
      description: 'Your order has been placed successfully.'
    });

    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      email: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      name: '',
      address: '',
      city: '',
      pincode: ''
    });
    onClose();
  };

  const deliveryCharge = 99;
  const tax = Math.round(product.price * 0.18); // 18% GST
  const total = product.price + deliveryCharge + tax;

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="glass-card border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              Order Confirmed! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6 p-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Your {product.name} is on its way!
              </p>
            </div>
            
            <div className="glass-card rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-2">Order Details</h4>
              <div className="flex justify-between text-sm">
                <span>Product:</span>
                <span>{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-semibold">₹{total.toLocaleString()}</span>
              </div>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background border-border/50">
        <DialogHeader>
          <DialogTitle className="sr-only">Checkout</DialogTitle>
        </DialogHeader>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Checkout</h2>
              <p className="text-sm text-muted-foreground">Complete your purchase</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
          {/* Order Summary - Left Side */}
          <div className="lg:col-span-2 bg-muted/30 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Product Item */}
              <div className="flex gap-4 p-4 bg-background rounded-lg border border-border/50">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Qty: 1</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>₹{deliveryCharge}</span>
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

            {/* Security Badge */}
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Your payment information is secure
              </span>
            </div>
          </div>

          {/* Payment Form - Right Side */}
          <div className="lg:col-span-3 p-6 space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium">
                    Card number
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="pr-12"
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-sm font-medium">
                      Expiry date
                    </Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-sm font-medium">
                      CVC
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name on card
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing Address</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-sm font-medium">
                      Postal code
                    </Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="pt-4">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Lock className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Lock className="w-5 h-5 mr-2" />
                )}
                {isProcessing ? 'Processing Payment...' : `Complete Order • ₹${total.toLocaleString()}`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    <AuthModal
      open={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      defaultMode="login"
    />
    </>
  );
}