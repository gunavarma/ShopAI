import { geminiService } from '@/lib/gemini';
import { ScrapedProduct } from '@/lib/scraper-api';

type SearchResult = { url: string; title?: string; snippet?: string };

const SERPER_API_KEY = process.env.SERPER_API_KEY || '';
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || '';

const SCRAPER_API_KEY = process.env.NEXT_PUBLIC_SCRAPER_API_KEY || '';
const SCRAPER_BASE_URL = 'http://api.scraperapi.com';

function buildScraperUrl(targetURL: string, options: Record<string, any> = {}): string {
  const params = new URLSearchParams({
    api_key: SCRAPER_API_KEY,
    url: targetURL,
    country_code: 'in',
    device_type: 'desktop',
    premium: 'true',
    render: 'true',
    wait: '3000',
    session_number: Math.random().toString(36).substring(7),
    ...options,
  });
  return `${SCRAPER_BASE_URL}?${params.toString()}`;
}

export async function searchWeb(query: string, limit = 12): Promise<SearchResult[]> {
  // Prefer Serper.dev (Google) → fallback to Brave Search → empty
  if (SERPER_API_KEY) {
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': SERPER_API_KEY,
        },
        body: JSON.stringify({ q: query, num: limit }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = await res.json();
        const organic: any[] = data.organic || [];
        return organic.slice(0, limit).map((o) => ({ url: o.link, title: o.title, snippet: o.snippet }));
      }
    } catch (err) {
      console.warn('Serper search failed, falling back:', err);
    }
  }

  if (BRAVE_API_KEY) {
    try {
      const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${limit}`, {
        headers: { 'X-Subscription-Token': BRAVE_API_KEY },
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = await res.json();
        const web: any[] = data.web?.results || [];
        return web.slice(0, limit).map((r) => ({ url: r.url, title: r.title, snippet: r.description }));
      }
    } catch (err) {
      console.warn('Brave search failed:', err);
    }
  }
  return [];
}

export async function fetchPageHtml(url: string): Promise<string | null> {
  try {
    if (!SCRAPER_API_KEY) return null;
    const scraperUrl = buildScraperUrl(url);
    const res = await fetch(scraperUrl, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.warn('fetchPageHtml failed:', err);
    return null;
  }
}

export function parseJsonLdProducts(html: string, pageUrl: string): Partial<ScrapedProduct>[] {
  const products: Partial<ScrapedProduct>[] = [];
  try {
    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = scriptRegex.exec(html))) {
      const jsonText = match[1].trim();
      try {
        const json = JSON.parse(jsonText);
        const nodes = Array.isArray(json) ? json : [json];
        for (const node of nodes) {
          const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
          if (types && types.some((t: string) => String(t).toLowerCase() === 'product')) {
            const offers = node.offers || node.aggregateOffer || {};
            const price = Number(offers.price || offers.lowPrice || 0);
            const currency = offers.priceCurrency || 'INR';
            const ratingValue = Number(node.aggregateRating?.ratingValue || node.review?.rating || 0) || 0;
            const reviewCount = Number(node.aggregateRating?.reviewCount || 0) || 0;
            const image = Array.isArray(node.image) ? node.image[0] : node.image;
            products.push({
              id: `url_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              title: node.name || node.title,
              price: price || 0,
              currency,
              rating: ratingValue,
              reviewCount,
              image: image || '',
              url: pageUrl,
              source: 'google_shopping', // placeholder; actual domain can be inferred by caller if needed
              brand: node.brand?.name || node.brand || undefined,
              availability: (offers.availability || '').toString().split('/').pop() || 'Unknown',
              description: node.description,
            });
          }
        }
      } catch {}
    }
  } catch {}
  return products;
}

export async function llmExtractProduct(html: string, url: string): Promise<Partial<ScrapedProduct> | null> {
  const prompt = `Extract a single e-commerce product from this HTML. Return ONLY valid JSON matching:
{
  "title": string,
  "price": number,
  "currency": string,
  "brand": string,
  "rating": number,
  "reviewCount": number,
  "image": string,
  "availability": string,
  "description": string
}

HTML (truncated):\n${html.slice(0, 20000)}\nURL: ${url}`;

  try {
    const resp = await geminiService.generateResponse(prompt);
    const clean = resp.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(clean);
    return {
      id: `llm_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      title: data.title,
      price: Number(data.price) || 0,
      currency: data.currency || 'INR',
      brand: data.brand,
      rating: Number(data.rating) || 0,
      reviewCount: Number(data.reviewCount) || 0,
      image: data.image || '',
      url,
      source: 'google_shopping',
      availability: data.availability || 'Unknown',
      description: data.description,
    } as Partial<ScrapedProduct>;
  } catch (err) {
    console.warn('LLM extraction failed:', err);
    return null;
  }
}

export function normalizeToScraped(p: Partial<ScrapedProduct>, fallbackUrl: string): ScrapedProduct | null {
  if (!p.title || typeof p.price !== 'number') return null;
  return {
    id: p.id || `norm_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title: String(p.title),
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice,
    currency: p.currency || 'INR',
    rating: typeof p.rating === 'number' ? p.rating : 0,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
    image: p.image || '',
    url: p.url || fallbackUrl,
    source: p.source || 'google_shopping',
    brand: p.brand,
    availability: p.availability || 'Unknown',
    seller: p.seller,
    shipping: p.shipping,
    description: p.description,
    features: p.features,
    specifications: p.specifications,
  };
}

export function dedupeProducts(products: ScrapedProduct[]): ScrapedProduct[] {
  const seen = new Set<string>();
  const out: ScrapedProduct[] = [];
  for (const p of products) {
    const key = `${p.title.toLowerCase()}_${new URL(p.url).hostname}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}


