export interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  url: string;
  source: 'google_shopping' | 'amazon';
  availability: string;
  seller?: string;
}

export class ScraperAPIService {
  private static async makeScrapingRequest(url: string, source: string): Promise<string> {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, source })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.html) {
        throw new Error(data.error || 'Failed to get HTML content');
      }

      return data.html;
    } catch (error) {
      console.error(`${source} scraping error:`, error);
      throw error;
    }
  }

  static async searchGoogleShopping(query: string): Promise<ScrapedProduct[]> {
    try {
      const searchUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}&gl=in&hl=en`;
      const html = await this.makeScrapingRequest(searchUrl, 'google_shopping');
      return this.parseGoogleShoppingHTML(html);
    } catch (error) {
      console.error('Google Shopping search failed:', error);
      return [];
    }
  }

  static async searchAmazon(query: string): Promise<ScrapedProduct[]> {
    try {
      const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`;
      const html = await this.makeScrapingRequest(searchUrl, 'amazon');
      return this.parseAmazonHTML(html);
    } catch (error) {
      console.error('Amazon search failed:', error);
      return [];
    }
  }

  static async searchMultipleSources(query: string): Promise<ScrapedProduct[]> {
    try {
      console.log('Searching multiple sources for:', query);
      
      const searchPromises = [
        this.searchGoogleShopping(query),
        this.searchAmazon(query)
      ];

      const results = await Promise.allSettled(searchPromises);
      
      let allProducts: ScrapedProduct[] = [];
      
      results.forEach((result, index) => {
        const source = index === 0 ? 'Google Shopping' : 'Amazon';
        
        if (result.status === 'fulfilled') {
          console.log(`${source} found ${result.value.length} products`);
          allProducts = allProducts.concat(result.value);
        } else {
          console.warn(`${source} search failed:`, result.reason);
        }
      });

      // Remove duplicates and sort by relevance
      const uniqueProducts = this.removeDuplicates(allProducts);
      const sortedProducts = this.sortByRelevance(uniqueProducts, query);
      
      console.log(`Total unique products found: ${sortedProducts.length}`);
      return sortedProducts.slice(0, 12); // Limit to 12 products
      
    } catch (error) {
      console.error('Multi-source search error:', error);
      return [];
    }
  }

  private static parseGoogleShoppingHTML(html: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Google Shopping product selectors
      const productElements = doc.querySelectorAll('[data-docid], .sh-dgr__content');
      
      productElements.forEach((element, index) => {
        try {
          const nameElement = element.querySelector('h3, .sh-np__product-title, [role="heading"]');
          const priceElement = element.querySelector('.a-price-whole, .sh-np__price, [data-currency-code]');
          const imageElement = element.querySelector('img');
          const ratingElement = element.querySelector('[aria-label*="star"], .sh-np__rating');
          const linkElement = element.querySelector('a[href]');
          
          if (nameElement && priceElement) {
            const name = nameElement.textContent?.trim() || `Product ${index + 1}`;
            const priceText = priceElement.textContent?.trim() || '0';
            const price = this.extractPrice(priceText);
            
            if (price > 0) {
              const product: ScrapedProduct = {
                name: name.substring(0, 100), // Limit name length
                price,
                image: imageElement?.src || this.getPlaceholderImage(),
                rating: this.extractRating(ratingElement?.textContent || '4.0'),
                reviewCount: this.extractReviewCount(element.textContent || ''),
                url: linkElement?.href || '#',
                source: 'google_shopping',
                availability: 'Available',
                seller: 'Google Shopping'
              };
              
              products.push(product);
            }
          }
        } catch (error) {
          console.warn('Error parsing Google Shopping product:', error);
        }
      });
      
    } catch (error) {
      console.error('Error parsing Google Shopping HTML:', error);
    }
    
    return products;
  }

  private static parseAmazonHTML(html: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Amazon product selectors
      const productElements = doc.querySelectorAll('[data-component-type="s-search-result"], .s-result-item');
      
      productElements.forEach((element, index) => {
        try {
          const nameElement = element.querySelector('h2 a span, .s-title-instructions-style span');
          const priceElement = element.querySelector('.a-price-whole, .a-offscreen');
          const imageElement = element.querySelector('.s-image, img[data-image-latency]');
          const ratingElement = element.querySelector('[aria-label*="out of"], .a-icon-alt');
          const linkElement = element.querySelector('h2 a, .s-link-style a');
          
          if (nameElement && priceElement) {
            const name = nameElement.textContent?.trim() || `Amazon Product ${index + 1}`;
            const priceText = priceElement.textContent?.trim() || '0';
            const price = this.extractPrice(priceText);
            
            if (price > 0) {
              const product: ScrapedProduct = {
                name: name.substring(0, 100),
                price,
                image: imageElement?.src || this.getPlaceholderImage(),
                rating: this.extractRating(ratingElement?.getAttribute('aria-label') || '4.0'),
                reviewCount: this.extractReviewCount(element.textContent || ''),
                url: linkElement?.href ? `https://amazon.in${linkElement.href}` : '#',
                source: 'amazon',
                availability: 'Available on Amazon',
                seller: 'Amazon'
              };
              
              products.push(product);
            }
          }
        } catch (error) {
          console.warn('Error parsing Amazon product:', error);
        }
      });
      
    } catch (error) {
      console.error('Error parsing Amazon HTML:', error);
    }
    
    return products;
  }

  private static extractPrice(priceText: string): number {
    try {
      // Remove currency symbols and extract numbers
      const cleanPrice = priceText.replace(/[₹,\s]/g, '').replace(/[^\d.]/g, '');
      const price = parseFloat(cleanPrice);
      return isNaN(price) ? 0 : Math.round(price);
    } catch {
      return 0;
    }
  }

  private static extractRating(ratingText: string): number {
    try {
      const match = ratingText.match(/(\d+\.?\d*)/);
      if (match) {
        const rating = parseFloat(match[1]);
        return Math.min(Math.max(rating, 1), 5); // Clamp between 1-5
      }
      return 4.0; // Default rating
    } catch {
      return 4.0;
    }
  }

  private static extractReviewCount(text: string): number {
    try {
      const match = text.match(/(\d+(?:,\d+)*)\s*(?:reviews?|ratings?)/i);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
      return Math.floor(Math.random() * 1000) + 100; // Random fallback
    } catch {
      return Math.floor(Math.random() * 1000) + 100;
    }
  }

  private static getPlaceholderImage(): string {
    const placeholders = [
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }

  private static removeDuplicates(products: ScrapedProduct[]): ScrapedProduct[] {
    const seen = new Set<string>();
    return products.filter(product => {
      const key = `${product.name.toLowerCase()}-${product.price}`;
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
    const name = product.name.toLowerCase();
    let score = 0;
    
    queryWords.forEach(word => {
      if (name.includes(word)) {
        score += word.length; // Longer words get higher scores
      }
    });
    
    // Boost score for higher ratings and review counts
    score += product.rating * 10;
    score += Math.min(product.reviewCount / 100, 10);
    
    return score;
  }
}