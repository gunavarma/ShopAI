import { AIService } from './ai-service';
import { ScraperAPIService, ScrapedProduct } from './scraper-api';

export interface EnhancedRealtimeProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  brand: string;
  category: string;
  features: string[];
  pros: string[];
  cons: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  description: string;
  inStock: boolean;
  availability: string;
  specifications: Record<string, string>;
  youtubeVideoId?: string;
  reviewSummary: string;
  sampleReviews: Array<{
    rating: number;
    text: string;
    reviewer: string;
    date: string;
  }>;
  source: 'google_shopping' | 'amazon' | 'ai_generated';
  productUrl?: string;
  seller?: string;
  shipping?: string;
}

export class EnhancedRealtimeProductService {
  static async searchProducts(query: string, options: {
    useRealData?: boolean;
    maxResults?: number;
    minPrice?: number;
    maxPrice?: number;
    sources?: ('google_shopping' | 'amazon')[];
  } = {}): Promise<EnhancedRealtimeProduct[]> {
    const { useRealData = true, maxResults = 8 } = options;

    try {
      let scrapedProducts: ScrapedProduct[] = [];
      
      // First, try to get real product data if API key is available
      if (useRealData && process.env.NEXT_PUBLIC_SCRAPER_API_KEY) {
        console.log('Fetching real product data for:', query);
        scrapedProducts = await ScraperAPIService.searchMultipleSources(query, options);
      }

      // If we have real data, enhance it with AI
      if (scrapedProducts.length > 0) {
        console.log(`Found ${scrapedProducts.length} real products, enhancing with AI...`);
        return await this.enhanceScrapedProducts(scrapedProducts, query);
      }

      // Fallback to AI-generated products if no real data
      console.log('No real data available, generating AI products for:', query);
      return await this.generateAIProducts(query, maxResults);

    } catch (error) {
      console.error('Error in enhanced product search:', error);
      // Fallback to AI generation
      return await this.generateAIProducts(query, maxResults);
    }
  }

