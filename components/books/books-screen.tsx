"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Book, 
  Search, 
  Filter, 
  Star, 
  Heart,
  ShoppingCart,
  BookOpen,
  User,
  Calendar,
  Tag,
  TrendingUp,
  Award,
  Clock,
  Download
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { WishlistAPI, CartAPI } from '@/lib/database';

interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  genre: string;
  pages: number;
  publishYear: number;
  publisher: string;
  format: 'paperback' | 'hardcover' | 'ebook' | 'audiobook';
  description: string;
  bestseller: boolean;
  newRelease: boolean;
  inStock: boolean;
  language: string;
}

interface BooksScreenProps {
  open: boolean;
  onClose: () => void;
}

export function BooksScreen({ open, onClose }: BooksScreenProps) {
  const { isAuthenticated, user } = useAuth();
  const [books] = useState<BookItem[]>([
    {
      id: '1',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      price: 399,
      originalPrice: 499,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviewCount: 2847,
      category: 'finance',
      genre: 'Personal Finance',
      pages: 256,
      publishYear: 2020,
      publisher: 'Jaico Publishing',
      format: 'paperback',
      description: 'Timeless lessons on wealth, greed, and happiness from one of the most important financial writers of our time.',
      bestseller: true,
      newRelease: false,
      inStock: true,
      language: 'English'
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 450,
      originalPrice: 550,
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviewCount: 5234,
      category: 'self-help',
      genre: 'Self-Help',
      pages: 320,
      publishYear: 2018,
      publisher: 'Random House',
      format: 'paperback',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Transform your life with tiny changes.',
      bestseller: true,
      newRelease: false,
      inStock: true,
      language: 'English'
    },
    {
      id: '3',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      price: 299,
      originalPrice: 350,
      image: 'https://images.pexels.com/photos/159740/pexels-photo-159740.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviewCount: 8932,
      category: 'fiction',
      genre: 'Fiction',
      pages: 208,
      publishYear: 1988,
      publisher: 'HarperCollins',
      format: 'paperback',
      description: 'A magical story about following your dreams and listening to your heart.',
      bestseller: true,
      newRelease: false,
      inStock: true,
      language: 'English'
    },
    {
      id: '4',
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      price: 199,
      originalPrice: 299,
      image: 'https://images.pexels.com/photos/256542/pexels-photo-256542.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviewCount: 3421,
      category: 'business',
      genre: 'Business',
      pages: 384,
      publishYear: 1937,
      publisher: 'Penguin Random House',
      format: 'paperback',
      description: 'The classic guide to achieving success and wealth through positive thinking.',
      bestseller: false,
      newRelease: false,
      inStock: true,
      language: 'English'
    },
    {
      id: '5',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      price: 599,
      originalPrice: 699,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviewCount: 4567,
      category: 'history',
      genre: 'History',
      pages: 512,
      publishYear: 2011,
      publisher: 'Vintage Books',
      format: 'hardcover',
      description: 'A fascinating exploration of how Homo sapiens came to dominate the world.',
      bestseller: true,
      newRelease: false,
      inStock: true,
      language: 'English'
    },
    {
      id: '6',
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      price: 350,
      originalPrice: 450,
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviewCount: 2134,
      category: 'spirituality',
      genre: 'Spirituality',
      pages: 236,
      publishYear: 1997,
      publisher: 'New World Library',
      format: 'paperback',
      description: 'A guide to spiritual enlightenment and living in the present moment.',
      bestseller: false,
      newRelease: false,
      inStock: true,
      language: 'English'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(false);

  const categories = ['all', 'fiction', 'self-help', 'business', 'finance', 'history', 'spirituality'];
  const formats = ['all', 'paperback', 'hardcover', 'ebook', 'audiobook'];

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all' || book.format === selectedFormat;
      return matchesSearch && matchesCategory && matchesFormat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.publishYear - a.publishYear;
        case 'popularity':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });

  const addToWishlist = (bookId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    
    if (!user) return;
    
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    setLoading(true);
    
    // Add to wishlist in database
    const wishlistItem = {
      user_id: user.id,
      product_id: book.id,
      product_name: book.title,
      product_brand: book.author,
      product_image: book.image,
      current_price: book.price,
      original_price: book.originalPrice,
      category: book.genre.toLowerCase(),
      rating: book.rating,
      review_count: book.reviewCount,
      in_stock: book.inStock,
      availability: book.inStock ? 'In Stock' : 'Out of Stock',
      alert_enabled: false,
      source: 'ai_generated'
    };
    
    WishlistAPI.addToWishlist(wishlistItem)
      .then(() => {
        toast.success('Added to wishlist', {
          description: `${book.title} has been added to your wishlist`
        });
      })
      .catch(error => {
        console.error('Error adding to wishlist:', error);
        if (error.message?.includes('already in wishlist')) {
          toast.error('Book already in wishlist');
        } else {
          toast.error('Failed to add to wishlist');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addToCart = (bookId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    
    if (!user) return;
    
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    setLoading(true);
    
    // Add to cart in database
    const cartItem = {
      user_id: user.id,
      product_id: book.id,
      product_name: book.title,
      product_brand: book.author,
      product_image: book.image,
      price: book.price,
      original_price: book.originalPrice,
      quantity: 1,
      category: book.genre.toLowerCase(),
      rating: book.rating,
      in_stock: book.inStock,
      source: 'ai_generated'
    };
    
    CartAPI.addToCart(cartItem)
      .then(() => {
        toast.success('Added to cart', {
          description: `${book.title} has been added to your cart`
        });
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add to cart');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const bestsellers = books.filter(book => book.bestseller);
  const newReleases = books.filter(book => book.newRelease);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-background border-border/50">
        <DialogHeader className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Book className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Books & Literature</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Discover your next great read from our curated collection
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1">
          <div className="border-b border-border/50 px-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="browse">Browse Books</TabsTrigger>
              <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
            </TabsList>
          </div>

          {/* Browse Books Tab */}
          <TabsContent value="browse" className="flex-1 m-0">
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books, authors, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map(format => (
                      <SelectItem key={format} value={format}>
                        {format === 'all' ? 'All Formats' : format.charAt(0).toUpperCase() + format.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Books Grid */}
              <ScrollArea className="h-[500px]">
                <AnimatePresence>
                  {filteredBooks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No books found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filters
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredBooks.map((book, index) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass-card rounded-lg p-4 hover:neon-glow transition-all duration-300"
                        >
                          {/* Book Cover */}
                          <div className="relative aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {book.bestseller && (
                                <Badge className="bg-amber-500 text-white text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  Bestseller
                                </Badge>
                              )}
                              {book.newRelease && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  New
                                </Badge>
                              )}
                            </div>

                            {/* Format Badge */}
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="text-xs">
                                {book.format}
                              </Badge>
                            </div>

                            {/* Wishlist Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                              onClick={() => addToWishlist(book.id)}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Book Details */}
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {book.title}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <User className="w-3 h-3" />
                                <span>{book.author}</span>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{book.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({book.reviewCount.toLocaleString()})
                              </span>
                            </div>

                            {/* Genre and Year */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Tag className="w-3 h-3" />
                              <span>{book.genre}</span>
                              <span>•</span>
                              <Calendar className="w-3 h-3" />
                              <span>{book.publishYear}</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">
                                ₹{book.price}
                              </span>
                              {book.originalPrice && book.originalPrice !== book.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{book.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => addToCart(book.id)}
                                disabled={loading || !book.inStock}
                                className="flex-1"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                {book.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                              {book.format === 'ebook' && (
                                <Button variant="outline" size="sm">
                                  <Download className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Bestsellers Tab */}
          <TabsContent value="bestsellers" className="flex-1 m-0">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Current Bestsellers</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestsellers.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          by {book.author}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{book.rating}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">₹{book.price}</span>
                          <Button size="sm" onClick={() => addToCart(book.id)}>
                            <ShoppingCart className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* New Releases Tab */}
          <TabsContent value="new" className="flex-1 m-0">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">New Releases</h3>
              </div>
              
              {newReleases.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No new releases</h3>
                  <p className="text-muted-foreground">
                    Check back soon for the latest books
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newReleases.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-lg p-4"
                    >
                      {/* Similar structure to bestsellers */}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}