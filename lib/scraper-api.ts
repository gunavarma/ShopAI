export interface ScrapedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  url: string;
  source: 'google_shopping' | 'amazon';
  brand?: string;
  availability: string;
  seller?: string;
  shipping?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface ScraperAPIResponse {
  products: ScrapedProduct[];
  totalResults: number;
  searchQuery: string;
  source: string;
}

export class ScraperAPIService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_SCRAPER_API_KEY || '';
  private static readonly BASE_URL = 'http://api.scraperapi.com';

  private static buildScraperURL(targetURL: string, options: Record<string, any> = {}): string {
    const params = new URLSearchParams({
      api_key: this.API_KEY,
      url: targetURL,
      country_code: 'in', // India
      device_type: 'desktop',
      premium: 'true',
      session_number: Math.random().toString(36).substring(7),
      ...options
    });

    return `${this.BASE_URL}?${params.toString()}`;
  }

  static async searchGoogleShopping(query: string, options: {
    maxResults?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'relevance' | 'price_low_to_high' | 'price_high_to_low' | 'rating';
  } = {}): Promise<ScrapedProduct[]> {
    try {
      const { maxResults = 20, minPrice, maxPrice, sortBy = 'relevance' } = options;
      
      // Build Google Shopping URL
      let googleShoppingURL = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}&hl=en&gl=in`;
      
      if (minPrice) googleShoppingURL += `&tbs=p_ord:p,price:1,ppr_min:${minPrice}`;
      if (maxPrice) googleShoppingURL += `,ppr_max:${maxPrice}`;
      
      // Add sorting
      switch (sortBy) {
        case 'price_low_to_high':
          googleShoppingURL += '&tbs=p_ord:p';
          break;
        case 'price_high_to_low':
          googleShoppingURL += '&tbs=p_ord:pd';
          break;
        case 'rating':
          googleShoppingURL += '&tbs=p_ord:r';
          break;
      }

      const scraperURL = this.buildScraperURL(googleShoppingURL, {
        render: 'true',
        wait: 3000,
        premium: 'true'
      });

      console.log('Scraping Google Shopping:', query);
      
      const response = await fetch(scraperURL, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`ScraperAPI request failed: ${response.status}`);
      }

      const html = await response.text();
      return this.parseGoogleShoppingHTML(html, query);

    } catch (error) {
      console.error('Google Shopping scraping error:', error);
      return [];
    }
  }

  static async searchAmazon(query: string, options: {
    maxResults?: number;
    minPrice?: number;
    maxPrice?: number;
    department?: string;
  } = {}): Promise<ScrapedProduct[]> {
    try {
      const { maxResults = 20, minPrice, maxPrice, department } = options;
      
      // Build Amazon India URL
      let amazonURL = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&ref=sr_pg_1`;
      
      if (department) amazonURL += `&i=${department}`;
      if (minPrice) amazonURL += `&low-price=${minPrice}`;
      if (maxPrice) amazonURL += `&high-price=${maxPrice}`;

      const scraperURL = this.buildScraperURL(amazonURL, {
        render: 'true',
        wait: 3000,
        premium: 'true',
        session_number: Math.random().toString(36).substring(7)
      });

      console.log('Scraping Amazon:', query);

      const response = await fetch(scraperURL, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`ScraperAPI request failed: ${response.status}`);
      }

      const html = await response.text();
      return this.parseAmazonHTML(html, query);

    } catch (error) {
      console.error('Amazon scraping error:', error);
      return [];
    }
  }

  private static parseGoogleShoppingHTML(html: string, query: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    try {
      // Create a DOM parser (this is a simplified version - in real implementation you'd use a proper HTML parser)
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Google Shopping product selectors (these may need updates based on Google's current structure)
      const productElements = doc.querySelectorAll('[data-docid], .sh-dgr__content, .PLla-d');
      
      productElements.forEach((element, index) => {
        try {
          const titleElement = element.querySelector('h3, .tAxDx, .sh-np__product-title');
          const priceElement = element.querySelector('.a8Pemb, .notranslate, .sh-np__price');
          const imageElement = element.querySelector('img');
          const linkElement = element.querySelector('a');
          const ratingElement = element.querySelector('.Rsc7Yb, .sh-np__rating');
          
          if (titleElement && priceElement) {
            const title = titleElement.textContent?.trim() || '';
            const priceText = priceElement.textContent?.trim() || '';
            const price = this.extractPrice(priceText);
            const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
            const url = linkElement?.href || '';
            const rating = this.extractRating(ratingElement?.textContent || '');
            
            if (title && price > 0) {
              products.push({
                id: `google_${index}_${Date.now()}`,
                title,
                price,
                currency: 'INR',
                rating: rating.rating,
                reviewCount: rating.reviewCount,
                image: image.startsWith('//') ? `https:${image}` : image,
                url: url.startsWith('//') ? `https:${url}` : url,
                source: 'google_shopping',
                availability: 'In Stock',
                brand: this.extractBrand(title),
                description: title
              });
            }
          }
        } catch (error) {
          console.error('Error parsing Google Shopping product:', error);
        }
      });
      
    } catch (error) {
      console.error('Error parsing Google Shopping HTML:', error);
    }
    
    return products.slice(0, 20); // Limit results
  }

  private static parseAmazonHTML(html: string, query: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Amazon product selectors
      const productElements = doc.querySelectorAll('[data-component-type="s-search-result"], .s-result-item');
      
      productElements.forEach((element, index) => {
        try {
          const titleElement = element.querySelector('h2 a span, .s-size-mini span');
          const priceElement = element.querySelector('.a-price-whole, .a-offscreen');
          const imageElement = element.querySelector('.s-image, img');
          const linkElement = element.querySelector('h2 a, .s-link-style a');
          const ratingElement = element.querySelector('.a-icon-alt, .a-size-base');
          const reviewElement = element.querySelector('.a-size-base, .s-underline-text');
          
          if (titleElement && priceElement) {
            const title = titleElement.textContent?.trim() || '';
            const priceText = priceElement.textContent?.trim() || '';
            const price = this.extractPrice(priceText);
            const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
            const url = linkElement?.href || '';
            const rating = this.extractRating(ratingElement?.textContent || '');
            const reviewCount = this.extractReviewCount(reviewElement?.textContent || '');
            
            if (title && price > 0) {
              products.push({
                id: `amazon_${index}_${Date.now()}`,
                title,
                price,
                currency: 'INR',
                rating: rating.rating,
                reviewCount: reviewCount || rating.reviewCount,
                image: image.startsWith('//') ? `https:${image}` : image,
                url: url.startsWith('/') ? `https://www.amazon.in${url}` : url,
                source: 'amazon',
                availability: 'In Stock',
                brand: this.extractBrand(title),
                description: title
              });
            }
          }
        } catch (error) {
          console.error('Error parsing Amazon product:', error);
        }
      });
      
    } catch (error) {
      console.error('Error parsing Amazon HTML:', error);
    }
    
    return products.slice(0, 20); // Limit results
  }

  private static extractPrice(priceText: string): number {
    // Extract price from various formats: ₹1,234, Rs. 1234, $12.34, etc.
    const cleanPrice = priceText.replace(/[^\d.,]/g, '');
    const price = parseFloat(cleanPrice.replace(/,/g, ''));
    return isNaN(price) ? 0 : price;
  }

  private static extractRating(ratingText: string): { rating: number; reviewCount: number } {
    const ratingMatch = ratingText.match(/(\d+\.?\d*)\s*out\s*of\s*5|(\d+\.?\d*)\s*stars?/i);
    const reviewMatch = ratingText.match(/(\d+(?:,\d+)*)\s*reviews?/i);
    
    return {
      rating: ratingMatch ? parseFloat(ratingMatch[1] || ratingMatch[2]) : 4.0,
      reviewCount: reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 100
    };
  }

  private static extractReviewCount(reviewText: string): number {
    const match = reviewText.match(/(\d+(?:,\d+)*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }

  private static extractBrand(title: string): string {
    // Common brand patterns
    const brands = [
      'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
      'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer',
      'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour',
      'Bose', 'JBL', 'Boat', 'Sennheiser', 'Audio-Technica'
    ];
    
    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    
    // Extract first word as potential brand
    const firstWord = title.split(' ')[0];
    return firstWord.length > 1 ? firstWord : 'Unknown';
  }

  static async searchMultipleSources(
    query: string,
    options: {
      sources?: ('google_shopping' | 'amazon')[];
      maxResults?: number;
      minPrice?: number;
      maxPrice?: number;
    } = {}
  ): Promise<ScrapedProduct[]> {
    const { sources = ['google_shopping', 'amazon'], maxResults = 40 } = options;
    const allProducts: ScrapedProduct[] = [];

    try {
      const searchPromises: Promise<ScrapedProduct[]>[] = [];

      if (sources.includes('google_shopping')) {
        searchPromises.push(this.searchGoogleShopping(query, options));
      }

      if (sources.includes('amazon')) {
        searchPromises.push(this.searchAmazon(query, options));
      }

      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allProducts.push(...result.value);
        } else {
          console.error('Search failed:', result.reason);
        }
      });

      // Remove duplicates and sort by relevance
      const uniqueProducts = this.removeDuplicates(allProducts);
      const sortedProducts = this.sortByRelevance(uniqueProducts, query);
      
      return sortedProducts.slice(0, maxResults);

    } catch (error) {
      console.error('Multi-source search error:', error);
      return [];
    }
  }

  private static removeDuplicates(products: ScrapedProduct[]): ScrapedProduct[] {
    const seen = new Set<string>();
    return products.filter(product => {
      const key = `${product.title.toLowerCase()}_${product.price}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private static sortByRelevance(products: ScrapedProduct[], query: string): ScrapedProduct[] {
    const queryWords = query.toLowerCase().split(' ');
    
    return products.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, queryWords);
      const bScore = this.calculateRelevanceScore(b, queryWords);
      return bScore - aScore;
    });
  }

  private static calculateRelevanceScore(product: ScrapedProduct, queryWords: string[]): number {
    const title = product.title.toLowerCase();
    let score = 0;

    // Exact query match
    if (title.includes(queryWords.join(' '))) {
      score += 100;
    }

    // Individual word matches
    queryWords.forEach(word => {
      if (title.includes(word)) {
        score += 10;
      }
    });

    // Rating bonus
    score += product.rating * 2;

    // Review count bonus (logarithmic)
    score += Math.log10(product.reviewCount + 1);

    return score;
  }

  static async getProductDetails(productUrl: string): Promise<any> {
    try {
      const scraperURL = this.buildScraperURL(productUrl, {
        render: 'true',
        wait: 5000,
        premium: 'true'
      });

      const response = await fetch(scraperURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status}`);
      }

      const html = await response.text();
      
      // Parse detailed product information
      // This would include specifications, detailed description, more images, etc.
      return this.parseProductDetails(html, productUrl);

    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  }

  private static parseProductDetails(html: string, url: string): any {
    // Implementation for parsing detailed product information
    // This would extract specifications, features, detailed descriptions, etc.
    return {
      url,
      specifications: {},
      features: [],
      detailedDescription: '',
      images: [],
      availability: 'In Stock'
    };
  }
}