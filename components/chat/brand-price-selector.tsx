"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrandOption {
  name: string;
  logo: string; // Using text/emoji for logos to match app style
  popular?: boolean;
}

interface PriceRange {
  label: string;
  value: string;
  range: string;
  popular?: boolean;
}

interface BrandPriceSelectorProps {
  category: string;
  onSelection: (brand: string, priceRange: string) => void;
  onSkip: () => void;
}

export function BrandPriceSelector({ category, onSelection, onSkip }: BrandPriceSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');

  // Category-specific brand options with simple text logos
  const getBrandOptions = (category: string): BrandOption[] => {
    const brandMap: Record<string, BrandOption[]> = {
      'clothing': [
        { name: 'Nike', logo: '✓', popular: true },
        { name: 'Adidas', logo: '⚡', popular: true },
        { name: 'Puma', logo: '🐾', popular: true },
        { name: 'Under Armour', logo: 'UA' },
        { name: 'Reebok', logo: 'RB' },
        { name: 'H&M', logo: 'H&M' },
        { name: 'Zara', logo: 'Z' },
        { name: 'Uniqlo', logo: 'U' }
      ],
      'shoes': [
        { name: 'Nike', logo: '✓', popular: true },
        { name: 'Adidas', logo: '⚡', popular: true },
        { name: 'Puma', logo: '🐾' },
        { name: 'New Balance', logo: 'NB' },
        { name: 'Asics', logo: 'A' },
        { name: 'Skechers', logo: 'S' },
        { name: 'Vans', logo: 'V' },
        { name: 'Converse', logo: '★' }
      ],
      'smartphone': [
        { name: 'Apple', logo: '🍎', popular: true },
        { name: 'Samsung', logo: 'S', popular: true },
        { name: 'OnePlus', logo: '1+', popular: true },
        { name: 'Xiaomi', logo: 'Mi' },
        { name: 'Realme', logo: 'R' },
        { name: 'Oppo', logo: 'O' },
        { name: 'Vivo', logo: 'V' },
        { name: 'Google', logo: 'G' }
      ],
      'laptop': [
        { name: 'Apple', logo: '🍎', popular: true },
        { name: 'Dell', logo: 'D', popular: true },
        { name: 'HP', logo: 'HP' },
        { name: 'Lenovo', logo: 'L' },
        { name: 'Asus', logo: 'A' },
        { name: 'Acer', logo: 'A' },
        { name: 'MSI', logo: 'M' },
        { name: 'Microsoft', logo: 'MS' }
      ],
      'headphones': [
        { name: 'Sony', logo: 'S', popular: true },
        { name: 'Bose', logo: 'B', popular: true },
        { name: 'Apple', logo: '🍎' },
        { name: 'JBL', logo: 'JBL' },
        { name: 'Sennheiser', logo: 'SE' },
        { name: 'Audio-Technica', logo: 'AT' },
        { name: 'Beats', logo: 'b' },
        { name: 'Skullcandy', logo: '💀' }
      ],
      'default': [
        { name: 'Apple', logo: '🍎', popular: true },
        { name: 'Samsung', logo: 'S', popular: true },
        { name: 'Sony', logo: 'S' },
        { name: 'LG', logo: 'LG' },
        { name: 'Nike', logo: '✓' },
        { name: 'Adidas', logo: '⚡' }
      ]
    };

    return brandMap[category.toLowerCase()] || brandMap.default;
  };

  const priceRanges: PriceRange[] = [
    { label: 'Budget', value: '0-10000', range: 'Under ₹10K', popular: true },
    { label: 'Mid-Range', value: '10000-25000', range: '₹10K - ₹25K', popular: true },
    { label: 'Premium', value: '25000-50000', range: '₹25K - ₹50K' },
    { label: 'Luxury', value: '50000-100000', range: '₹50K - ₹1L' },
    { label: 'Ultra Premium', value: '100000-999999', range: 'Above ₹1L' },
    { label: 'No Budget', value: 'all', range: 'Any Price' }
  ];

  const brands = getBrandOptions(category);

  const handleContinue = () => {
    if (selectedBrand && selectedPrice) {
      onSelection(selectedBrand, selectedPrice);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center mx-auto mb-3"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold gradient-text mb-2">
          Let's find your perfect {category}
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred brand and budget to get personalized recommendations
        </p>
      </div>

      {/* Brand Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="font-medium">Preferred Brand</h4>
          <Badge variant="secondary" className="text-xs">Optional</Badge>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brands.map((brand, index) => (
            <motion.button
              key={brand.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => setSelectedBrand(brand.name)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedBrand === brand.name
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              {/* Popular Badge */}
              {brand.popular && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                    Popular
                  </Badge>
                </div>
              )}

              {/* Brand Logo */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                  selectedBrand === brand.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {brand.logo}
                </div>
                <span className="text-sm font-medium">{brand.name}</span>
              </div>

              {/* Selection Indicator */}
              {selectedBrand === brand.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="font-medium">Budget Range</h4>
          <Badge variant="secondary" className="text-xs">Required</Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {priceRanges.map((price, index) => (
            <motion.button
              key={price.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => setSelectedPrice(price.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedPrice === price.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              {/* Popular Badge */}
              {price.popular && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
                    Popular
                  </Badge>
                </div>
              )}

              <div className="text-center">
                <div className="font-semibold text-sm mb-1">{price.label}</div>
                <div className="text-xs text-muted-foreground">{price.range}</div>
              </div>

              {/* Selection Indicator */}
              {selectedPrice === price.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onSkip}
          className="flex-1"
        >
          Skip & Browse All
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedPrice}
          className="flex-1 neon-glow"
        >
          Find Products
          {selectedBrand && selectedPrice && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2"
            >
              ✨
            </motion.span>
          )}
        </Button>
      </div>

      {/* Selection Summary */}
      {(selectedBrand || selectedPrice) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-muted/30 rounded-lg text-center"
        >
          <p className="text-sm text-muted-foreground">
            {selectedBrand && selectedPrice && (
              <>Looking for <span className="font-medium text-foreground">{selectedBrand}</span> products in <span className="font-medium text-foreground">{priceRanges.find(p => p.value === selectedPrice)?.range}</span> range</>
            )}
            {selectedBrand && !selectedPrice && (
              <>Selected <span className="font-medium text-foreground">{selectedBrand}</span> - Please choose a budget</>
            )}
            {!selectedBrand && selectedPrice && (
              <>Budget: <span className="font-medium text-foreground">{priceRanges.find(p => p.value === selectedPrice)?.range}</span> - Any brand</>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}