import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, TrendingUp, ShoppingCart, ExternalLink, CheckCircle, AlertCircle, Heart, Loader2, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedRealtimeProduct } from '@/lib/realtime-products-enhanced';
import { ProductModal } from '../product/product-modal';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { AuthModal } from '../auth/auth-modal';
import { PaymentModal } from '../payment/payment-modal';
import { WishlistAPI, CartAPI } from '@/lib/database';

const getSentimentColor = (sentiment: string) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'text-green-500';
    case 'negative':
      return 'text-red-500';
    case 'neutral':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

interface ProductCarouselProps {
  products: EnhancedRealtimeProduct[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const { isAuthenticated, user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<EnhancedRealtimeProduct | null>(null);
  const [paymentProduct, setPaymentProduct] = useState<EnhancedRealtimeProduct | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const nextProduct = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= products.length ? 0 : prev + 3
    );
  };
  
  const prevProduct = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, products.length - 3) : prev - 3
    );
  };
  
  if (!products || products.length === 0) return null;

  const handleBuyNow = (product: EnhancedRealtimeProduct) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setPaymentProduct(product);
  };
  
  const handleAddToWishlist = async (product: EnhancedRealtimeProduct) => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // Add to wishlist in database
      await WishlistAPI.addToWishlist({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_brand: product.brand,
        product_image: product.image,
        current_price: product.price,
        original_price: product.originalPrice,
        category: product.category,
        rating: product.rating,
        review_count: product.reviewCount,
        in_stock: product.inStock,
        availability: product.availability,
        alert_enabled: false,
        source: product.source || 'ai_generated'
      });
      
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist`
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error instanceof Error && error.message?.includes('already in wishlist')) {
        toast.error('Product already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = async (product: EnhancedRealtimeProduct) => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // Add to cart in database
      await CartAPI.addToCart({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_brand: product.brand,
        product_image: product.image,
        price: product.price,
        original_price: product.originalPrice,
        quantity: 1,
        category: product.category,
        rating: product.rating,
        in_stock: product.inStock,
        source: product.source || 'ai_generated'
      });
      
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
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
                {product.source !== 'ai_generated' && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-medium">Live</span>
                    </div>
                  </div>
                )}
                
                {/* YouTube indicator */}
                {product.youtubeVideoId && (
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-600/90 rounded-full">
                      <Play className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-medium">YouTube</span>
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
                      handleBuyNow(product);
                    }}
                    disabled={!product.inStock || loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    {product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                    disabled={loading}
                  >
                    <Heart className="w-4 h-4" />
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
        onBuyNow={handleBuyNow}
      />

      <PaymentModal
        product={paymentProduct}
        open={!!paymentProduct}
        onClose={() => setPaymentProduct(null)}
      />
      
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </>
  );
}