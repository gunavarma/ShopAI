import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  private isQuotaExceeded = false;
  private quotaResetTime: number | null = null;

  async generateResponse(prompt: string): Promise<string> {
    // Check if we're in quota exceeded state and if enough time has passed
    if (this.isQuotaExceeded && this.quotaResetTime) {
      const now = Date.now();
      if (now < this.quotaResetTime) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        // Reset quota state after waiting period
        this.isQuotaExceeded = false;
        this.quotaResetTime = null;
      }
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      
      // Handle quota exceeded errors
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        this.isQuotaExceeded = true;
        // Set reset time to 1 hour from now (adjust as needed)
        this.quotaResetTime = Date.now() + (60 * 60 * 1000);
        throw new Error('API quota exceeded. Please try again later.');
      }
      
      throw new Error('Failed to generate AI response');
    }
  }

  async getRelatedProductImages(productName: string, category: string, brand: string): Promise<string[]> {
    try {
      const prompt = `
Generate 4 related product image URLs from Pexels for this product:
Product: ${productName}
Category: ${category}
Brand: ${brand}

Return ONLY a JSON array of 4 Pexels image URLs that are:
1. High quality (at least 800px wide)
2. Related to the product category and type
3. Professional product photography
4. Different angles/variations of similar products

Use this format for Pexels URLs: https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=800

Comprehensive image mapping by category:
- Electronics (monitor, laptop, smartphone, headphones, smartwatch, tablet, camera, speaker): 356056, 1714208, 205421, 18105, 699122, 1092644, 3394650, 1649771, 437037, 393047, 1334597, 90946, 51383
- Fashion (clothing, shoes, bags, watch, jewelry): 996329, 1040945, 2529148, 1598505, 1152077, 1697214, 1927259, 2113855
- Home & Kitchen (furniture, appliances, cookware, decor): 1350789, 1571460, 4686822, 4686823, 1599791, 1080721, 1571453
- Beauty & Personal Care (skincare, makeup, haircare, fragrances): 2113855, 3373736, 3762879, 3373737, 2113856
- Sports & Fitness (equipment, apparel, outdoor gear): 416778, 1552242, 163452, 1552243, 1552244
- Books & Media (books, magazines, music): 159711, 256541, 159740, 256542
- Toys & Games (children's toys, board games, video games): 163064, 1148998, 163065, 1148999
- Automotive (car accessories, tools, parts): 164634, 1149137, 164635, 1149138

Select appropriate photo IDs based on the product category and create valid Pexels URLs.

Return only the JSON array without any markdown formatting:
`;

      const response = await this.generateResponse(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const images = JSON.parse(cleanResponse);
        if (Array.isArray(images) && images.length > 0) {
          return images.slice(0, 4); // Ensure max 4 images
        }
      } catch (parseError) {
        console.error('Failed to parse image URLs:', parseError);
      }
      
      // Fallback images based on category
      return this.getFallbackImages(category);
    } catch (error) {
      console.error('Error getting related images:', error);
      return this.getFallbackImages(category);
    }
  }

  private getFallbackImages(category: string): string[] {
    const fallbackMap: Record<string, string[]> = {
      // Electronics
      'monitor': [
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'laptop': [
        'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'smartphone': [
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'headphones': [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649772/pexels-photo-1649772.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'smartwatch': [
        'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Fashion
      'clothing': [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1040946/pexels-photo-1040946.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'shoes': [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2529149/pexels-photo-2529149.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Home & Kitchen
      'furniture': [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'appliance': [
        'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4686823/pexels-photo-4686823.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4686824/pexels-photo-4686824.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Beauty
      'beauty': [
        'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2113856/pexels-photo-2113856.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Sports & Fitness
      'fitness': [
        'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1552243/pexels-photo-1552243.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/416779/pexels-photo-416779.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      
      // Books
      'book': [
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/159740/pexels-photo-159740.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/256542/pexels-photo-256542.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    };

    const lowerCategory = category.toLowerCase();
    for (const [key, images] of Object.entries(fallbackMap)) {
      if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
        return images;
      }
    }

    // Default fallback
    return fallbackMap.monitor;
  }

  async analyzeProductQuery(userQuery: string, availableProducts: any[]): Promise<{
    intent: string;
    category?: string;
    priceRange?: { min: number; max: number };
    features?: string[];
    sentiment: string;
    confidence: number;
  }> {
    const prompt = `
Analyze this shopping query and extract key information:
Query: "${userQuery}"

Available product categories: electronics, fashion, home, beauty, sports, books, toys, automotive, health

Please analyze and return a JSON response with:
1. intent (search, compare, help, greeting, etc.)
2. category (if mentioned)
3. priceRange (if mentioned, extract min/max in rupees)
4. features (array of mentioned features)
5. sentiment (positive, neutral, negative)
6. confidence (0-1 score)

Available products for context:
${availableProducts.map(p => `${p.name} - ${p.category} - ₹${p.price}`).join('\n')}

Return only valid JSON without any markdown formatting.
`;

    try {
      const response = await this.generateResponse(prompt);
      // Clean the response to ensure it's valid JSON
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error analyzing query:', error);
      // Return fallback analysis
      return {
        intent: 'search',
        sentiment: 'neutral',
        confidence: 0.5
      };
    }
  }

  async generateProductRecommendation(
    userQuery: string, 
    matchedProducts: any[], 
    userPreferences?: any
  ): Promise<string> {
    const prompt = `
You are ShopWhiz, an AI shopping assistant like Amazon's recommendation system. Generate a helpful, conversational response for this user query.

User Query: "${userQuery}"

Matched Products:
${matchedProducts.map(p => `
- ${p.name} by ${p.brand}
  Price: ₹${p.price.toLocaleString()}
  Rating: ${p.rating}/5 (${p.reviewCount} reviews)
  Category: ${p.category}
  Features: ${p.features.join(', ')}
  Pros: ${p.pros.join(', ')}
  Cons: ${p.cons.join(', ')}
`).join('\n')}

Guidelines:
- Be conversational and helpful like Amazon's product recommendations
- Highlight key benefits and variety of products found
- Mention different categories and price ranges available
- Keep response under 150 words
- Don't use markdown formatting
- Be enthusiastic about the product variety

Generate a personalized recommendation response:
`;

    try {
      return await this.generateResponse(prompt);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      return `I found ${matchedProducts.length} great products across different categories that match your search! From electronics to fashion, home essentials to beauty products - there's something for every need and budget.`;
    }
  }

  async generateQuizRecommendation(
    quizAnswers: Array<{questionId: string, answer: string}>,
    matchedProducts: any[]
  ): Promise<string> {
    const prompt = `
Based on the user's quiz responses, generate a personalized product recommendation like Amazon's personalized suggestions.

Quiz Answers:
${quizAnswers.map(a => `${a.questionId}: ${a.answer}`).join('\n')}

Recommended Products:
${matchedProducts.map(p => `
- ${p.name} by ${p.brand}
  Price: ₹${p.price.toLocaleString()}
  Rating: ${p.rating}/5
  Category: ${p.category}
  Features: ${p.features.join(', ')}
`).join('\n')}

Generate a personalized response that:
- References their quiz preferences
- Explains why these products are perfect for them
- Highlights matching features across different categories
- Keeps it conversational and under 120 words
- No markdown formatting

Response:
`;

    try {
      return await this.generateResponse(prompt);
    } catch (error) {
      console.error('Error generating quiz recommendation:', error);
      return `Based on your preferences, I've found some perfect products across multiple categories! Here are my top recommendations that match your style and budget:`;
    }
  }

  async generateProductComparison(products: any[]): Promise<string> {
    if (products.length < 2) return '';

    const prompt = `
Compare these products and provide a helpful analysis like Amazon's comparison feature:

${products.map((p, i) => `
Product ${i + 1}: ${p.name}
- Brand: ${p.brand}
- Price: ₹${p.price.toLocaleString()}
- Rating: ${p.rating}/5
- Category: ${p.category}
- Features: ${p.features.join(', ')}
- Pros: ${p.pros.join(', ')}
- Cons: ${p.cons.join(', ')}
`).join('\n')}

Provide a comparison that:
- Highlights key differences across categories if different
- Mentions best use cases for each
- Gives a clear recommendation based on different needs
- Keeps it under 100 words
- No markdown formatting

Comparison:
`;

    try {
      return await this.generateResponse(prompt);
    } catch (error) {
      console.error('Error generating comparison:', error);
      return 'Here are the products side by side for easy comparison. Each offers unique value across different categories and price points.';
    }
  }
}

export const geminiService = new GeminiService();