  private static async enhanceScrapedProducts(
    scrapedProducts: ScrapedProduct[],
    query: string
  ): Promise<EnhancedRealtimeProduct[]> {
    try {
      const enhancementPrompt = `
Enhance these real product listings with additional details for the search query: "${query}"

Real Products:
${scrapedProducts.map((p, i) => `
${i + 1}. ${p.title}
   - Price: ₹${p.price.toLocaleString()}
   - Rating: ${p.rating}/5 (${p.reviewCount} reviews)
   - Brand: ${p.brand}
   - Source: ${p.source}
   - URL: ${p.url}
`).join('\n')}

For each product, provide enhancements in this JSON format:
{
  "products": [
    {
      "index": 0,
      "category": "smartphone/laptop/headphones/etc",
      "features": ["feature1", "feature2", "feature3"],
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "sentiment": "positive/neutral/negative",
      "sentimentScore": 75,
      "reviewSummary": "Brief summary of user reviews",
      "specifications": {
        "key1": "value1",
        "key2": "value2"
      },
      "sampleReviews": [
        {
          "rating": 5,
          "text": "Great product, works perfectly!",
          "reviewer": "Rajesh K.",
          "date": "2024-01-15"
        }
      ],
      "youtubeVideoId": "dQw4w9WgXcQ"
    }
  ]
}

Guidelines:
- Use realistic features and specifications for each product
- Generate authentic-sounding Indian reviewer names
- Create realistic review text based on the product type
- Sentiment should reflect the rating (4.5+ = positive, 3.5-4.4 = neutral, <3.5 = negative)
- Include 2-3 sample reviews per product
- YouTube video IDs should be realistic (11 characters)

Return only valid JSON:
`;

      const response = await geminiService.generateResponse(enhancementPrompt);
      const response = await AIService.generateResponse(enhancementPrompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      let enhancements;
      try {
        enhancements = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Failed to parse enhancements:', parseError);
        return this.createBasicEnhancedProducts(scrapedProducts);
      }

      // Merge scraped data with AI enhancements
      const enhancedProducts: EnhancedRealtimeProduct[] = [];
      
      scrapedProducts.forEach((scraped, index) => {
        const enhancement = enhancements.products?.find((e: any) => e.index === index) || {};
        
        enhancedProducts.push({
          id: scraped.id,
          name: scraped.title,
          price: scraped.price,
          originalPrice: scraped.originalPrice,
          image: scraped.image || this.getProductImage(enhancement.category || 'product'),
          rating: scraped.rating,
          reviewCount: scraped.reviewCount,
          brand: scraped.brand || 'Unknown',
          category: enhancement.category || this.extractCategoryFromTitle(scraped.title),
          features: enhancement.features || [],
          pros: enhancement.pros || [],
          cons: enhancement.cons || [],
          sentiment: enhancement.sentiment || 'positive',
          sentimentScore: enhancement.sentimentScore || 75,
          description: scraped.description || scraped.title,
          inStock: scraped.availability !== 'Out of Stock',
          availability: scraped.availability,
          specifications: enhancement.specifications || {},
          youtubeVideoId: enhancement.youtubeVideoId,
          reviewSummary: enhancement.reviewSummary || 'Great product with positive user feedback.',
          sampleReviews: enhancement.sampleReviews || [],
          source: scraped.source,
          productUrl: scraped.url,
          seller: scraped.seller,
          shipping: scraped.shipping
        });
      });

      return enhancedProducts;

    } catch (error) {
      console.error('Error enhancing scraped products:', error);
      return this.createBasicEnhancedProducts(scrapedProducts);
    }
  }

  private static createBasicEnhancedProducts(scrapedProducts: ScrapedProduct[]): EnhancedRealtimeProduct[] {
    return scrapedProducts.map(scraped => ({
      id: scraped.id,
      name: scraped.title,
      price: scraped.price,
      originalPrice: scraped.originalPrice,
      image: scraped.image || this.getProductImage('product'),
      rating: scraped.rating,
      reviewCount: scraped.reviewCount,
      brand: scraped.brand || 'Unknown',
      category: this.extractCategoryFromTitle(scraped.title),
      features: [],
      pros: ['Good quality', 'Value for money'],
      cons: ['Limited availability'],
      sentiment: 'positive',
      sentimentScore: 75,
      description: scraped.description || scraped.title,
      inStock: scraped.availability !== 'Out of Stock',
      availability: scraped.availability,
      specifications: {},
      reviewSummary: 'Product has received positive feedback from users.',
      sampleReviews: [],
      source: scraped.source,
      productUrl: scraped.url,
      seller: scraped.seller,
      shipping: scraped.shipping
    }));
  }

  private static async generateAIProducts(query: string, maxResults: number): Promise<EnhancedRealtimeProduct[]> {
    try {
      const searchPrompt = `
Generate ${maxResults} realistic product listings for the search query: "${query}"

Create products that would actually exist in the Indian market with realistic pricing, features, and specifications.

Return JSON array with this exact format:
[
  {
    "name": "Exact product name with model/variant",
    "brand": "Brand name",
    "price": 25999,
    "originalPrice": 29999,
    "category": "smartphone/laptop/headphones/etc",
    "description": "Detailed product description",
    "features": ["feature1", "feature2", "feature3"],
    "pros": ["pro1", "pro2", "pro3"],
    "cons": ["con1", "con2"],
    "rating": 4.3,
    "reviewCount": 1247,
    "sentiment": "positive",
    "sentimentScore": 78,
    "specifications": {
      "key1": "value1",
      "key2": "value2"
    },
    "reviewSummary": "Summary of user reviews",
    "sampleReviews": [
      {
        "rating": 5,
        "text": "Excellent product!",
        "reviewer": "Amit S.",
        "date": "2024-01-15"
      }
    ],
    "youtubeVideoId": "dQw4w9WgXcQ",
    "inStock": true,
    "availability": "In Stock"
  }
]

Guidelines:
- Use realistic Indian market pricing
- Include current popular models and brands
- Generate authentic specifications
- Create realistic Indian reviewer names
- Include 2-3 sample reviews per product
- Ensure products are relevant to the search query

Return only valid JSON array:
`;

      const response = await geminiService.generateResponse(searchPrompt);
      const response = await AIService.generateResponse(searchPrompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      let productsData;
      try {
        productsData = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Failed to parse AI products:', parseError);
        return [];
      }

      if (!Array.isArray(productsData)) {
        console.error('Invalid AI products format');
        return [];
      }

      return productsData.map((product: any, index: number) => ({
        id: `ai_${Date.now()}_${index}`,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: this.getProductImage(product.category, product.name, product.brand),
        rating: product.rating || 4.0,
        reviewCount: product.reviewCount || 100,
        brand: product.brand,
        category: product.category,
        features: product.features || [],
        pros: product.pros || [],
        cons: product.cons || [],
        sentiment: product.sentiment || 'positive',
        sentimentScore: product.sentimentScore || 75,
        description: product.description,
        inStock: product.inStock !== false,
        availability: product.availability || 'In Stock',
        specifications: product.specifications || {},
        youtubeVideoId: product.youtubeVideoId,
        reviewSummary: product.reviewSummary || 'Great product with positive feedback.',
        sampleReviews: product.sampleReviews || [],
        source: 'ai_generated'
      }));

    } catch (error) {
      console.error('Error generating AI products:', error);
      return [];
    }
  }

  private static extractCategoryFromTitle(title: string): string {
    const lowercaseTitle = title.toLowerCase();
    
    const categoryMap: Record<string, string> = {
      'iphone': 'smartphone',
      'samsung galaxy': 'smartphone',
      'phone': 'smartphone',
      'mobile': 'smartphone',
      'macbook': 'laptop',
      'laptop': 'laptop',
      'computer': 'laptop',
      'headphones': 'headphones',
      'earphones': 'headphones',
      'earbuds': 'headphones',
      'watch': 'smartwatch',
      'shoes': 'shoes',
      'shirt': 'clothing',
      'bag': 'bag'
    };

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowercaseTitle.includes(keyword)) {
        return category;
      }
    }

    return 'product';
  }

