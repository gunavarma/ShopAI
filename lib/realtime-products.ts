import { geminiService } from './gemini';

export interface RealtimeProduct {
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
}

export class RealtimeProductService {
  private static getProductImage(category: string, productName?: string, brand?: string): string {
    const lowerCategory = category.toLowerCase();
    const lowerProductName = productName?.toLowerCase() || '';
    const lowerBrand = brand?.toLowerCase() || '';
    
    // Comprehensive image mapping for all product categories
    const imageMap: Record<string, string[]> = {
      // Electronics
      'monitor': [
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'laptop': [
        'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'smartphone': [
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'headphones': [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'smartwatch': [
        'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'tablet': [
        'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'keyboard': [
        'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'mouse': [
        'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'camera': [
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'speaker': [
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Fashion & Clothing
      'clothing': [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'shoes': [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'bag': [
        'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'watch': [
        'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Home & Kitchen
      'furniture': [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'appliance': [
        'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4686823/pexels-photo-4686823.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'kitchen': [
        'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Sports & Fitness
      'fitness': [
        'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'sports': [
        'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Beauty & Personal Care
      'beauty': [
        'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'skincare': [
        'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Books & Media
      'book': [
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Toys & Games
      'toy': [
        'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'game': [
        'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Automotive
      'automotive': [
        'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'car': [
        'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    };
    
    // Find matching category
    let selectedImages: string[] = [];
    
    // Check for exact matches first
    if (imageMap[lowerCategory]) {
      selectedImages = imageMap[lowerCategory];
    } else {
      // Check for partial matches in category name
      for (const [key, images] of Object.entries(imageMap)) {
        if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
          selectedImages = images;
          break;
        }
      }
    }
    
    // Check product name for additional context
    if (selectedImages.length === 0) {
      for (const [key, images] of Object.entries(imageMap)) {
        if (lowerProductName.includes(key) || key.includes(lowerProductName)) {
          selectedImages = images;
          break;
        }
      }
    }
    
    // Default fallback
    if (selectedImages.length === 0) {
      selectedImages = imageMap.monitor; // Default to monitor images
    }
    
    // Return a random image from the selected category
    return selectedImages[Math.floor(Math.random() * selectedImages.length)];
  }

  private static async generateProductData(productInfo: any): Promise<RealtimeProduct> {
    // Generate a unique ID based on product name and brand
    const id = `${productInfo.brand}-${productInfo.name}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    return {
      id,
      name: productInfo.name,
      price: productInfo.price,
      originalPrice: productInfo.originalPrice,
      image: this.getProductImage(productInfo.category, productInfo.name, productInfo.brand),
      rating: productInfo.rating || 4.0,
      reviewCount: productInfo.reviewCount || 100,
      brand: productInfo.brand,
      category: productInfo.category,
      features: productInfo.features || [],
      pros: productInfo.pros || [],
      cons: productInfo.cons || [],
      sentiment: productInfo.sentiment || 'positive',
      sentimentScore: productInfo.sentimentScore || 75,
      description: productInfo.description,
      inStock: productInfo.inStock !== false,
      availability: productInfo.availability || 'In Stock',
      specifications: productInfo.specifications || {}
    };
  }

  static async searchProducts(query: string): Promise<RealtimeProduct[]> {
    try {
      // Analyze the query to understand what the user is specifically looking for
      const analysisPrompt = `
Analyze this search query and determine the exact intent: "${query}"

Extract:
1. Specific product type (e.g., "apple watch" -> smartwatch, "iphone" -> smartphone)
2. Brand preference (e.g., "apple", "samsung", "nike")
3. Category (electronics, fashion, home, beauty, sports, books, toys, automotive)
4. Price range if mentioned
5. Specific features or requirements

Return JSON with:
{
  "productType": "specific product type",
  "brand": "brand if specified",
  "category": "main category",
  "priceRange": {"min": number, "max": number} or null,
  "features": ["feature1", "feature2"],
  "intent": "specific_brand" | "category_search" | "general_search"
}
`;

      const analysisResponse = await geminiService.generateResponse(analysisPrompt);
      let analysis;
      
      try {
        const cleanAnalysis = analysisResponse.replace(/```json\n?|\n?```/g, '').trim();
        analysis = JSON.parse(cleanAnalysis);
      } catch (parseError) {
        console.error('Analysis parse error:', parseError);
        analysis = { intent: 'general_search', category: 'electronics' };
      }

      // Create a targeted search prompt based on analysis
      const searchPrompt = `
You are a precise product search engine. Based on this analysis:
Query: "${query}"
Analysis: ${JSON.stringify(analysis)}

CRITICAL REQUIREMENTS:
- If user searches for "apple watch", show ONLY Apple Watch products
- If user searches for "iphone", show ONLY iPhone products  
- If user searches for specific brand, prioritize that brand heavily
- Return exactly 6-8 highly relevant products
- Focus on EXACT matches first, then similar products
- Use realistic Indian market pricing
- Include proper product specifications

${analysis.intent === 'specific_brand' ? `
BRAND-SPECIFIC SEARCH: User wants "${analysis.brand}" products specifically.
- 80% of results should be from "${analysis.brand}"
- Include current popular models
- Use accurate model names and specifications
` : ''}

${analysis.intent === 'category_search' ? `
CATEGORY SEARCH: User wants "${analysis.category}" products.
- Show diverse brands within this category
- Include budget to premium options
- Focus on popular and highly-rated products
` : ''}

Product Requirements:
- name: Exact product name with model/variant
- brand: Correct brand name
- price: Realistic current Indian market price
- category: Specific category (${analysis.category})
- description: Detailed, accurate description
- features: Real product features and specifications
- pros/cons: Realistic based on actual reviews
- rating: 3.8-4.7 range
- reviewCount: 100-3000 range
- specifications: Detailed technical specs

Return only JSON array without markdown:
`;

      const response = await geminiService.generateResponse(searchPrompt);
      
      // Clean and parse response
      let cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      // Extract JSON array more carefully
      const firstBracket = cleanResponse.indexOf('[');
      const lastBracket = cleanResponse.lastIndexOf(']');
      
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        cleanResponse = cleanResponse.substring(firstBracket, lastBracket + 1);
      }
      
      let productsData;
      try {
        productsData = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('JSON Parse Error for query:', query);
        console.error('Parse Error:', parseError);
        console.error('Response preview:', cleanResponse.substring(0, 200));
        
        // Try alternative parsing
        const jsonMatch = response.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          try {
            productsData = JSON.parse(jsonMatch[0]);
          } catch (secondError) {
            console.error('Second parse failed:', secondError);
            return [];
          }
        } else {
          return [];
        }
      }

      // Validate and process products
      if (!Array.isArray(productsData)) {
        console.error('Invalid response format for query:', query);
        return [];
      }

      // Convert to RealtimeProduct format
      const products = await Promise.all(
        productsData.slice(0, 8).map(async (productInfo: any) => {
          try {
            // Validate essential fields
            if (!productInfo.name || !productInfo.brand || typeof productInfo.price !== 'number') {
              console.warn('Skipping invalid product:', productInfo);
              return null;
            }
            
            return await this.generateProductData(productInfo);
          } catch (error) {
            console.error('Error processing product:', error);
            return null;
          }
        })
      );

      // Filter valid products
      const validProducts = products.filter((product): product is RealtimeProduct => product !== null);
      
      console.log(`Found ${validProducts.length} products for "${query}"`);
      
      // If we have specific brand search but no results, try fallback
      if (validProducts.length === 0 && analysis.brand) {
        console.log(`No results for brand "${analysis.brand}", trying category fallback`);
        return await this.searchProducts(analysis.category || 'electronics');
      }
      
      return validProducts;

    } catch (error) {
      console.error('Search error for query:', query, error);
      throw new Error(`Failed to search for "${query}"`);
    }
  }

  static async getProductRecommendations(
    category: string, 
    priceRange?: { min: number; max: number },
    features?: string[]
  ): Promise<RealtimeProduct[]> {
    try {
      let query = `Find ${category} products`;
      
      if (priceRange) {
        const hasValidMin = typeof priceRange.min === 'number' && !isNaN(priceRange.min);
        const hasValidMax = typeof priceRange.max === 'number' && !isNaN(priceRange.max);
        
        if (hasValidMin && hasValidMax) {
          query += ` between ₹${priceRange.min.toLocaleString()} and ₹${priceRange.max.toLocaleString()}`;
        } else if (hasValidMin) {
          query += ` above ₹${priceRange.min.toLocaleString()}`;
        } else if (hasValidMax) {
          query += ` under ₹${priceRange.max.toLocaleString()}`;
        }
      }
      
      if (features && features.length > 0) {
        query += ` with features: ${features.join(', ')}`;
      }

      return await this.searchProducts(query);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  static async getProductComparison(productNames: string[]): Promise<{
    products: RealtimeProduct[];
    comparison: string;
  }> {
    try {
      const searchPromises = productNames.map(name => this.searchProducts(name));
      const searchResults = await Promise.all(searchPromises);
      
      // Get the first product from each search
      const products = searchResults.map(results => results[0]).filter(Boolean);
      
      if (products.length < 2) {
        throw new Error('Not enough products found for comparison');
      }

      const comparison = await geminiService.generateProductComparison(products);
      
      return { products, comparison };
    } catch (error) {
      console.error('Error comparing products:', error);
      throw new Error('Failed to compare products');
    }
  }

  static async getProductDetails(productName: string): Promise<RealtimeProduct | null> {
    try {
      const products = await this.searchProducts(productName);
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }
}