import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type FreeResult = {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
  source: 'flipkart' | 'croma' | 'reliance' | 'myntra' | 'bigbasket' | '1mg';
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
};

function toNumber(text?: string): number {
  if (!text) return 0;
  const n = parseFloat(text.replace(/[^\d.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function uniqueByUrl<T extends { url: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of arr) {
    if (!seen.has(it.url)) {
      seen.add(it.url);
      out.push(it);
    }
  }
  return out;
}

async function fetchHtml(url: string, timeoutMs = 20000): Promise<string | null> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8',
      },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function scrapeFlipkart(query: string, max = 10): Promise<FreeResult[]> {
  const q = encodeURIComponent(query);
  const url = `https://www.flipkart.com/search?q=${q}`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const results: FreeResult[] = [];
  // Basic card parsing using known patterns (brittle but free)
  const itemRe = /<a\s+class="[^"]*?_1fQZEK[^"]*?"\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(html)) && results.length < max) {
    const href = m[1].startsWith('http') ? m[1] : `https://www.flipkart.com${m[1]}`;
    const block = m[2];
    const titleMatch = block.match(/<div[^>]*?_4rR01T[^>]*>([^<]+)<\/div>/);
    const priceMatch = block.match(/<div[^>]*?_30jeq3[^>]*>₹?([\d,]+)/);
    const imgMatch = block.match(/<img[^>]*?src="([^"]+)"[^>]*>/) || block.match(/<img[^>]*?data-src="([^"]+)"[^>]*>/);
    const ratingMatch = block.match(/<div[^>]*?_3LWZlK[^>]*>([\d.]+)<\/div>/);
    const title = titleMatch?.[1]?.trim();
    const price = toNumber(priceMatch?.[1]);
    const image = imgMatch?.[1];
    if (title && price && image) {
      results.push({
        id: `flipkart_${results.length}_${Date.now()}`,
        title,
        price,
        image,
        url: href,
        source: 'flipkart',
        rating: ratingMatch ? parseFloat(ratingMatch[1]) : undefined,
      });
    }
  }
  return results;
}

async function scrapeCroma(query: string, max = 10): Promise<FreeResult[]> {
  const q = encodeURIComponent(query);
  const url = `https://www.croma.com/searchB?q=${q}:relevance&text=${q}`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const results: FreeResult[] = [];
  const cardRe = /<a[^>]*?class="product__list--name"[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<span[^>]*?data-testid="price"[^>]*?>\s*₹?([\d,]+)/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) && results.length < max) {
    const href = m[1].startsWith('http') ? m[1] : `https://www.croma.com${m[1]}`;
    const title = m[2]?.replace(/<[^>]+>/g, '').trim();
    const price = toNumber(m[3]);
    // Image via og:image fallback from listing card block
    const itemBlockStart = html.lastIndexOf('<a', m.index);
    const itemBlock = html.slice(itemBlockStart, Math.min(html.length, itemBlockStart + 3000));
    const imgMatch = itemBlock.match(/<img[^>]*?src="([^"]+)"[^>]*?>/) || itemBlock.match(/<img[^>]*?data-src="([^"]+)"[^>]*?>/);
    const image = imgMatch?.[1];
    if (title && price && image) {
      results.push({
        id: `croma_${results.length}_${Date.now()}`,
        title,
        price,
        image,
        url: href,
        source: 'croma',
      });
    }
  }
  return results;
}

async function scrapeReliance(query: string, max = 10): Promise<FreeResult[]> {
  const q = encodeURIComponent(query);
  const url = `https://www.reliancedigital.in/search?q=${q}:relevance`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const results: FreeResult[] = [];
  const cardRe = /<a[^>]*?class="[^"]*sp__prd__name[^"]*"[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<span[^>]*?class="[^"]*sp__price[^"]*"[^>]*?>\s*₹?([\d,]+)/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) && results.length < max) {
    const href = m[1].startsWith('http') ? m[1] : `https://www.reliancedigital.in${m[1]}`;
    const title = m[2]?.replace(/<[^>]+>/g, '').trim();
    const price = toNumber(m[3]);
    // Find nearby image
    const itemBlockStart = html.lastIndexOf('<a', m.index);
    const itemBlock = html.slice(itemBlockStart, Math.min(html.length, itemBlockStart + 2500));
    const imgMatch = itemBlock.match(/<img[^>]*?src="([^"]+)"[^>]*?>/) || itemBlock.match(/<img[^>]*?data-src="([^"]+)"[^>]*?>/);
    const image = imgMatch?.[1];
    if (title && price && image) {
      results.push({
        id: `reliance_${results.length}_${Date.now()}`,
        title,
        price,
        image,
        url: href,
        source: 'reliance',
      });
    }
  }
  return results;
}