  private static getProductImage(category: string, productName?: string, brand?: string): string {
    // Use the same image mapping logic from the original realtime-products.ts
    const imageMap: Record<string, string[]> = {
      'smartphone': [
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'laptop': [
        'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'headphones': [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'default': [
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    };

    const images = imageMap[category] || imageMap.default;
    return images[Math.floor(Math.random() * images.length)];
  }

  private static getStaticFallbackProducts(query: string, count: number): EnhancedRealtimeProduct[] {
    const fallbackProducts = [
      {
        id: 'fallback-1',
        name: 'Popular Product Option',
        price: 15999,
        originalPrice: 19999,
        image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.2,
        reviewCount: 150,
        brand: 'Popular Brand',
        category: 'electronics',
        features: ['High Quality', 'Good Value', 'Popular Choice'],
        pros: ['Reliable', 'Good price'],
        cons: ['Limited availability'],
        sentiment: 'positive',
        sentimentScore: 0.8,
        description: `Popular product matching your search for "${query}"`,
        inStock: true,
        availability: 'In Stock',
        specifications: {},
        youtubeVideoId: '',
        reviewSummary: 'Generally positive reviews',
        sampleReviews: [],
        source: 'ai_generated'
      },
      {
        id: 'fallback-2',
        name: 'Alternative Option',
        price: 12999,
        originalPrice: 15999,
        image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.0,
        reviewCount: 89,
        brand: 'Alternative Brand',
        category: 'electronics',
        features: ['Budget Friendly', 'Good Features', 'Reliable'],
        pros: ['Affordable', 'Good quality'],
        cons: ['Basic features'],
        sentiment: 'positive',
        sentimentScore: 0.7,
        description: `Alternative product option for "${query}"`,
        inStock: true,
        availability: 'In Stock',
        specifications: {},
        youtubeVideoId: '',
        reviewSummary: 'Good value for money',
        sampleReviews: [],
        source: 'ai_generated'
      }
    ];

    return fallbackProducts.slice(0, count);
  }

  static async getProductRecommendations(
    category: string,
    priceRange?: { min: number; max: number },
    features?: string[]
  ): Promise<EnhancedRealtimeProduct[]> {
    let query = `Find ${category} products`;
    let realProducts: EnhancedRealtimeProduct[] = [];
    let aiProducts: EnhancedRealtimeProduct[] = [];
    let remainingSlots = 6;
    
    try {
      const scraperResults = await ScraperAPIService.searchMultipleSources(query);
      realProducts = await this.enhanceScrapedProducts(scraperResults, query);
      remainingSlots = Math.max(0, 6 - realProducts.length);
    } catch (error) {
      console.log('Real-time data unavailable, using fallback data:', error);
      // Continue with AI-generated products as fallback
    }
    
    if (remainingSlots > 0) {
      try {
        aiProducts = await this.generateAIProducts(query, remainingSlots);
      } catch (error) {
        console.log('AI products unavailable, using static fallback:', error);
        // Use static fallback products
        aiProducts = this.getStaticFallbackProducts(query, remainingSlots);
      }
    }
    
    // Combine real and AI products
    const allProducts = [...realProducts, ...aiProducts];
    
    // Filter by price range if specified
    if (priceRange) {
      return allProducts.filter(product => 
        product.price >= (priceRange.min || 0) && 
        product.price <= (priceRange.max || Infinity)
      );
    }
    
    return allProducts;
  }
}