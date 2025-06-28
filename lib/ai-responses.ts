import { RealtimeProduct, RealtimeProductService } from './realtime-products';
import { geminiService } from './gemini';
import { ShoppingAssistantService, ShoppingAssistantResponse } from './shopping-assistant';

export interface AIResponse {
  message: string;
  products?: RealtimeProduct[];
  suggestedActions?: string[];
  requiresQuiz?: boolean;
  structuredRecommendations?: ShoppingAssistantResponse;
}

export class AIAssistant {
  private static async analyzeQuery(query: string): Promise<{
    intent: string;
    category?: string;
    priceRange?: { min: number; max: number };
    features?: string[];
    productNames?: string[];
    brand?: string;
    isSpecificSearch?: boolean;
  }> {
    try {
      const analysisPrompt = `
Analyze this shopping query and extract key information:
Query: "${query}"

Determine:
1. intent: "search", "compare", "help", "greeting", "specific_product", "brand_search"
2. category: product category if mentioned (monitor, laptop, smartphone, headphones, etc.)
3. priceRange: {min: number, max: number} if price mentioned (in rupees)
4. features: array of specific features mentioned
5. productNames: array of specific product names if mentioned
6. brand: specific brand if mentioned (apple, samsung, nike, etc.)
7. isSpecificSearch: true if searching for specific product/brand

Examples:
- "apple watch" → intent: "brand_search", brand: "apple", category: "smartwatch", isSpecificSearch: true
- "iphone 15" → intent: "specific_product", brand: "apple", productNames: ["iPhone 15"], isSpecificSearch: true
- "samsung galaxy" → intent: "brand_search", brand: "samsung", category: "smartphone", isSpecificSearch: true
- "monitors under 30000" → intent: "search", category: "monitor", priceRange: {min: 0, max: 30000}
- "running shoes" → intent: "search", category: "shoes", features: ["running"]

Return only valid JSON:
`;

      const response = await geminiService.generateResponse(analysisPrompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        return JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Failed to parse query analysis:', parseError);
        return { intent: 'search' };
      }
    } catch (error) {
      console.error('Error analyzing query:', error);
      return { intent: 'search' };
    }
  }

  private static getSuggestedActions(products: RealtimeProduct[], query: string, analysis: any): string[] {
    const lowercaseQuery = query.toLowerCase();
    
    if (products.length === 0) {
      return ['Show popular products', 'Help me choose', 'Try different search', 'Browse categories'];
    }
    
    if (analysis.isSpecificSearch && analysis.brand) {
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
      // Analyze the query to understand user intent
      const analysis = await this.analyzeQuery(query);
      
      let products: RealtimeProduct[] = [];
      let message: string;
      let structuredRecommendations: ShoppingAssistantResponse | undefined;

      if (analysis.intent === 'compare' && analysis.productNames && analysis.productNames.length >= 2) {
        // Handle product comparison
        const comparisonResult = await RealtimeProductService.getProductComparison(analysis.productNames);
        products = comparisonResult.products;
        message = `Here's a detailed comparison of the products you requested:\n\n${comparisonResult.comparison}`;
      } else {
        // Handle product search with improved targeting
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
          const suggestions = analysis.brand 
            ? [`Try "${analysis.brand} ${analysis.category || 'products'}"`, `Browse ${analysis.brand} catalog`]
            : ['Show popular products', 'Browse categories'];
            
          message = `I couldn't find any products matching "${query}". This might be because:
• The specific product model isn't available
• Try using different keywords or brand names
• Check spelling of product names

Would you like me to show you popular products in this category instead?`;
        }
      }

      return {
        message,
        products: products.slice(0, 6), // Limit to top 6 products
        suggestedActions: this.getSuggestedActions(products, query, analysis),
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