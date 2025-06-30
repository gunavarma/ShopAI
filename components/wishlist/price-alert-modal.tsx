"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, TrendingDown, Target, Percent } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

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
}

interface PriceAlertModalProps {
  open: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  onSave: (targetPrice: number, alertType: string) => void;
}

export function PriceAlertModal({ open, onClose, item, onSave }: PriceAlertModalProps) {
  const [alertType, setAlertType] = useState('drops-below');
  const [targetPrice, setTargetPrice] = useState('');
  const [percentageDiscount, setPercentageDiscount] = useState('10');

  if (!item) return null;

  const handleSave = () => {
    let finalTargetPrice: number;
    
    if (alertType === 'percentage') {
      const discount = parseFloat(percentageDiscount) / 100;
      finalTargetPrice = Math.round(item.currentPrice * (1 - discount));
    } else {
      finalTargetPrice = parseFloat(targetPrice);
    }
    
    if (finalTargetPrice && finalTargetPrice > 0) {
      onSave(finalTargetPrice, alertType === 'drops-below' ? 'drops below' : 'reaches');
    }
  };

  const isValid = () => {
    if (alertType === 'percentage') {
      const discount = parseFloat(percentageDiscount);
      return discount > 0 && discount <= 50;
    } else {
      const price = parseFloat(targetPrice);
      return price > 0 && price < item.currentPrice;
    }
  };

  const getEstimatedPrice = () => {
    if (alertType === 'percentage') {
      const discount = parseFloat(percentageDiscount) / 100;
      return Math.round(item.currentPrice * (1 - discount));
    }
    return parseFloat(targetPrice) || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="gradient-text">Set Price Alert</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              <Badge variant="secondary" className="text-xs mt-1">
                {item.brand}
              </Badge>
              <p className="text-lg font-semibold mt-1">
                ₹{item.currentPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Alert Type */}
          <div>
            <Label className="text-base font-medium">Alert Type</Label>
            <RadioGroup
              value={alertType}
              onValueChange={setAlertType}
              className="mt-3 space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                <RadioGroupItem value="drops-below" id="drops-below" />
                <div className="flex-1">
                  <Label htmlFor="drops-below" className="font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      Price drops below
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when price goes below a specific amount
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                <RadioGroupItem value="percentage" id="percentage" />
                <div className="flex-1">
                  <Label htmlFor="percentage" className="font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-blue-500" />
                      Percentage discount
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when price drops by a certain percentage
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Price Input */}
          <div>
            {alertType === 'drops-below' ? (
              <div>
                <Label htmlFor="target-price">Target Price (₹)</Label>
                <Input
                  id="target-price"
                  type="number"
                  placeholder="Enter target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current price: ₹{item.currentPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="percentage-discount">Discount Percentage (%)</Label>
                <Input
                  id="percentage-discount"
                  type="number"
                  placeholder="Enter percentage"
                  value={percentageDiscount}
                  onChange={(e) => setPercentageDiscount(e.target.value)}
                  min="1"
                  max="50"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Target price: ₹{getEstimatedPrice().toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Savings Preview */}
          {isValid() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Target className="w-4 h-4" />
                <span className="font-medium">Potential Savings</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                You&apos;ll save ₹{(item.currentPrice - getEstimatedPrice()).toLocaleString()} 
                ({(((item.currentPrice - getEstimatedPrice()) / item.currentPrice) * 100).toFixed(1)}% off)
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid()}
              className="flex-1 neon-glow"
            >
              <Bell className="w-4 h-4 mr-2" />
              Set Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}