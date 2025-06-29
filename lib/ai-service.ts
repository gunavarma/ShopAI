import { geminiService } from './gemini';
import { DeepSeekService } from './deepseek';

export type AIProvider = 'gemini' | 'deepseek';

export class AIService {
  private static currentProvider: AIProvider = 'gemini';
  private static fallbackProvider: AIProvider = 'deepseek';

  // Check which AI services are available
  static getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = [];
    
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && 
        process.env.NEXT_PUBLIC_GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      providers.push('gemini');
    }
    
    if (process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY && 
        process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here') {
      providers.push('deepseek');
    }
    
    return providers;
  }

  // Get the best available provider
  static getBestProvider(): AIProvider | null {
    const available = this.getAvailableProviders();
    
    if (available.length === 0) {
      return null;
    }
    
    // Check if current provider is available and not quota exceeded
    if (available.includes(this.currentProvider)) {
      const isQuotaExceeded = this.currentProvider === 'gemini' 
        ? geminiService.isQuotaExceeded()
        : DeepSeekService.isQuotaExceeded();
      
      if (!isQuotaExceeded) {
        return this.currentProvider;
      }
    }
    
    // Try fallback provider
    if (available.includes(this.fallbackProvider)) {
      const isQuotaExceeded = this.fallbackProvider === 'gemini' 
        ? geminiService.isQuotaExceeded()
        : DeepSeekService.isQuotaExceeded();
      
      if (!isQuotaExceeded) {
        return this.fallbackProvider;
      }
    }
    
    // Return any available provider that's not quota exceeded
    for (const provider of available) {
      const isQuotaExceeded = provider === 'gemini' 
        ? geminiService.isQuotaExceeded()
        : DeepSeekService.isQuotaExceeded();
      
      if (!isQuotaExceeded) {
        return provider;
      }
    }
    
    return null;
  }

  // Switch to a different provider
  static switchProvider(): boolean {
    const available = this.getAvailableProviders();
    const otherProviders = available.filter(p => p !== this.currentProvider);
    
    if (otherProviders.length > 0) {
      this.currentProvider = otherProviders[0];
      console.log(`Switched AI provider to: ${this.currentProvider}`);
      return true;
    }
    
    return false;
  }

  // Generate response with automatic fallback
  static async generateResponse(prompt: string): Promise<string> {
    const provider = this.getBestProvider();
    
    if (!provider) {
      throw new Error('No AI providers available or all quota exceeded');
    }

    try {
      if (provider === 'gemini') {
        return await geminiService.generateResponse(prompt);
      } else {
        return await DeepSeekService.generateResponse(prompt);
      }
    } catch (error: any) {
      console.warn(`${provider} failed:`, error.message);
      
      // Try to switch to another provider
      if (this.switchProvider()) {
        const newProvider = this.currentProvider;
        console.log(`Trying fallback provider: ${newProvider}`);
        
        try {
          if (newProvider === 'gemini') {
            return await geminiService.generateResponse(prompt);
          } else {
            return await DeepSeekService.generateResponse(prompt);
          }
        } catch (fallbackError: any) {
          console.error(`Fallback provider ${newProvider} also failed:`, fallbackError.message);
          throw new Error('All AI providers failed or quota exceeded');
        }
      }
      
      throw error;
    }
  }

  // Get related product images with fallback
  static async getRelatedProductImages(productName: string, category: string, brand: string): Promise<string[]> {
    const provider = this.getBestProvider();
    
    if (!provider) {
      return this.getFallbackImages(category);
    }

    try {
      if (provider === 'gemini') {
        return await geminiService.getRelatedProductImages(productName, category, brand);
      } else {
        return await DeepSeekService.getRelatedProductImages(productName, category, brand);
      }
    } catch (error) {
      console.warn(`${provider} image generation failed, trying fallback`);
      
      if (this.switchProvider()) {
        const newProvider = this.currentProvider;
        try {
          if (newProvider === 'gemini') {
            return await geminiService.getRelatedProductImages(productName, category, brand);
          } else {
            return await DeepSeekService.getRelatedProductImages(productName, category, brand);
          }
        } catch (fallbackError) {
          console.error('Fallback image generation also failed');
        }
      }
      
      return this.getFallbackImages(category);
    }
  }

  private static getFallbackImages(category: string): string[] {
    const fallbackMap: Record<string, string[]> = {
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

    const lowerCategory = category.toLowerCase();
    for (const [key, images] of Object.entries(fallbackMap)) {
      if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
        return images;
      }
    }

    return fallbackMap.default;
  }

  // Get current provider status
  static getProviderStatus(): {
    current: AIProvider | null;
    available: AIProvider[];
    quotaStatus: Record<AIProvider, boolean>;
  } {
    return {
      current: this.getBestProvider(),
      available: this.getAvailableProviders(),
      quotaStatus: {
        gemini: geminiService.isQuotaExceeded(),
        deepseek: DeepSeekService.isQuotaExceeded()
      }
    };
  }

  // Generate product recommendation with fallback
  static async generateProductRecommendation(
    userQuery: string, 
    matchedProducts: any[], 
    userPreferences?: any
  ): Promise<string> {
    const provider = this.getBestProvider();
    
    if (!provider) {
      return `I found ${matchedProducts.length} great products that match your search! Here are the best options for you.`;
    }

    try {
      if (provider === 'gemini') {
        return await geminiService.generateProductRecommendation(userQuery, matchedProducts, userPreferences);
      } else {
        return await DeepSeekService.generateProductRecommendation(userQuery, matchedProducts, userPreferences);
      }
    } catch (error) {
      console.warn(`${provider} recommendation failed, using fallback`);
      return `I found ${matchedProducts.length} great products that match your search! Here are the best options for you.`;
    }
  }

  // Generate quiz recommendation with fallback
  static async generateQuizRecommendation(
    quizAnswers: Array<{questionId: string, answer: string}>,
    matchedProducts: any[]
  ): Promise<string> {
    const provider = this.getBestProvider();
    
    if (!provider) {
      return `Based on your preferences, I've found some perfect products! Here are my top recommendations.`;
    }

    try {
      if (provider === 'gemini') {
        return await geminiService.generateQuizRecommendation(quizAnswers, matchedProducts);
      } else {
        return await DeepSeekService.generateQuizRecommendation(quizAnswers, matchedProducts);
      }
    } catch (error) {
      console.warn(`${provider} quiz recommendation failed, using fallback`);
      return `Based on your preferences, I've found some perfect products! Here are my top recommendations.`;
    }
  }

  // Generate product comparison with fallback
  static async generateProductComparison(products: any[]): Promise<string> {
    if (products.length < 2) return '';
    
    const provider = this.getBestProvider();
    
    if (!provider) {
      return 'Here are the products side by side for easy comparison. Each offers unique value.';
    }

    try {
      if (provider === 'gemini') {
        return await geminiService.generateProductComparison(products);
      } else {
        return await DeepSeekService.generateProductComparison(products);
      }
    } catch (error) {
      console.warn(`${provider} comparison failed, using fallback`);
      return 'Here are the products side by side for easy comparison. Each offers unique value.';
    }
  }
}