import { RealtimeProduct, RealtimeProductService } from './realtime-products';
import { geminiService } from './gemini';
import { ShoppingAssistantService, ShoppingAssistantResponse } from './shopping-assistant';

export interface AIResponse {
  message: string;
  products?: RealtimeProduct[];
  suggestedActions?: string[];
  requiresQuiz?: boolean;
  structuredRecommendations?: ShoppingAssistantResponse;
  clarifyingQuestions?: string[];
  brandSuggestions?: string[];
  needsMoreInfo?: boolean;
  category?: string;
}

export class AIAssistant {
  private static async analyzeQueryIntent(query: string): Promise<{
    isSpecific: boolean;
    category?: string;
    hasPrice?: boolean;
    hasBrand?: boolean;
    hasSize?: boolean;
    hasColor?: boolean;
    needsClarification: boolean;
    missingInfo: string[];
  }> {
    try {
      const analysisPrompt = `
Analyze this shopping query to determine if it needs clarification:
Query: "${query}"

Determine:
1. isSpecific: Is this a specific product search (like "iPhone 15 Pro") or general (like "gym shirt")?
2. category: What product category is this?
3. hasPrice: Does the query mention a price range?
4. hasBrand: Does the query mention a specific brand?
5. hasSize: Does the query mention size (for clothing/shoes)?
6. hasColor: Does the query mention color preference?
7. needsClarification: Should we ask clarifying questions before showing products?
8. missingInfo: Array of missing information that would help narrow down results

Examples:
- "gym shirt" → isSpecific: false, needsClarification: true, missingInfo: ["brand", "price", "size"]
- "iPhone 15 Pro 256GB" → isSpecific: true, needsClarification: false
- "running shoes under 5000" → isSpecific: false, needsClarification: true, missingInfo: ["brand", "size"]
- "Nike Air Max size 9" → isSpecific: true, needsClarification: false

For general queries like "gym shirt", "running shoes", "laptop", etc., set needsClarification: true
For specific product names or when brand + model is mentioned, set needsClarification: false

Return only valid JSON:
`;

      const response = await geminiService.generateResponse(analysisPrompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        return JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Failed to parse intent analysis:', parseError);
        return { 
          isSpecific: false, 
          needsClarification: true, 
          missingInfo: ['brand', 'price'] 
        };
      }
    } catch (error) {
      console.error('Error analyzing query intent:', error);
      return { 
        isSpecific: false, 
        needsClarification: true, 
        missingInfo: ['brand', 'price'] 
      };
    }
  }

  private static async generateConversationalResponse(
    query: string,
    category: string
  ): Promise<string> {
    try {
      const responsePrompt = `
Generate a helpful, conversational response for this shopping query:
Query: "${query}"
Category: "${category}"

The user made a general request, so we need to show them a brand and price selection interface.

Create a response that:
1. Acknowledges their request enthusiastically
2. Explains that you can help them find the perfect product
3. Mentions that you'll show them popular brands and price options to choose from
4. Keeps it conversational and helpful (like a friendly store assistant)
5. Keep it under 50 words

Return only the response text without quotes or formatting:
`;

      return await geminiService.generateResponse(responsePrompt);
    } catch (error) {
      console.error('Error generating conversational response:', error);
      return `I'd love to help you find the perfect ${category}! Let me show you some popular brands and price options to choose from.`;
    }
  }

  static async processQuery(query: string): Promise<AIResponse> {
    const lowercaseQuery = query.toLowerCase();
    
    // Handle greetings
    if (lowercaseQuery.includes('hello') || lowercaseQuery.includes('hi') || lowercaseQuery.includes('hey')) {
      return {
        message: "Hello! I'm ShopWhiz, your AI shopping assistant powered by Gemini AI. I can help you find any product across all categories - just like Amazon! Whether you're looking for specific brands like Apple, Samsung, Nike, or browsing categories like electronics, fashion, home essentials - I'll find exactly what you need. What are you looking for today?",
        suggestedActions: ['Apple Watch', 'Samsung Galaxy', 'Nike shoes', 'Gaming laptops', 'Kitchen appliances', 'Beauty products']
      };
    }

    // Handle help requests
    if (lowercaseQuery.includes('help me choose') || lowercaseQuery.includes('recommendations')) {
      return {
        message: "I'd love to help you find the perfect product! Let me ask you a few quick questions to understand your needs better and provide personalized recommendations.",
        requiresQuiz: true,
        suggestedActions: ['Start quiz', 'Browse categories', 'Show popular products']
      };
    }

    try {
      // Analyze the query intent
      const intent = await this.analyzeQueryIntent(query);
      
      // If the query is too general, show brand/price selection
      if (intent.needsClarification && !intent.isSpecific) {
        const conversationalResponse = await this.generateConversationalResponse(
          query,
          intent.category || 'product'
        );

        return {
          message: conversationalResponse,
          needsMoreInfo: true,
          category: intent.category || this.extractCategoryFromQuery(query),
          suggestedActions: ['Browse all products', 'Help me choose', 'Show popular items']
        };
      }

      // If specific enough, proceed with product search
      let products: RealtimeProduct[] = [];
      let message: string;
      let structuredRecommendations: ShoppingAssistantResponse | undefined;

      products = await RealtimeProductService.searchProducts(query);

      // Get structured recommendations using the shopping assistant
      if (products.length > 0) {
        structuredRecommendations = await ShoppingAssistantService.analyzeAndRecommend(query, products);
        
        if (structuredRecommendations.success) {
          message = structuredRecommendations.summary;
        } else {
          message = structuredRecommendations.summary;
        }
      } else {
        message = `I couldn't find any products matching "${query}". This might be because:
• The specific product model isn't available
• Try using different keywords or brand names
• Check spelling of product names

Would you like me to show you popular products in this category instead?`;
      }

      return {
        message,
        products: products.slice(0, 6),
        suggestedActions: this.getSuggestedActions(products, query, intent),
        structuredRecommendations
      };

    } catch (error) {
      console.error('Error processing query:', error);
      
      return {
        message: `I encountered an error while searching for "${query}". This could be due to:
• Network connectivity issues
• API rate limits
• Temporary service unavailability

Please try again in a moment, or try a different search query.`,
        products: [],
        suggestedActions: ['Try again', 'Show popular products', 'Help me choose', 'Browse categories']
      };
    }
  }

