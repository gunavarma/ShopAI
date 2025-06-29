"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { geminiService } from '@/lib/gemini';

interface BrandOption {
  name: string;
  logo: string;
  popular?: boolean;
  description?: string;
}

interface PriceRange {
  label: string;
  value: string;
  range: string;
  popular?: boolean;
  description?: string;
}

interface BrandPriceSelectorProps {
  category: string;
  onSelection: (brand: string, priceRange: string) => void;
  onSkip: () => void;
}

export function BrandPriceSelector({ category, onSelection, onSkip }: BrandPriceSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    loadDynamicData();
  }, [category]);

  const loadDynamicData = async () => {
    setIsLoadingBrands(true);
    setIsLoadingPrices(true);
    setApiError('');
    
    try {
      // Load brands and price ranges in parallel
      await Promise.all([
        loadBrandsFromGemini(),
        loadPriceRangesFromGemini()
      ]);
    } catch (error) {
      console.error('Error loading dynamic data:', error);
      // Set fallback data
      setFallbackData();
    }
  };

  const loadBrandsFromGemini = async () => {
    try {
      const prompt = `
Generate 6-8 popular brands for "${category}" products in the Indian market.

Return ONLY a JSON array with this exact format:
[
  {
    "name": "Brand Name",
    "logo": "Single emoji or 2-3 letter abbreviation",
    "popular": true/false,
    "description": "Brief brand description"
  }
]

Requirements:
- Include mix of premium and affordable brands
- Mark 2-3 most popular brands with "popular": true
- Use appropriate emojis or abbreviations for logos (e.g., 🍎 for Apple, "S" for Samsung)
- Focus on brands actually available in India
- Include both international and Indian brands where relevant

Category: ${category}

Examples for different categories:
- Smartphones: Apple (🍎), Samsung (S), OnePlus (1+), Xiaomi (Mi), Realme (R)
- Laptops: Apple (🍎), Dell (D), HP (HP), Lenovo (L), Asus (A)
- Headphones: Sony (S), Bose (B), JBL (🎵), Apple (🍎), Boat (⛵)
- Clothing: Nike (✓), Adidas (⚡), Puma (🐾), H&M (H&M), Zara (Z)

Return only the JSON array:
`;

      const response = await geminiService.generateResponse(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const brandsData = JSON.parse(cleanResponse);
        if (Array.isArray(brandsData) && brandsData.length > 0) {
          setBrands(brandsData);
        } else {
          throw new Error('Invalid brands data format');
        }
      } catch (parseError) {
        console.error('Failed to parse brands data:', parseError);
        setFallbackBrands();
      }
    } catch (error: any) {
      console.error('Error loading brands from Gemini:', error);
      if (error.message?.includes('quota')) {
        setApiError('AI service temporarily unavailable. Using default options.');
      }
      setFallbackBrands();
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const loadPriceRangesFromGemini = async () => {
    try {
      const prompt = `
Generate 6 price ranges for "${category}" products in the Indian market with current 2024 pricing.

Return ONLY a JSON array with this exact format:
[
  {
    "label": "Range Name",
    "value": "min-max",
    "range": "₹X - ₹Y",
    "popular": true/false,
    "description": "What you get in this range"
  }
]

Requirements:
- Use realistic Indian market prices for ${category}
- Include "all" option for no budget limit
- Mark 2 most popular ranges with "popular": true
- Provide helpful descriptions for each range
- Use proper Indian Rupee formatting

Category: ${category}

Example price ranges by category:
- Smartphones: Budget (₹5K-15K), Mid-range (₹15K-30K), Premium (₹30K-60K), Flagship (₹60K+)
- Laptops: Basic (₹20K-40K), Performance (₹40K-80K), Gaming (₹80K-150K), Workstation (₹150K+)
- Headphones: Budget (₹500-2K), Good (₹2K-8K), Premium (₹8K-20K), Audiophile (₹20K+)

Return only the JSON array:
`;

      const response = await geminiService.generateResponse(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const pricesData = JSON.parse(cleanResponse);
        if (Array.isArray(pricesData) && pricesData.length > 0) {
          setPriceRanges(pricesData);
        } else {
          throw new Error('Invalid price ranges data format');
        }
      } catch (parseError) {
        console.error('Failed to parse price ranges data:', parseError);
        setFallbackPriceRanges();
      }
    } catch (error: any) {
      console.error('Error loading price ranges from Gemini:', error);
      if (error.message?.includes('quota')) {
        setApiError('AI service temporarily unavailable. Using default options.');
      }
      setFallbackPriceRanges();
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const setFallbackData = () => {
    setFallbackBrands();
    setFallbackPriceRanges();
  };

  const setFallbackBrands = () => {
    const fallbackBrands: BrandOption[] = [
      { name: 'Apple', logo: '🍎', popular: true, description: 'Premium quality' },
      { name: 'Samsung', logo: 'S', popular: true, description: 'Innovation leader' },
      { name: 'Sony', logo: 'S', popular: false, description: 'Audio excellence' },
      { name: 'LG', logo: 'LG', popular: false, description: 'Smart technology' },
      { name: 'Nike', logo: '✓', popular: true, description: 'Sports excellence' },
      { name: 'Adidas', logo: '⚡', popular: false, description: 'Performance gear' }
    ];
    setBrands(fallbackBrands);
    setIsLoadingBrands(false);
  };

  const setFallbackPriceRanges = () => {
    const fallbackPrices: PriceRange[] = [
      { label: 'Budget', value: '0-10000', range: 'Under ₹10K', popular: true, description: 'Great value options' },
      { label: 'Mid-Range', value: '10000-25000', range: '₹10K - ₹25K', popular: true, description: 'Best features for price' },
      { label: 'Premium', value: '25000-50000', range: '₹25K - ₹50K', popular: false, description: 'High-end features' },
      { label: 'Luxury', value: '50000-100000', range: '₹50K - ₹1L', popular: false, description: 'Top-tier products' },
      { label: 'Ultra Premium', value: '100000-999999', range: 'Above ₹1L', popular: false, description: 'Flagship models' },
      { label: 'No Budget', value: 'all', range: 'Any Price', popular: false, description: 'Show all options' }
    ];
    setPriceRanges(fallbackPrices);
    setIsLoadingPrices(false);
  };

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

      {/* API Error Notice */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700 dark:text-yellow-400">{apiError}</span>
        </motion.div>
      )}

      {/* Brand Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="font-medium">Preferred Brand</h4>
          <Badge variant="secondary" className="text-xs">Optional</Badge>
          {isLoadingBrands && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading brands...</span>
            </div>
          )}
        </div>
        
        {isLoadingBrands ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border-2 border-border/50 animate-pulse"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted"></div>
                  <div className="w-16 h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                  {brand.description && (
                    <span className="text-xs text-muted-foreground text-center">
                      {brand.description}
                    </span>
                  )}
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
        )}
      </div>

      {/* Price Range Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="font-medium">Budget Range</h4>
          <Badge variant="secondary" className="text-xs">Required</Badge>
          {isLoadingPrices && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading prices...</span>
            </div>
          )}
        </div>
        
        {isLoadingPrices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border-2 border-border/50 animate-pulse"
              >
                <div className="text-center">
                  <div className="w-20 h-4 bg-muted rounded mb-2 mx-auto"></div>
                  <div className="w-16 h-3 bg-muted rounded mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                  <div className="text-xs text-muted-foreground mb-1">{price.range}</div>
                  {price.description && (
                    <div className="text-xs text-muted-foreground/80">{price.description}</div>
                  )}
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
        )}
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
          disabled={!selectedPrice || isLoadingBrands || isLoadingPrices}
          className="flex-1 neon-glow"
        >
          {isLoadingBrands || isLoadingPrices ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
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
            </>
          )}
        </Button>
      </div>

      {/* Selection Summary */}
      {(selectedBrand || selectedPrice) && !isLoadingBrands && !isLoadingPrices && (
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

      {/* AI Powered Badge */}
      <div className="flex items-center justify-center gap-2 mt-4 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700 dark:text-blue-400">
          {apiError ? 'Using default options' : 'Brands and pricing powered by Gemini AI'}
        </span>
      </div>
    </motion.div>
  );
}