// Myntra - Clothing, Fashion, Accessories
async function scrapeMyntra(query: string, max = 10): Promise<FreeResult[]> {
  const q = encodeURIComponent(query);
  const url = `https://www.myntra.com/${q}?rawQuery=${q}`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const results: FreeResult[] = [];
  // Myntra product card pattern
  const cardRe = /<a[^>]*?class="[^"]*product-base[^"]*"[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) && results.length < max) {
    const href = m[1].startsWith('http') ? m[1] : `https://www.myntra.com${m[1]}`;
    const block = m[2];
    const titleMatch = block.match(/<h4[^>]*?class="[^"]*product-product[^"]*"[^>]*>([^<]+)<\/h4>/);
    const priceMatch = block.match(/<span[^>]*?class="[^"]*product-discountedPrice[^"]*"[^>]*>₹?([\d,]+)/);
    const imgMatch = block.match(/<img[^>]*?src="([^"]+)"[^>]*?>/) || block.match(/<img[^>]*?data-src="([^"]+)"[^>]*?>/);
    const title = titleMatch?.[1]?.trim();
    const price = toNumber(priceMatch?.[1]);
    const image = imgMatch?.[1];
    if (title && price && image) {
      results.push({
        id: `myntra_${results.length}_${Date.now()}`,
        title,
        price,
        image,
        url: href,
        source: 'myntra',
      });
    }
  }
  return results;
}

// BigBasket - Groceries, Home Products
async function scrapeBigBasket(query: string, max = 10): Promise<FreeResult[]> {
  const q = encodeURIComponent(query);
  const url = `https://www.bigbasket.com/ps/?q=${q}`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const results: FreeResult[] = [];
  const cardRe = /<a[^>]*?class="[^"]*product[^"]*"[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) && results.length < max) {
    const href = m[1].startsWith('http') ? m[1] : `https://www.bigbasket.com${m[1]}`;
    const block = m[2];
    const titleMatch = block.match(/<h3[^>]*?>([^<]+)<\/h3>/);
    const priceMatch = block.match(/<span[^>]*?class="[^"]*discnt-price[^"]*"[^>]*>₹?([\d,]+)/);
    const imgMatch = block.match(/<img[^>]*?src="([^"]+)"[^>]*?>/) || block.match(/<img[^>]*?data-src="([^"]+)"[^>]*?>/);
    const title = titleMatch?.[1]?.trim();
    const price = toNumber(priceMatch?.[1]);
    const image = imgMatch?.[1];
    if (title && price && image) {
      results.push({
        id: `bigbasket_${results.length}_${Date.now()}`,
        title,
        price,
        image,
        url: href,
        source: 'bigbasket',
      });
    }
  }
  return results;
}

// 1mg - Medical Items, Health Products
async function scrape1mg(query: string, max = 10): Promise<FreeResult[]> {
  const q = encodeURIComponent(query);
  const url = `https://www.1mg.com/search/all?name=${q}`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const results: FreeResult[] = [];
  const cardRe = /<a[^>]*?class="[^"]*style__product-link[^"]*"[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) && results.length < max) {
    const href = m[1].startsWith('http') ? m[1] : `https://www.1mg.com${m[1]}`;
    const block = m[2];
    const titleMatch = block.match(/<span[^>]*?class="[^"]*style__pro-title[^"]*"[^>]*>([^<]+)<\/span>/);
    const priceMatch = block.match(/<span[^>]*?class="[^"]*style__price-tag[^"]*"[^>]*>₹?([\d,]+)/);
    const imgMatch = block.match(/<img[^>]*?src="([^"]+)"[^>]*?>/) || block.match(/<img[^>]*?data-src="([^"]+)"[^>]*?>/);
    const title = titleMatch?.[1]?.trim();
    const price = toNumber(priceMatch?.[1]);
    const image = imgMatch?.[1];
    if (title && price && image) {
      results.push({
        id: `1mg_${results.length}_${Date.now()}`,
        title,
        price,
        image,
        url: href,
        source: '1mg',
      });
    }
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const { query, maxResults = 20 } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Detect category to prioritize relevant retailers
    const qLower = query.toLowerCase();
    const isElectronics = /phone|laptop|headphone|watch|tablet|tv|speaker|camera|gaming/.test(qLower);
    const isClothing = /shirt|pant|dress|shoes|sneaker|jacket|kurta|saree|jeans|top|clothing|fashion|apparel/.test(qLower);
    const isGrocery = /rice|dal|oil|flour|spice|vegetable|fruit|milk|bread|grocery|food|snack/.test(qLower);
    const isMedical = /medicine|tablet|capsule|syrup|vitamin|supplement|health|medical|pharma/.test(qLower);
    const isHome = /furniture|sofa|bed|chair|table|kitchen|home|decor|appliance/.test(qLower);

    // Run all scrapers in parallel - they handle all categories
    const allSearches = await Promise.allSettled([
      scrapeFlipkart(query, maxResults), // Everything
      scrapeCroma(query, isElectronics ? maxResults : Math.floor(maxResults / 2)), // Electronics focused
      scrapeReliance(query, isElectronics ? maxResults : Math.floor(maxResults / 2)), // Electronics focused
      scrapeMyntra(query, isClothing ? maxResults : Math.floor(maxResults / 2)), // Clothing focused
      scrapeBigBasket(query, isGrocery ? maxResults : Math.floor(maxResults / 2)), // Groceries
      scrape1mg(query, isMedical ? maxResults : Math.floor(maxResults / 2)), // Medical
    ]);

    const allResults: FreeResult[] = [];
    allSearches.forEach((result) => {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value);
      }
    });

    // Remove duplicates and sort by relevance
    const merged = uniqueByUrl(allResults);
    
    // Sort by relevance (exact matches first, then by price/rating)
    merged.sort((a, b) => {
      const aMatch = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      const bMatch = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      return a.price - b.price;
    });

    return NextResponse.json({ 
      success: true, 
      products: merged.slice(0, maxResults),
      totalFound: merged.length 
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Free search failed', details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500 }
    );
  }
}