  private static extractCategoryFromQuery(query: string): string {
    const lowercaseQuery = query.toLowerCase();
    
    // Category mapping
    const categoryMap: Record<string, string> = {
      'shirt': 'clothing',
      'tshirt': 'clothing',
      't-shirt': 'clothing',
      'gym': 'clothing',
      'workout': 'clothing',
      'shoes': 'shoes',
      'sneakers': 'shoes',
      'running': 'shoes',
      'phone': 'smartphone',
      'mobile': 'smartphone',
      'iphone': 'smartphone',
      'samsung': 'smartphone',
      'laptop': 'laptop',
      'computer': 'laptop',
      'macbook': 'laptop',
      'headphones': 'headphones',
      'earphones': 'headphones',
      'earbuds': 'headphones',
      'watch': 'smartwatch',
      'smartwatch': 'smartwatch',
      'bag': 'bag',
      'backpack': 'bag',
      'furniture': 'furniture',
      'chair': 'furniture',
      'table': 'furniture',
      'kitchen': 'kitchen',
      'appliance': 'appliance',
      'fitness': 'fitness',
      'gym': 'fitness',
      'beauty': 'beauty',
      'makeup': 'beauty',
      'skincare': 'beauty',
      'book': 'book',
      'novel': 'book',
      'toy': 'toy',
      'game': 'toy',
      'car': 'automotive',
      'automotive': 'automotive'
    };

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowercaseQuery.includes(keyword)) {
        return category;
      }
    }

    return 'product'; // Default category
  }

  private static getSuggestedActions(products: RealtimeProduct[], query: string, analysis: any): string[] {
    const lowercaseQuery = query.toLowerCase();
    
    if (products.length === 0) {
      return ['Show popular products', 'Help me choose', 'Try different search', 'Browse categories'];
    }
    
    if (analysis.isSpecific && analysis.hasBrand) {
      return [
        `More ${analysis.brand} products`,
        'Compare with other brands',
        'Show similar products',
        'Check specifications'
      ];
    }
    
    if (products.length === 1) {
      return ['Find similar products', 'Compare with others', 'Tell me more', 'Check availability'];
    }

    if (lowercaseQuery.includes('compare')) {
      return ['Show detailed comparison', 'Help me decide', 'Show more options'];
    }

    return ['Compare these products', 'Show more details', 'Filter by price', 'Help me choose'];
  }

  static async processBrandPriceSelection(
    brand: string,
    priceRange: string,
    category: string
  ): Promise<AIResponse> {
    try {
      // Build search query based on selection
      let searchQuery = '';
      
      if (brand !== 'any') {
        searchQuery += `${brand} `;
      }
      
      searchQuery += category;
      
      // Add price range to query if not 'all'
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max && max < 999999) {
          searchQuery += ` between ₹${min.toLocaleString()} and ₹${max.toLocaleString()}`;
        } else {
          searchQuery += ` above ₹${min.toLocaleString()}`;
        }
      }

      console.log('Brand/Price selection search query:', searchQuery);

      // Search for products
      const products = await RealtimeProductService.searchProducts(searchQuery);

      // Generate response message
      let message = '';
      if (products.length > 0) {
        const brandText = brand !== 'any' ? `${brand} ` : '';
        const priceText = priceRange !== 'all' ? 
          ` in your selected price range` : '';
        
        message = `Great choice! I found ${products.length} ${brandText}${category} products${priceText}. Here are the best options for you:`;
      } else {
        message = `I couldn't find any ${brand !== 'any' ? brand + ' ' : ''}${category} products in your selected price range. Let me show you some alternatives:`;
        
        // Fallback search without price constraint
        const fallbackProducts = await RealtimeProductService.searchProducts(
          brand !== 'any' ? `${brand} ${category}` : category
        );
        
        if (fallbackProducts.length > 0) {
          products.push(...fallbackProducts.slice(0, 6));
          message += ` Here are some ${brand !== 'any' ? brand + ' ' : ''}${category} options:`;
        }
      }

      // Get structured recommendations
      const structuredRecommendations = await ShoppingAssistantService.analyzeAndRecommend(
        searchQuery,
        products
      );

      return {
        message,
        products: products.slice(0, 6),
        suggestedActions: [
          'Show more options',
          'Compare these products',
          'Filter by features',
          'Change price range'
        ],
        structuredRecommendations
      };

    } catch (error) {
      console.error('Error processing brand/price selection:', error);
      
      return {
        message: `I encountered an error while searching for ${brand !== 'any' ? brand + ' ' : ''}${category} products. Please try again or browse our popular products.`,
        products: [],
        suggestedActions: ['Try again', 'Browse categories', 'Show popular products']
      };
    }
  }

  static async processQuizAnswers(answers: Array<{questionId: string, answer: string}>): Promise<AIResponse> {
    try {
      // Extract preferences from quiz answers
      const categoryAnswer = answers.find(a => a.questionId === 'category')?.answer.toLowerCase();
      const budgetAnswer = answers.find(a => a.questionId === 'budget')?.answer;
      const priorityAnswer = answers.find(a => a.questionId === 'priority')?.answer.toLowerCase();

      let category = 'electronics';
      let priceRange: { min: number; max: number } | undefined;
      let features: string[] = [];

      // Map category preferences
      if (categoryAnswer?.includes('fitness') || categoryAnswer?.includes('health')) {
        category = 'smartwatch fitness tracker';
      } else if (categoryAnswer?.includes('music') || categoryAnswer?.includes('audio')) {
        category = 'headphones earbuds';
      } else if (categoryAnswer?.includes('communication') || categoryAnswer?.includes('productivity')) {
        category = 'smartphone laptop';
      } else if (categoryAnswer?.includes('gaming')) {
        category = 'gaming laptop gaming monitor';
      }

      // Map budget preferences
      if (budgetAnswer) {
        const budgetRanges: {[key: string]: [number, number]} = {
          'Under ₹20,000': [0, 20000],
          '₹20,000 - ₹50,000': [20000, 50000],
          '₹50,000 - ₹1,00,000': [50000, 100000],
          'Above ₹1,00,000': [100000, 200000]
        };
        
        const range = budgetRanges[budgetAnswer];
        if (range) {
          priceRange = { min: range[0], max: range[1] };
        }
      }

      // Map priority preferences to features
      if (priorityAnswer?.includes('latest') || priorityAnswer?.includes('technology')) {
        features.push('latest technology', 'advanced features');
      } else if (priorityAnswer?.includes('value') || priorityAnswer?.includes('money')) {
        features.push('value for money', 'budget friendly');
      } else if (priorityAnswer?.includes('brand') || priorityAnswer?.includes('reliability')) {
        features.push('reliable brand', 'warranty');
      } else if (priorityAnswer?.includes('design') || priorityAnswer?.includes('aesthetics')) {
        features.push('premium design', 'stylish');
      }

      // Get product recommendations based on quiz answers
      const products = await RealtimeProductService.getProductRecommendations(
        category,
        priceRange,
        features
      );

      // Generate structured recommendations
      const structuredRecommendations = await ShoppingAssistantService.analyzeAndRecommend(
        `${category} products for ${budgetAnswer} budget with ${features.join(', ')} features`,
        products
      );

      // Generate AI-powered quiz response
      const message = await geminiService.generateQuizRecommendation(answers, products.slice(0, 4));

      return {
        message,
        products: products.slice(0, 4),
        suggestedActions: ['Compare these products', 'Show more options', 'Refine search', 'Tell me more'],
        structuredRecommendations
      };

    } catch (error) {
      console.error('Error processing quiz:', error);
      
      return {
        message: "Based on your preferences, I'm having trouble finding the perfect products right now. This might be due to connectivity issues. Would you like to try a direct search instead?",
        products: [],
        suggestedActions: ['Try direct search', 'Browse categories', 'Try again']
      };
    }
  }

  static async generateComparison(products: RealtimeProduct[]): Promise<string> {
    try {
      return await geminiService.generateProductComparison(products);
    } catch (error) {
      console.error('Error generating comparison:', error);
      return 'Here are the products side by side for easy comparison. Each has unique strengths for different needs.';
    }
  }
}