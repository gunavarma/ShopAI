import { AIService } from './ai-service';
import { RealtimeProduct } from './realtime-products';

export interface ProductRecommendation {
  name: string;
  price: string;
  rating?: number;
  reason: string;
  merchant: string;
  buyLink?: string;
  youtubeReviewLink?: string;
  image?: string;
}

export interface ShoppingAssistantResponse {
  summary: string;
  recommendations: ProductRecommendation[];
  alternatives?: ProductRecommendation[];
  clarifyingQuestions?: string[];
  success: boolean;
}

export class ShoppingAssistantService {
  static async analyzeAndRecommend(
    userQuery: string,
    products: RealtimeProduct[]
  ): Promise<ShoppingAssistantResponse> {
    try {
      if (!products || products.length === 0) {
        return {
          summary: "I couldn't find any products matching your request.",
          recommendations: [],
          clarifyingQuestions: [
            "Could you be more specific about the product type?",
            "What's your budget range?",
            "Are you looking for a particular brand?",
            "What features are most important to you?"
          ],
          success: false
        };
      }

      const analysisPrompt = `
You are an intelligent shopping assistant analyzing products for this user request:
"${userQuery}"

Available products:
${products.map((p, i) => `
${i + 1}. ${p.name}
   - Brand: ${p.brand}
   - Price: ₹${p.price.toLocaleString()}
   - Rating: ${p.rating}/5 (${p.reviewCount} reviews)
   - Category: ${p.category}
   - Features: ${p.features.join(', ')}
   - Pros: ${p.pros.join(', ')}
   - Cons: ${p.cons.join(', ')}
   - In Stock: ${p.inStock}
   - Description: ${p.description}
`).join('\n')}

Analyze and provide recommendations in this exact JSON format:
{
  "summary": "Brief overview of findings (2-3 sentences)",
  "recommendations": [
    {
      "name": "Product name",
      "price": "₹XX,XXX",
      "rating": 4.5,
      "reason": "Why this product is a good match (1-2 sentences)",
      "merchant": "Available at multiple retailers",
      "buyLink": "https://example.com/buy",
      "youtubeReviewLink": null
    }
  ],
  "alternatives": [
    {
      "name": "Alternative product name",
      "price": "₹XX,XXX", 
      "rating": 4.2,
      "reason": "Why this is a good alternative",
      "merchant": "Available online",
      "buyLink": null,
      "youtubeReviewLink": null
    }
  ],
  "success": true
}

Guidelines:
- Select the best 1-3 products that match the user's request
- Focus on value, features, and user needs
- Be honest about pros and cons
- Include price in Indian Rupees format
- Set merchant as "Available at multiple retailers" or specific store if known
- Set buyLink as null (we'll handle this in the frontend)
- Set youtubeReviewLink as null (not available in current data)
- If products don't match well, set success to false and include clarifyingQuestions

Return only valid JSON without markdown formatting:
`;

      const response = await geminiService.generateResponse(analysisPrompt);
      const response = await AIService.generateResponse(analysisPrompt);
      
      // Clean and parse the response
      let cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const result = JSON.parse(cleanResponse);
        
        // Validate the response structure
        if (!result.summary || !Array.isArray(result.recommendations)) {
          throw new Error('Invalid response structure');
        }
        
        return {
          summary: result.summary,
          recommendations: result.recommendations || [],
          alternatives: result.alternatives || [],
          clarifyingQuestions: result.clarifyingQuestions || [],
          success: result.success !== false
        };
        
      } catch (parseError) {
        console.error('Failed to parse shopping assistant response:', parseError);
        
        // Fallback response
        return this.createFallbackResponse(userQuery, products);
      }
      
    } catch (error) {
      console.error('Shopping assistant error:', error);
      return this.createFallbackResponse(userQuery, products);
    }
  }

  private static createFallbackResponse(
    userQuery: string,
    products: RealtimeProduct[]
  ): ShoppingAssistantResponse {
    if (products.length === 0) {
      return {
        summary: "I couldn't find any products matching your specific request.",
        recommendations: [],
        clarifyingQuestions: [
          "Could you try a different search term?",
          "What's your budget range?",
          "Are you looking for a specific brand?"
        ],
        success: false
      };
    }

    // Create basic recommendations from available products
    const topProducts = products.slice(0, 3).map(product => ({
      name: product.name,
      price: `₹${product.price.toLocaleString()}`,
      rating: product.rating,
      reason: `Highly rated ${product.category} with ${product.features.slice(0, 2).join(' and ')}`,
      merchant: "Available at multiple retailers",
      buyLink: undefined,
      youtubeReviewLink: undefined
    }));

    return {
      summary: `I found ${products.length} products matching your search. Here are the top recommendations based on ratings and features.`,
      recommendations: topProducts,
      alternatives: [],
      success: true
    };
  }

  static async getProductInsights(product: RealtimeProduct): Promise<{
    keyHighlights: string[];
    bestFor: string[];
    considerations: string[];
  }> {
    try {
      const insightsPrompt = `
Analyze this product and provide insights:

Product: ${product.name}
Brand: ${product.brand}
Price: ₹${product.price.toLocaleString()}
Rating: ${product.rating}/5 (${product.reviewCount} reviews)
Features: ${product.features.join(', ')}
Pros: ${product.pros.join(', ')}
Cons: ${product.cons.join(', ')}
Description: ${product.description}

Provide insights in this JSON format:
{
  "keyHighlights": ["highlight 1", "highlight 2", "highlight 3"],
  "bestFor": ["use case 1", "use case 2", "use case 3"],
  "considerations": ["consideration 1", "consideration 2"]
}

Return only valid JSON:
`;

      const response = await geminiService.generateResponse(insightsPrompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      return JSON.parse(cleanResponse);
      
    } catch (error) {
      console.error('Error getting product insights:', error);
      
      // Fallback insights
      return {
        keyHighlights: product.features.slice(0, 3),
        bestFor: [`${product.category} enthusiasts`, "Daily use", "Value seekers"],
        considerations: product.cons.slice(0, 2)
      };
    }
  }
}