import {
  EnhancedRealtimeProduct,
  EnhancedRealtimeProductService,
} from "./realtime-products-enhanced";
import { geminiService } from "./gemini";
import {
  ShoppingAssistantService,
  ShoppingAssistantResponse,
} from "./shopping-assistant";

export interface EnhancedAIResponse {
  message: string;
  products?: EnhancedRealtimeProduct[];
  suggestedActions?: string[];
  requiresQuiz?: boolean;
  structuredRecommendations?: ShoppingAssistantResponse;
  clarifyingQuestions?: string[];
  brandSuggestions?: string[];
  needsMoreInfo?: boolean;
  category?: string;
  dataSource?: "real_time" | "ai_generated" | "mixed";
}

export class EnhancedAIAssistant {
  static async processQuery(query: string): Promise<EnhancedAIResponse> {
    const lowercaseQuery = query.toLowerCase();

    // Handle greetings
    if (
      lowercaseQuery.includes("hello") ||
      lowercaseQuery.includes("hi") ||
      lowercaseQuery.includes("hey")
    ) {
      return {
        message:
          "Hi! I'm ShopWhiz — I can help you find products with live prices, reviews, and availability. What are you looking for today?",
        suggestedActions: [
          "Apple iPhone 15",
          "Samsung Galaxy S24",
          "MacBook Pro",
          "Sony headphones",
          "Nike shoes",
          "Gaming laptops",
        ],
        dataSource: "ai_generated",
      };
    }

    try {
      // Analyze the query intent
      const intent = await this.analyzeQueryIntent(query);

      // Previously: if query was general, we prompted for brands/prices.
      // Now: skip prompting and proceed to fetch results directly.

      // Search for products using enhanced service
      console.log("Searching for products:", query);
      const products = await EnhancedRealtimeProductService.searchProducts(
        query,
        {
          useRealData: true,
          maxResults: 8,
        }
      );

      let message: string;
      let dataSource: "real_time" | "ai_generated" | "mixed" = "ai_generated";

      if (products.length > 0) {
        // Determine data source
        const realProducts = products.filter(
          (p) => p.source !== "ai_generated"
        );
        const aiProducts = products.filter((p) => p.source === "ai_generated");

        if (realProducts.length > 0 && aiProducts.length > 0) {
          dataSource = "mixed";
        } else if (realProducts.length > 0) {
          dataSource = "real_time";
        }

        // Generate contextual message
        message = await this.generateProductMessage(
          query,
          products,
          dataSource
        );
      } else {
        message = `I couldn't find any products matching "${query}". This might be because:
• The specific product model isn't available
• Try using different keywords or brand names
• Check spelling of product names

Would you like me to show you popular products in this category instead?`;
      }

      // Get structured recommendations
      let structuredRecommendations: ShoppingAssistantResponse | undefined;
      if (products.length > 0) {
        // Convert to compatible format for shopping assistant
        const compatibleProducts = products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          rating: p.rating,
          reviewCount: p.reviewCount,
          brand: p.brand,
          category: p.category,
          features: p.features,
          pros: p.pros,
          cons: p.cons,
          sentiment: p.sentiment,
          sentimentScore: p.sentimentScore,
          description: p.description,
          inStock: p.inStock,
          availability: p.availability,
          specifications: p.specifications,
          youtubeVideoId: p.youtubeVideoId,
          reviewSummary: p.reviewSummary,
          sampleReviews: p.sampleReviews,
        }));

