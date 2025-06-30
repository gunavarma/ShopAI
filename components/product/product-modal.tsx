"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Play, User, Calendar, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RealtimeProduct } from '@/lib/realtime-products';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { AuthModal } from '@/components/auth/auth-modal';
import { WishlistAPI, CartAPI } from '@/lib/database';
import { geminiService } from '@/lib/gemini';

interface ProductModalProps {
  product: RealtimeProduct | null;
  open: boolean;
  onClose: () => void;
  onBuyNow: (product: RealtimeProduct) => void;
}

export function ProductModal({ product, open, onClose, onBuyNow }: ProductModalProps) {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedImages, setRelatedImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && open) {
      loadRelatedImages();
    }
  }, [product, open, loadRelatedImages]);

  const loadRelatedImages = async () => {
    if (!product) return;
    
    setIsLoadingImages(true);
    try {
      const images = await geminiService.getRelatedProductImages(
        product.name,
        product.category,
        product.brand
      );
      setRelatedImages([product.image, ...images.slice(0, 3)]); // Include main image + 3 related
      setSelectedImageIndex(0);
    } catch (error) {
      console.error('Error loading related images:', error);
      setRelatedImages([product.image]); // Fallback to main image only
    } finally {
      setIsLoadingImages(false);
    }
  };

  if (!product) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positive';
      case 'negative': return 'Negative';
      default: return 'Neutral';
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % relatedImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + relatedImages.length) % relatedImages.length);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (product) {
      onBuyNow(product);
    }
  };
  
  const handleAddToWishlist = async () => {
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

  const currentImage = relatedImages[selectedImageIndex] || product.image;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="glass-card border-primary/30 max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {product.name} - Product Details
            </DialogTitle>
          </DialogHeader>
          
          {/* Scrollable Content */}
          <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Images and Video */}
              <div className="space-y-4">
                {/* Main Image Display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-muted group shadow-lg"
                >
                  <img
                    src={currentImage}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = product.image || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  
                  {/* Source and Live indicators */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-black/80 text-white border-none backdrop-blur-sm"
                    >
                      {(product as any).source === 'google_shopping' ? 'Google Shopping' : 
                       (product as any).source === 'amazon' ? 'Amazon India' : 'AI Enhanced'}
                    </Badge>
                    
                    {(product as any).source !== 'ai_generated' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 rounded-full backdrop-blur-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs text-white font-medium">Real-time Data</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Image Navigation */}
                  {relatedImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {relatedImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs">
                      {selectedImageIndex + 1} / {relatedImages.length}
                    </div>
                  )}
                </motion.div>

                {/* Image Thumbnails */}
                {relatedImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {relatedImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index 
                            ? 'border-primary' 
                            : 'border-border/50 hover:border-border'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* YouTube Video */}
                {product.youtubeVideoId && product.youtubeVideoId.length > 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold">Product Review Video</h4>
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={`https://www.youtube.com/embed/${product.youtubeVideoId}`}
                        title={`${product.name} Review`}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  </motion.div>
                )}
                
                {/* Real-time indicator */}
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 dark:text-green-400">
                    {isLoadingImages ? 'Loading related images...' : 'AI-generated related images'}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddToWishlist}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Availability Status */}
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.inStock 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {product.availability}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Key Features</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="justify-start">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Review Sentiment</h4>
                    <TrendingUp className={`w-5 h-5 ${getSentimentColor(product.sentiment)}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{getSentimentLabel(product.sentiment)}</span>
                      <span>{product.sentimentScore}%</span>
                    </div>
                    <Progress value={product.sentimentScore} className="h-2" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 neon-glow"
                    onClick={handleBuyNow}
                    disabled={!product.inStock || loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleAddToWishlist}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Add to Wishlist</>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="px-6 pb-6">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="reviews">Reviews & Analysis</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
                  <TabsTrigger value="user-reviews">User Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="reviews" className="space-y-4 mt-6">
                  <div className="glass-card rounded-lg p-6">
                    <h5 className="font-semibold mb-3">AI Review Summary</h5>
                    <p className="text-muted-foreground mb-4">{product.reviewSummary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-card rounded-lg p-4">
                        <h5 className="font-semibold text-green-600 mb-3">Pros</h5>
                        <ul className="space-y-2">
                          {product.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-green-500 mt-1">•</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="glass-card rounded-lg p-4">
                        <h5 className="font-semibold text-red-600 mb-3">Cons</h5>
                        <ul className="space-y-2">
                          {product.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-red-500 mt-1">•</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="user-reviews" className="mt-6">
                  <div className="glass-card rounded-lg p-6">
                    <h5 className="font-semibold mb-4">Recent User Reviews</h5>
                    <div className="space-y-4">
                      {product.sampleReviews.map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-border/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{review.reviewer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="specs" className="mt-6">
                  <div className="glass-card rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold mb-2">Brand</h5>
                        <p className="text-muted-foreground">{product.brand}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Category</h5>
                        <p className="text-muted-foreground capitalize">
                          {product.category}
                        </p>
                      </div>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <h5 className="font-semibold mb-2 capitalize">{key}</h5>
                          <p className="text-muted-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="realtime" className="mt-6">
                  <div className="glass-card rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <h5 className="font-semibold text-green-600">Live Product Data</h5>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        This product information, reviews, and related images are fetched in real-time using Gemini AI to provide you with the most current data and visual context available.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Data Source:</span>
                          <p className="text-muted-foreground">{(product as any).source === 'ai_generated' ? 'Gemini AI' : 'Live Shopping Data'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Images:</span>
                          <p className="text-muted-foreground">AI-curated from Pexels</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <p className="text-muted-foreground">{(product as any).source === 'ai_generated' ? 'AI Generated' : 'Live Data'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Related Images:</span>
                          <p className="text-muted-foreground">{relatedImages.length} images</p>
                        </div>
                        <div>
                          <span className="font-medium">Reviews:</span>
                          <p className="text-muted-foreground">{product.sampleReviews.length} sample reviews</p>
                        </div>
                        <div>
                          <span className="font-medium">Video Review:</span>
                          <p className="text-muted-foreground">
                            {product.youtubeVideoId ? 'Available' : 'Not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
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