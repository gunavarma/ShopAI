import { Badge } from '@/components/ui/badge';
import { RealtimeProduct } from '@/lib/realtime-products';
import { ProductModal } from '../product/product-modal';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { AuthModal } from '../auth/auth-modal';
import { PaymentModal } from '../payment/payment-modal';
import { WishlistAPI, CartAPI } from '@/lib/database';

interface ProductCarouselProps {
  products: RealtimeProduct[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const { isAuthenticated, user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<RealtimeProduct | null>(null);
  const [paymentProduct, setPaymentProduct] = useState<RealtimeProduct | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  if (!products || products.length === 0) return null;

  const handleBuyNow = (product: RealtimeProduct) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setPaymentProduct(product);
  };
  
  const handleAddToWishlist = async (product: RealtimeProduct) => {
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
        source: (product as any).source || 'ai_generated'
      });
      
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist`
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.message?.includes('already in wishlist')) {
        toast.error('Product already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = async (product: RealtimeProduct) => {
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
        source: (product as any).source || 'ai_generated'
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
                  <Button
                    size="sm"
                    className="flex-1 neon-glow"
                    onClick={async (e) => {
                      e.stopPropagation();
                      handleBuyNow(product);
                    }}
                    disabled={loading || !product.inStock}
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
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleAddToWishlist(product);
                    }}
                    disabled={loading}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
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