        structuredRecommendations =
          await ShoppingAssistantService.analyzeAndRecommend(
            query,
            compatibleProducts
          );
      }

      return {
        message,
        products: products.slice(0, 6),
        suggestedActions: this.getSuggestedActions(products, query, intent),
        structuredRecommendations,
        dataSource,
      };
    } catch (error) {
      console.error("Error processing enhanced query:", error);

      return {
        message: `I encountered an error while searching for "${query}". This could be due to:
• Network connectivity issues
• API rate limits
• Temporary service unavailability

Please try again in a moment, or try a different search query.`,
        products: [],
        suggestedActions: [
          "Try again",
          "Show popular products",
          "Help me choose",
          "Browse categories",
        ],
        dataSource: "ai_generated",
      };
    }
  }

  private static async generateProductMessage(
    query: string,
    products: EnhancedRealtimeProduct[],
    dataSource: "real_time" | "ai_generated" | "mixed"
  ): Promise<string> {
    try {
      const realProducts = products.filter((p) => p.source !== "ai_generated");
      const aiProducts = products.filter((p) => p.source === "ai_generated");

      let sourceInfo = "";
      if (dataSource === "real_time") {
        sourceInfo = `I found ${products.length} live products from Google Shopping and Amazon India with current prices and availability.`;
      } else if (dataSource === "mixed") {
        sourceInfo = `I found ${realProducts.length} live products from shopping sites and ${aiProducts.length} additional recommendations.`;
      } else {
        sourceInfo = `I found ${products.length} great product recommendations for you.`;
      }

      const messagePrompt = `
Generate a helpful, conversational response for this shopping search:
Query: "${query}"
Found: ${products.length} products
Data Source: ${dataSource}

Products found:
${products
  .slice(0, 3)
  .map(
    (p) =>
      `- ${p.name} by ${p.brand} - ₹${p.price.toLocaleString()} (${
        p.rating
      }/5 stars)`
  )
  .join("\n")}

Create a response that:
1. Acknowledges their search enthusiastically
2. Mentions the data source: "${sourceInfo}"
3. Highlights the variety and quality of results
4. Keeps it conversational and under 100 words
5. Don't use markdown formatting

Return only the response text:
`;

      return await geminiService.generateResponse(messagePrompt);
    } catch (error) {
      console.error("Error generating product message:", error);
      return `Great! I found ${products.length} products for "${query}" with live pricing and availability. Here are the best options for you:`;
    }
  }

  private static async analyzeQueryIntent(query: string): Promise<{
    isSpecific: boolean;
    category?: string;
    hasPrice?: boolean;
    hasBrand?: boolean;
    needsClarification: boolean;
    missingInfo: string[];
  }> {
    try {
      const analysisPrompt = `
Analyze this shopping query: "${query}"

Determine:
1. isSpecific: Is this specific (like "iPhone 15 Pro") or general (like "smartphone")?
2. category: What product category?
3. hasPrice: Does it mention price range?
4. hasBrand: Does it mention specific brand?
5. needsClarification: Should we ask for more details?
6. missingInfo: What info would help narrow results?

For specific products or when brand+model is mentioned, set needsClarification: false
For general terms like "laptop", "shoes", "headphones", set needsClarification: true

Return JSON:
{
  "isSpecific": boolean,
  "category": "category",
  "hasPrice": boolean,
  "hasBrand": boolean,
  "needsClarification": boolean,
  "missingInfo": ["brand", "price"]
}
`;

      const response = await geminiService.generateResponse(analysisPrompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();

      try {
        return JSON.parse(cleanResponse);
      } catch (parseError) {
        return {
          isSpecific: false,
          needsClarification: true,
          missingInfo: ["brand", "price"],
        };
      }
    } catch (error) {
      return {
        isSpecific: false,
        needsClarification: true,
        missingInfo: ["brand", "price"],
      };
    }
  }

  private static async generateConversationalResponse(
    query: string,
    category: string
  ): Promise<string> {
    try {
      const responsePrompt = `
Generate a helpful response for this general shopping query:
Query: "${query}"
Category: "${category}"

The user made a general request, so we'll show them brand and price selection.

Create a response that:
1. Acknowledges their request enthusiastically
2. Mentions we'll show them popular brands and price options
3. Keeps it conversational and under 50 words

Return only the response text:
`;

      return await geminiService.generateResponse(responsePrompt);
    } catch (error) {
      return `Got it. I’ll show you the best ${category} options available right now.`;
    }
  }

  private static extractCategoryFromQuery(query: string): string {
    const lowercaseQuery = query.toLowerCase();

    const categoryMap: Record<string, string> = {
      phone: "smartphone",
      mobile: "smartphone",
      iphone: "smartphone",
      samsung: "smartphone",
      laptop: "laptop",
      computer: "laptop",
      macbook: "laptop",
      headphones: "headphones",
      earphones: "headphones",
      earbuds: "headphones",
      watch: "smartwatch",
      shoes: "shoes",
      sneakers: "shoes",
      shirt: "clothing",
      tshirt: "clothing",
      bag: "bag",
      backpack: "bag",
    };

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowercaseQuery.includes(keyword)) {
        return category;
      }
    }

    return "product";
  }

  private static getSuggestedActions(
    products: EnhancedRealtimeProduct[],
    query: string,
    analysis: any
  ): string[] {
    if (products.length === 0) {
      return [
        "Show popular products",
        "Help me choose",
        "Try different search",
        "Browse categories",
      ];
    }

    const hasRealData = products.some((p) => p.source !== "ai_generated");

    if (hasRealData) {
      return [
        "Compare prices",
        "Check availability",
        "Show more options",
        "Filter by brand",
      ];
    }

    return [
      "Compare these products",
      "Show more details",
      "Filter by price",
      "Help me choose",
    ];
  }

  static async processBrandPriceSelection(
    brand: string,
    priceRange: string,
    category: string
  ): Promise<EnhancedAIResponse> {
    try {
      let searchQuery = "";

      if (brand !== "any") {
        searchQuery += `${brand} `;
      }

      searchQuery += category;

      // Parse price range
      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        minPrice = min;
        maxPrice = max < 999999 ? max : undefined;
      }

      console.log("Brand/Price selection search:", searchQuery, {
        minPrice,
        maxPrice,
      });

      // Search for products with price filtering
      const products = await EnhancedRealtimeProductService.searchProducts(
        searchQuery,
        {
          useRealData: true,
          maxResults: 8,
          minPrice,
          maxPrice,
        }
      );

      // Generate response message
      let message = "";
      let dataSource: "real_time" | "ai_generated" | "mixed" = "ai_generated";

      if (products.length > 0) {
        const realProducts = products.filter(
          (p) => p.source !== "ai_generated"
        );
        dataSource = realProducts.length > 0 ? "real_time" : "ai_generated";

        const brandText = brand !== "any" ? `${brand} ` : "";
        const priceText =
          priceRange !== "all" ? ` in your selected price range` : "";

        message = `Perfect! I found ${products.length} ${brandText}${category} products${priceText} with live pricing and availability. Here are the best options for you:`;
      } else {
        message = `I couldn't find any ${
          brand !== "any" ? brand + " " : ""
        }${category} products in your selected price range. Let me show you some alternatives:`;

        // Fallback search without price constraint
        const fallbackProducts =
          await EnhancedRealtimeProductService.searchProducts(
            brand !== "any" ? `${brand} ${category}` : category,
            { useRealData: true, maxResults: 6 }
          );

        if (fallbackProducts.length > 0) {
          products.push(...fallbackProducts);
          message += ` Here are some ${
            brand !== "any" ? brand + " " : ""
          }${category} options:`;
        }
      }

      return {
        message,
        products: products.slice(0, 6),
        suggestedActions: [
          "Show more options",
          "Compare these products",
          "Filter by features",
          "Change price range",
        ],
        dataSource,
      };
    } catch (error) {
      console.error("Error processing brand/price selection:", error);

      return {
        message: `I encountered an error while searching for ${
          brand !== "any" ? brand + " " : ""
        }${category} products. Please try again or browse our popular products.`,
        products: [],
        suggestedActions: [
          "Try again",
          "Browse categories",
          "Show popular products",
        ],
        dataSource: "ai_generated",
      };
    }
  }

  static async processQuizAnswers(
    answers: Array<{ questionId: string; answer: string }>
  ): Promise<EnhancedAIResponse> {
    try {
      // Extract preferences from quiz answers
      const categoryAnswer = answers
        .find((a) => a.questionId === "category")
        ?.answer.toLowerCase();
      const budgetAnswer = answers.find(
        (a) => a.questionId === "budget"
      )?.answer;
      const priorityAnswer = answers
        .find((a) => a.questionId === "priority")
        ?.answer.toLowerCase();

      let category = "electronics";
      let priceRange: { min: number; max: number } | undefined;
      let features: string[] = [];

      // Map category preferences
      if (
        categoryAnswer?.includes("fitness") ||
        categoryAnswer?.includes("health")
      ) {
        category = "smartwatch fitness tracker";
      } else if (
        categoryAnswer?.includes("music") ||
        categoryAnswer?.includes("audio")
      ) {
        category = "headphones earbuds";
      } else if (
        categoryAnswer?.includes("communication") ||
        categoryAnswer?.includes("productivity")
      ) {
        category = "smartphone laptop";
      } else if (categoryAnswer?.includes("gaming")) {
        category = "gaming laptop gaming accessories";
      }

      // Map budget preferences
      if (budgetAnswer) {
        const budgetRanges: { [key: string]: [number, number] } = {
          "Under ₹20,000": [0, 20000],
          "₹20,000 - ₹50,000": [20000, 50000],
          "₹50,000 - ₹1,00,000": [50000, 100000],
          "Above ₹1,00,000": [100000, 200000],
        };

        const range = budgetRanges[budgetAnswer];
        if (range) {
          priceRange = { min: range[0], max: range[1] };
        }
      }

      // Get product recommendations
      const products =
        await EnhancedRealtimeProductService.getProductRecommendations(
          category,
          priceRange,
          features
        );

      // Generate AI-powered quiz response
      const message = await geminiService.generateQuizRecommendation(
        answers,
        products.slice(0, 4)
      );

      const dataSource = products.some((p) => p.source !== "ai_generated")
        ? "real_time"
        : "ai_generated";

      return {
        message,
        products: products.slice(0, 4),
        suggestedActions: [
          "Compare these products",
          "Show more options",
          "Refine search",
          "Tell me more",
        ],
        dataSource,
      };
    } catch (error) {
      console.error("Error processing quiz:", error);

      return {
        message:
          "Based on your preferences, I'm having trouble finding the perfect products right now. Would you like to try a direct search instead?",
        products: [],
        suggestedActions: [
          "Try direct search",
          "Browse categories",
          "Try again",
        ],
        dataSource: "ai_generated",
      };
    }
  }
}
