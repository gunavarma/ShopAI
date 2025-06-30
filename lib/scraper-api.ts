export interface ScrapedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  url: string;
  source: 'google_shopping' | 'amazon';
  brand?: string;
  availability: string;
  seller?: string;
  shipping?: string;
  description?: string;
  youtubeVideoId?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface ScraperAPIResponse {
  products: ScrapedProduct[];
  totalResults: number;
  searchQuery: string;
  source: string;
}

export class ScraperAPIService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_SCRAPER_API_KEY || '';
  private static readonly BASE_URL = 'http://api.scraperapi.com';

  private static buildScraperURL(targetURL: string, options: Record<string, any> = {}): string {
    const params = new URLSearchParams({
      api_key: this.API_KEY,
      url: targetURL,
      country_code: 'in', // India
      device_type: 'desktop',
      premium: 'true',
      session_number: Math.random().toString(36).substring(7),
      ...options
    });

    return `${this.BASE_URL}?${params.toString()}`;
  }

  static async searchGoogleShopping(query: string, options: {
    maxResults?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'relevance' | 'price_low_to_high' | 'price_high_to_low' | 'rating';
  } = {}): Promise<ScrapedProduct[]> {
    try {
      const { maxResults = 20, minPrice, maxPrice, sortBy = 'relevance' } = options;
      
      // Build Google Shopping URL
      let googleShoppingURL = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}&hl=en&gl=in`;
      
      if (minPrice) googleShoppingURL += `&tbs=p_ord:p,price:1,ppr_min:${minPrice}`;
      if (maxPrice) googleShoppingURL += `,ppr_max:${maxPrice}`;
      
      // Add sorting
      switch (sortBy) {
        case 'price_low_to_high':
          googleShoppingURL += '&tbs=p_ord:p';
          break;
        case 'price_high_to_low':
          googleShoppingURL += '&tbs=p_ord:pd';
          break;
        case 'rating':
          googleShoppingURL += '&tbs=p_ord:r';
          break;
      }

      const scraperURL = this.buildScraperURL(googleShoppingURL, {
        render: 'true',
        wait: 3000,
        premium: 'true'
      });

      console.log('Scraping Google Shopping:', query);
      
      const response = await fetch(scraperURL, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`ScraperAPI request failed: ${response.status}`);
      }

      const html = await response.text();
      return this.parseGoogleShoppingHTML(html, query);

    } catch (error) {
      console.error('Google Shopping scraping error:', error);
      return [];
    }
  }

  static async searchAmazon(query: string, options: {
    maxResults?: number;
    minPrice?: number;
    maxPrice?: number;
    department?: string;
  } = {}): Promise<ScrapedProduct[]> {
    try {
      const { maxResults = 20, minPrice, maxPrice, department } = options;
      
      // Build Amazon India URL
      let amazonURL = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&ref=sr_pg_1`;
      
      if (department) amazonURL += `&i=${department}`;
      if (minPrice) amazonURL += `&low-price=${minPrice}`;
      if (maxPrice) amazonURL += `&high-price=${maxPrice}`;

      const scraperURL = this.buildScraperURL(amazonURL, {
        render: 'true',
        wait: 3000,
        premium: 'true',
        session_number: Math.random().toString(36).substring(7)
      });

      console.log('Scraping Amazon:', query);

      const response = await fetch(scraperURL, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`ScraperAPI request failed: ${response.status}`);
      }

      const html = await response.text();
      return this.parseAmazonHTML(html, query);

    } catch (error) {
      console.error('Amazon scraping error:', error);
      return [];
    }
  }

  private static parseGoogleShoppingHTML(html: string, query: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    try {
      // Enhanced mock products with real product images based on query
      const productImages = this.getProductImages(query);
      const youtubeIds = this.getYoutubeVideoIds(query);
      
      const mockProducts = [
        {
          id: `google_${Date.now()}_1`,
          title: this.generateProductTitle(query, 1),
          price: Math.floor(Math.random() * 50000) + 5000,
          originalPrice: Math.floor(Math.random() * 60000) + 55000,
          currency: 'INR',
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 1000) + 100,
          image: productImages[0],
          url: 'https://shopping.google.com',
          source: 'google_shopping' as const,
          availability: 'In Stock',
          brand: this.extractBrand(query),
          description: this.generateProductDescription(query, 1),
          youtubeVideoId: youtubeIds[0]
        },
        {
          id: `google_${Date.now()}_2`,
          title: this.generateProductTitle(query, 2),
          price: Math.floor(Math.random() * 50000) + 5000,
          originalPrice: Math.floor(Math.random() * 60000) + 55000,
          currency: 'INR',
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 1000) + 100,
          image: productImages[1],
          url: 'https://shopping.google.com',
          source: 'google_shopping' as const,
          availability: 'In Stock',
          brand: this.extractBrand(query),
          description: this.generateProductDescription(query, 2),
          youtubeVideoId: youtubeIds[1]
        },
        {
          id: `google_${Date.now()}_3`,
          title: this.generateProductTitle(query, 3),
          price: Math.floor(Math.random() * 50000) + 5000,
          originalPrice: Math.floor(Math.random() * 60000) + 55000,
          currency: 'INR',
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 1000) + 100,
          image: productImages[2],
          url: 'https://shopping.google.com',
          source: 'google_shopping' as const,
          availability: 'In Stock',
          brand: this.extractBrand(query),
          description: this.generateProductDescription(query, 3),
          youtubeVideoId: youtubeIds[2]
        }
      ];
      
      products.push(...mockProducts);
      
    } catch (error) {
      console.error('Error parsing Google Shopping HTML:', error);
    }
    
    return products.slice(0, 20); // Limit results
  }

  private static parseAmazonHTML(html: string, query: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    try {
      // Enhanced mock products with real product images based on query
      const productImages = this.getProductImages(query);
      const youtubeIds = this.getYoutubeVideoIds(query);
      
      const mockProducts = [
        {
          id: `amazon_${Date.now()}_1`,
          title: this.generateProductTitle(query, 1, 'Amazon'),
          price: Math.floor(Math.random() * 50000) + 5000,
          originalPrice: Math.floor(Math.random() * 60000) + 55000,
          currency: 'INR',
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 1000) + 100,
          image: productImages[3] || productImages[0],
          url: 'https://amazon.in',
          source: 'amazon' as const,
          availability: 'In Stock',
          brand: this.extractBrand(query),
          description: this.generateProductDescription(query, 1, 'Amazon'),
          youtubeVideoId: youtubeIds[3] || youtubeIds[0]
        },
        {
          id: `amazon_${Date.now()}_2`,
          title: this.generateProductTitle(query, 2, 'Amazon'),
          price: Math.floor(Math.random() * 50000) + 5000,
          originalPrice: Math.floor(Math.random() * 60000) + 55000,
          currency: 'INR',
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 1000) + 100,
          image: productImages[4] || productImages[1],
          url: 'https://amazon.in',
          source: 'amazon' as const,
          availability: 'In Stock',
          brand: this.extractBrand(query),
          description: this.generateProductDescription(query, 2, 'Amazon'),
          youtubeVideoId: youtubeIds[4] || youtubeIds[1]
        },
        {
          id: `amazon_${Date.now()}_3`,
          title: this.generateProductTitle(query, 3, 'Amazon'),
          price: Math.floor(Math.random() * 50000) + 5000,
          originalPrice: Math.floor(Math.random() * 60000) + 55000,
          currency: 'INR',
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 1000) + 100,
          image: productImages[5] || productImages[2],
          url: 'https://amazon.in',
          source: 'amazon' as const,
          availability: 'In Stock',
          brand: this.extractBrand(query),
          description: this.generateProductDescription(query, 3, 'Amazon'),
          youtubeVideoId: youtubeIds[5] || youtubeIds[2]
        }
      ];
      
      products.push(...mockProducts);
      
    } catch (error) {
      console.error('Error parsing Amazon HTML:', error);
    }
    
    return products.slice(0, 20); // Limit results
  }

  private static getYoutubeVideoIds(query: string): string[] {
    // Common YouTube video IDs for popular product categories
    const videoMap: Record<string, string[]> = {
      'iphone': [
        'FT3ODSg1GFE', // iPhone 15 Pro Review
        '0s4csSZjX0Y', // iPhone 15 Pro Max Review
        'xqCpLGZDbTQ', // iPhone 15 Review
        'n5HYG_UCFgE', // iPhone 15 vs iPhone 14
        'LXwn4nH0wKc', // iPhone 15 Pro Max vs Samsung S24 Ultra
        'TaUQIxWUCrI'  // iPhone 15 Camera Test
      ],
      'smartphone': [
        'FT3ODSg1GFE', // iPhone 15 Pro Review
        'LXwn4nH0wKc', // iPhone 15 Pro Max vs Samsung S24 Ultra
        'Lz_Cjn9INaU', // Samsung Galaxy S24 Ultra Review
        'TaUQIxWUCrI', // iPhone 15 Camera Test
        'Ux7K9lNn_zU', // OnePlus 12 Review
        'Ux7K9lNn_zU'  // OnePlus 12 Review
      ],
      'laptop': [
        'Ky_OV9sSXX8', // MacBook Pro M3 Review
        'I_ZpUU4zTWk', // MacBook Air M3 Review
        'rDMUPUGzC0Q', // Dell XPS 13 Review
        'Jf5kkDqHsKQ', // Asus ROG Zephyrus G14 Review
        'I_ZpUU4zTWk', // MacBook Air M3 Review
        'rDMUPUGzC0Q'  // Dell XPS 13 Review
      ],
      'headphones': [
        'GAfiN-TwKAI', // Sony WH-1000XM5 Review
        'bJTSxRBbCQA', // AirPods Pro 2 Review
        'GAfiN-TwKAI', // Sony WH-1000XM5 Review
        'bJTSxRBbCQA', // AirPods Pro 2 Review
        'GAfiN-TwKAI', // Sony WH-1000XM5 Review
        'bJTSxRBbCQA'  // AirPods Pro 2 Review
      ],
      'watch': [
        'MIQdJkoTh48', // Apple Watch Series 9 Review
        'MIQdJkoTh48', // Apple Watch Series 9 Review
        'MIQdJkoTh48', // Apple Watch Series 9 Review
        'MIQdJkoTh48', // Apple Watch Series 9 Review
        'MIQdJkoTh48', // Apple Watch Series 9 Review
        'MIQdJkoTh48'  // Apple Watch Series 9 Review
      ],
      'shoes': [
        'Br0ZYRYeFhQ', // Nike Air Max Review
        'Br0ZYRYeFhQ', // Nike Air Max Review
        'Br0ZYRYeFhQ', // Nike Air Max Review
        'Br0ZYRYeFhQ', // Nike Air Max Review
        'Br0ZYRYeFhQ', // Nike Air Max Review
        'Br0ZYRYeFhQ'  // Nike Air Max Review
      ],
      'camera': [
        'Loi851BJWU4', // Sony Alpha Review
        'Loi851BJWU4', // Sony Alpha Review
        'Loi851BJWU4', // Sony Alpha Review
        'Loi851BJWU4', // Sony Alpha Review
        'Loi851BJWU4', // Sony Alpha Review
        'Loi851BJWU4'  // Sony Alpha Review
      ],
      'monitor': [
        'uNIqIrKGLm0', // LG UltraGear Review
        'uNIqIrKGLm0', // LG UltraGear Review
        'uNIqIrKGLm0', // LG UltraGear Review
        'uNIqIrKGLm0', // LG UltraGear Review
        'uNIqIrKGLm0', // LG UltraGear Review
        'uNIqIrKGLm0'  // LG UltraGear Review
      ]
    };
    
    const lowerQuery = query.toLowerCase();
    
    // Find matching category
    for (const [category, videos] of Object.entries(videoMap)) {
      if (lowerQuery.includes(category)) {
        return videos;
      }
    }
    
    // Default videos
    return videoMap.smartphone;
  }

  private static getProductImages(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    
    // Comprehensive image mapping based on product categories
    const imageMap: Record<string, string[]> = {
      // Electronics
      'iphone': [
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'smartphone': [
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'laptop': [
        'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1006293/pexels-photo-1006293.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'headphones': [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649772/pexels-photo-1649772.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3394652/pexels-photo-3394652.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649773/pexels-photo-1649773.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'watch': [
        'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697215/pexels-photo-1697215.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697216/pexels-photo-1697216.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697217/pexels-photo-1697217.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'shoes': [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1456707/pexels-photo-1456707.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'camera': [
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'monitor': [
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    };
    
    // Find matching category
    for (const [category, images] of Object.entries(imageMap)) {
      if (lowerQuery.includes(category)) {
        return images;
      }
    }
    
    // Default to smartphone images
    return imageMap.smartphone;
  }

  private static generateProductTitle(query: string, index: number, source?: string): string {
    const brands = ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo'];
    const models = ['Pro', 'Max', 'Ultra', 'Plus', 'Lite', 'SE', 'Air', 'Mini'];
    const colors = ['Black', 'White', 'Blue', 'Red', 'Silver', 'Gold', 'Green', 'Purple'];
    
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return `${brand} ${query} ${model} ${color} - ${source || 'Latest'} Model ${index}`;
  }

  private static generateProductDescription(query: string, index: number, source?: string): string {
    const features = [
      'High-quality build',
      'Latest technology',
      'Premium design',
      'Long-lasting battery',
      'Fast performance',
      'Excellent camera',
      'Stunning display',
      'Water resistant'
    ];
    
    const randomFeatures = features.slice(0, 3 + Math.floor(Math.random() * 3));
    return `Premium ${query} with ${randomFeatures.join(', ')}. Perfect for daily use. ${source ? `Available on ${source}` : 'Best price guaranteed'}.`;
  }

  private static extractPrice(priceText: string): number {
    // Extract price from various formats: ₹1,234, Rs. 1234, $12.34, etc.
    const cleanPrice = priceText.replace(/[^\d.,]/g, '');
    const price = parseFloat(cleanPrice.replace(/,/g, ''));
    return isNaN(price) ? 0 : price;
  }

  private static extractRating(ratingText: string): { rating: number; reviewCount: number } {
    const ratingMatch = ratingText.match(/(\d+\.?\d*)\s*out\s*of\s*5|(\d+\.?\d*)\s*stars?/i);
    const reviewMatch = ratingText.match(/(\d+(?:,\d+)*)\s*reviews?/i);
    
    return {
      rating: ratingMatch ? parseFloat(ratingMatch[1] || ratingMatch[2]) : 4.0,
      reviewCount: reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 100
    };
  }

  private static extractReviewCount(reviewText: string): number {
    const match = reviewText.match(/(\d+(?:,\d+)*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }

  private static extractBrand(title: string): string {
    // Common brand patterns
    const brands = [
      'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
      'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer',
      'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour',
      'Bose', 'JBL', 'Boat', 'Sennheiser', 'Audio-Technica'
    ];
    
    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    
    // Extract first word as potential brand
    const firstWord = title.split(' ')[0];
    return firstWord.length > 1 ? firstWord : 'Unknown';
  }

  static async searchMultipleSources(
    query: string,
    options: {
      sources?: ('google_shopping' | 'amazon')[];
      maxResults?: number;
      minPrice?: number;
      maxPrice?: number;
    } = {}
  ): Promise<ScrapedProduct[]> {
    const { sources = ['google_shopping', 'amazon'], maxResults = 40 } = options;
    const allProducts: ScrapedProduct[] = [];

    try {
      const searchPromises: Promise<ScrapedProduct[]>[] = [];

      if (sources.includes('google_shopping')) {
        searchPromises.push(this.searchGoogleShopping(query, options));
      }

      if (sources.includes('amazon')) {
        searchPromises.push(this.searchAmazon(query, options));
      }

      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allProducts.push(...result.value);
        } else {
          console.error('Search failed:', result.reason);
        }
      });

      // Remove duplicates and sort by relevance
      const uniqueProducts = this.removeDuplicates(allProducts);
      const sortedProducts = this.sortByRelevance(uniqueProducts, query);
      
      return sortedProducts.slice(0, maxResults);

    } catch (error) {
      console.error('Multi-source search error:', error);
      return [];
    }
  }

  private static removeDuplicates(products: ScrapedProduct[]): ScrapedProduct[] {
    const seen = new Set<string>();
    return products.filter(product => {
      const key = `${product.title.toLowerCase()}_${product.price}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private static sortByRelevance(products: ScrapedProduct[], query: string): ScrapedProduct[] {
    const queryWords = query.toLowerCase().split(' ');
    
    return products.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, queryWords);
      const bScore = this.calculateRelevanceScore(b, queryWords);
      return bScore - aScore;
    });
  }

  private static calculateRelevanceScore(product: ScrapedProduct, queryWords: string[]): number {
    const title = product.title.toLowerCase();
    let score = 0;

    // Exact query match
    if (title.includes(queryWords.join(' '))) {
      score += 100;
    }

    // Individual word matches
    queryWords.forEach(word => {
      if (title.includes(word)) {
        score += 10;
      }
    });

    // Rating bonus
    score += product.rating * 2;

    // Review count bonus (logarithmic)
    score += Math.log10(product.reviewCount + 1);

    return score;
  }

  static async getProductDetails(productUrl: string): Promise<any> {
    try {
      const scraperURL = this.buildScraperURL(productUrl, {
        render: 'true',
        wait: 5000,
        premium: 'true'
      });

      const response = await fetch(scraperURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status}`);
      }

      const html = await response.text();
      
      // Parse detailed product information
      // This would include specifications, detailed description, more images, etc.
      return this.parseProductDetails(html, productUrl);

    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  }

  private static parseProductDetails(html: string, url: string): any {
    // Implementation for parsing detailed product information
    // This would extract specifications, features, detailed descriptions, etc.
    return {
      url,
      specifications: {},
      features: [],
      detailedDescription: '',
      images: [],
      availability: 'In Stock'
    };
  }
}