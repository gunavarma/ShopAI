import { geminiService } from './gemini';
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
  source: 'google_shopping' | 'amazon' | 'ai_generated' | 'flipkart' | 'croma' | 'reliance' | 'direct';
  productUrl?: string;
  seller?: string;
  shipping?: string;
}

interface FreeSearchProduct {
  title: string;
  price: number;
  image: string;
  url: string;
  source: 'flipkart' | 'croma' | 'reliance';
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
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
      // If the query is a direct URL, scrape it for real product details
      if (/^https?:\/\//i.test(query.trim())) {
        const detail = await this.fetchDetailsFromUrl(query.trim());
        if (detail) {
          const firstImage = Array.isArray(detail.images) ? detail.images[0] : undefined;
          return [
            {
              id: `url_${Date.now()}`,
              name: detail.title || query,
              price: typeof detail.price === 'number' ? detail.price : 0,
              originalPrice: undefined,
              image: firstImage || this.getProductImage('product'),
              rating: detail.rating || 0,
              reviewCount: detail.reviewCount || 0,
              brand: detail.brand || 'Unknown',
              category: this.extractCategoryFromTitle(detail.title || ''),
              features: Object.entries(detail.specs || {})
                .slice(0, 5)
                .map(([key, value]) => `${key}: ${value}`),
              pros: [],
              cons: [],
              sentiment:
                detail.rating && detail.rating < 3
                  ? 'negative'
                  : detail.rating && detail.rating < 4
                  ? 'neutral'
                  : 'positive',
              sentimentScore: detail.rating
                ? Math.min(100, Math.round((detail.rating / 5) * 100))
                : 75,
              description: detail.description || detail.title || '',
              inStock: !detail.availability
                ? true
                : !detail.availability.toLowerCase().includes('outofstock'),
              availability: detail.availability || 'In Stock',
              specifications: detail.specs || {},
              youtubeVideoId: undefined,
              reviewSummary:
                (detail.sampleReviews && detail.sampleReviews[0]?.text) ||
                detail.description ||
                'Product details fetched from source.',
              sampleReviews:
                detail.sampleReviews?.map((rev: any) => ({
                  rating: typeof rev.rating === 'number' ? rev.rating : 0,
                  text: rev.text || '',
                  reviewer: rev.reviewer || '',
                  date: rev.date || '',
                })) || [],
              source: 'direct',
              productUrl: query,
              seller: detail.seller,
              shipping: undefined,
            }
          ];
        }
      }

      let scrapedProducts: ScrapedProduct[] = [];
      
