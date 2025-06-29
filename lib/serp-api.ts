export interface SerpProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  url: string;
  source: 'google_shopping';
  availability: string;
  seller?: string;
  shipping?: string;
  brand?: string;
  description?: string;
}

export class SerpApiService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY;
  private static readonly BASE_URL = 'https://serpapi.com/search.json';

  static async searchGoogleShopping(query: string): Promise<SerpProduct[]> {
    if (!this.API_KEY) {
      console.warn('SERP API key not configured');
      return [];
    }

    try {
      const params = new URLSearchParams({
        engine: 'google_shopping',
        q: query,
        api_key: this.API_KEY,
        gl: 'in', // India
        hl: 'en', // English
        num: '20' // Number of results
      });

      const response = await fetch(`${this.BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`SERP API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`SERP API error: ${data.error}`);
      }

      return this.parseGoogleShoppingResults(data.shopping_results || []);
    } catch (error) {
      console.error('SERP API search failed:', error);
      return [];
    }
  }

  private static parseGoogleShoppingResults(results: any[]): SerpProduct[] {
    return results.map((result, index) => {
      const price = this.extractPrice(result.price);
      const originalPrice = result.original_price ? this.extractPrice(result.original_price) : undefined;
      
      return {
        id: `serp_${Date.now()}_${index}`,
        title: result.title || 'Product',
        price,
        originalPrice,
        image: result.thumbnail || this.getPlaceholderImage(),
        rating: this.extractRating(result.rating),
        reviewCount: this.extractReviewCount(result.reviews),
        url: result.link || '#',
        source: 'google_shopping',
        availability: 'Available',
        seller: result.source || 'Google Shopping',
        shipping: result.delivery || undefined,
        brand: this.extractBrand(result.title),
        description: result.title
      };
    }).filter(product => product.price > 0);
  }

  private static extractPrice(priceString: string): number {
    if (!priceString) return 0;
    
    try {
      // Remove currency symbols and extract numbers
      const cleanPrice = priceString.replace(/[₹,\s]/g, '').replace(/[^\d.]/g, '');
      const price = parseFloat(cleanPrice);
      return isNaN(price) ? 0 : Math.round(price);
    } catch {
      return 0;
    }
  }

  private static extractRating(rating: any): number {
    if (typeof rating === 'number') return Math.min(Math.max(rating, 1), 5);
    if (typeof rating === 'string') {
      const match = rating.match(/(\d+\.?\d*)/);
      if (match) {
        const ratingValue = parseFloat(match[1]);
        return Math.min(Math.max(ratingValue, 1), 5);
      }
    }
    return 4.0; // Default rating
  }

  private static extractReviewCount(reviews: any): number {
    if (typeof reviews === 'number') return reviews;
    if (typeof reviews === 'string') {
      const match = reviews.match(/(\d+(?:,\d+)*)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
    }
    return Math.floor(Math.random() * 1000) + 100; // Random fallback
  }

  private static extractBrand(title: string): string {
    const commonBrands = [
      'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
      'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI',
      'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour',
      'Canon', 'Nikon', 'Fujifilm', 'Panasonic',
      'Bose', 'JBL', 'Sennheiser', 'Audio-Technica'
    ];

    const titleLower = title.toLowerCase();
    for (const brand of commonBrands) {
      if (titleLower.includes(brand.toLowerCase())) {
        return brand;
      }
    }

    // Extract first word as potential brand
    const firstWord = title.split(' ')[0];
    return firstWord.length > 1 ? firstWord : 'Unknown';
  }

  private static getPlaceholderImage(): string {
    const placeholders = [
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
}