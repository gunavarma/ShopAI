"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, ShoppingCart, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RealtimeProduct } from '@/lib/realtime-products';
import { ProductModal } from '../product/product-modal';
import { PaymentModal } from '../payment/payment-modal';

interface ProductCarouselProps {
  products: RealtimeProduct[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<RealtimeProduct | null>(null);
  const [paymentProduct, setPaymentProduct] = useState<RealtimeProduct | null>(null);
  
  if (!products || products.length === 0) return null;

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.6
        }}
        className="glass-card rounded-xl p-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <h3 className="font-semibold text-lg">Product Results</h3>
          {products.length > 1 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevProduct}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextProduct}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(currentIndex, currentIndex + 3).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15,
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="glass-card rounded-lg p-4 hover:neon-glow transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="aspect-square mb-3 rounded-lg overflow-hidden bg-muted relative group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                
                {/* Image overlay with source indicator */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-black/70 text-white border-none"
                  >
                    {product.source === 'google_shopping' ? 'Google Shopping' : 
                     product.source === 'amazon' ? 'Amazon' : 'AI Generated'}
                  </Badge>
                </div>
                
                {/* Real-time indicator */}
                {(product as any).source !== 'ai_generated' && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-medium">Live</span>
                    </div>
                  </div>
                )}
              </motion.div>
              
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className="flex items-center justify-between"
                >
                  <Badge variant="secondary" className="text-xs">
                    {product.brand}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                </motion.div>
                
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                  className="font-medium text-sm line-clamp-2"
                >
                  {product.name}
                </motion.h4>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <TrendingUp className={`w-4 h-4 ${getSentimentColor(product.sentiment)}`} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.6 }}
                  className="flex items-center justify-between text-xs"
                >
                  <span className={`px-2 py-1 rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {product.availability}
                  </span>
                  <span className="text-muted-foreground">
                    {product.reviewCount.toLocaleString()} reviews
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.7 }}
                  className="flex gap-2"
                >
                  <Button
                    size="sm"
                    className="flex-1 neon-glow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPaymentProduct(product);
                    }}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-4 gap-2"
          >
            {Array.from({ length: Math.ceil(products.length / 3) }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(i * 3)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / 3) === i ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(product) => {
          setSelectedProduct(null);
          setPaymentProduct(product);
        }}
      />

      <PaymentModal
        product={paymentProduct}
        open={!!paymentProduct}
        onClose={() => setPaymentProduct(null)}
      />
    </>
  );
}