      // First, try to get real product data if API key is available
      if (useRealData) {
        if (process.env.NEXT_PUBLIC_SCRAPER_API_KEY) {
          console.log('Fetching real product data (paid) for:', query);
          scrapedProducts = await this.fetchFromAPI(query, options);
        } else {
          console.log('Fetching real product data (free) for:', query);
          const free = await this.fetchFromFreeSearch(query, options.maxResults || 8);
          if (free.length > 0) {
            const enriched = await Promise.all(
              free.map(async (p: FreeSearchProduct, idx: number) => {
                const detail = await this.fetchDetailsFromUrl(p.url);
                const detailImages = detail?.images || [];
                const image =
                  (Array.isArray(detailImages) && detailImages[0]) ||
                  p.image ||
                  this.getProductImage('product');
                const price =
                  typeof detail?.price === 'number' ? detail.price : p.price;
                const specs: Record<string, string> = detail?.specs || {};
                const rating =
                  typeof detail?.rating === 'number'
                    ? detail.rating
                    : typeof p.rating === 'number'
                    ? p.rating
                    : 0;
                const reviewCount =
                  typeof detail?.reviewCount === 'number'
                    ? detail.reviewCount
                    : typeof p.reviewCount === 'number'
                    ? p.reviewCount
                    : 0;
                const availability = detail?.availability || p.availability || 'In Stock';
                const name = detail?.title || p.title;
                const brand = detail?.brand || p.brand || 'Unknown';
                const description = detail?.description || p.title;
                const sampleReviews =
                  detail?.sampleReviews?.map((rev: any) => ({
                    rating: typeof rev.rating === 'number' ? rev.rating : 0,
                    text: rev.text || '',
                    reviewer: rev.reviewer || '',
                    date: rev.date || '',
                  })) || [];
                const reviewSummary =
                  sampleReviews[0]?.text ||
                  description ||
                  `Product from ${p.source}`;
                const sentiment =
                  rating < 3 ? 'negative' : rating < 4 ? 'neutral' : 'positive';
                const sentimentScore = rating
                  ? Math.min(100, Math.round((rating / 5) * 100))
                  : 75;

                return {
                  id: `${p.source}_${idx}_${Date.now()}`,
                  name,
                  price,
                  originalPrice: undefined,
                  image,
                  rating,
                  reviewCount,
                  brand,
                  category: this.extractCategoryFromTitle(name),
                  features: Object.entries(specs)
                    .slice(0, 5)
                    .map(([key, value]) => `${key}: ${value}`),
                  pros: [],
                  cons: [],
                  sentiment,
                  sentimentScore,
                  description,
                  inStock: !availability.toLowerCase().includes('outofstock'),
                  availability,
                  specifications: specs,
                  youtubeVideoId: undefined,
                  reviewSummary,
                  sampleReviews,
                  source: p.source,
                  productUrl: p.url,
                  seller: detail?.seller,
                  shipping: undefined,
                } as EnhancedRealtimeProduct;
              })
            );
            return enriched;
          }
        }
      }

      // If we have real data, enhance it with AI
      if (scrapedProducts.length > 0) {
        console.log(`Found ${scrapedProducts.length} real products, enhancing with AI...`);
        return await this.enhanceScrapedProducts(scrapedProducts, query);
      }

      // If user requested real data, do NOT fallback to AI
      if (useRealData) {
        console.log('No real data available; returning empty results to avoid AI-generated content.');
        return [];
      }
      // Otherwise, allow AI fallback when explicitly desired
      console.log('No real data available, generating AI products for:', query);
      return await this.generateAIProducts(query, maxResults);

    } catch (error) {
      console.error('Error in enhanced product search:', error);
      // Fallback to AI generation
      return await this.generateAIProducts(query, maxResults);
    }
  }

  private static async fetchFromAPI(query: string, options: any): Promise<ScrapedProduct[]> {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          options
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.products || [];
    } catch (error) {
      console.error('Error fetching from API:', error);
      return [];
    }
  }

  private static async fetchFromFreeSearch(query: string, maxResults: number): Promise<FreeSearchProduct[]> {
    try {
      const response = await fetch('/api/search-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxResults })
      });
      if (!response.ok) return [];
      const data = await response.json();
      const products = (data.products || []) as FreeSearchProduct[];
      return products.filter(
        (p) => p && typeof p.title === 'string' && typeof p.url === 'string'
      );
    } catch {
      return [];
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
          image: scraped.image && scraped.image !== '' ? scraped.image : this.getProductImage(enhancement.category || 'product', scraped.title),
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
          youtubeVideoId: scraped.youtubeVideoId || enhancement.youtubeVideoId,
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

  private static async fetchDetailsFromUrl(url: string): Promise<any | null> {
    try {
      const response = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      if (!response.ok) return null;
      const json = await response.json();
      return json?.data || null;
    } catch {
      return null;
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

  static async getProductRecommendations(
    category: string,
    priceRange?: { min: number; max: number },
    features?: string[]
  ): Promise<EnhancedRealtimeProduct[]> {
    let query = `Find ${category} products`;
    
    if (priceRange) {
      query += ` between ₹${priceRange.min.toLocaleString()} and ₹${priceRange.max.toLocaleString()}`;
    }
    
    if (features && features.length > 0) {
      query += ` with features: ${features.join(', ')}`;
    }

    return await this.searchProducts(query, {
      useRealData: true,
      maxResults: 8,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max
    });
  }
}