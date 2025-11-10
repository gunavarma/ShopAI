import { parseJsonLdProducts, normalizeToScraped, dedupeProducts } from '@/lib/crawler';
import type { ScrapedProduct } from '@/lib/scraper-api';

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function fetchText(url: string, timeoutMs = 20000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8',
      },
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html') && !ct.includes('xml')) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const aTagRegex = /<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = aTagRegex.exec(html))) {
    const href = match[1];
    try {
      const abs = new URL(href, baseUrl).toString();
      links.push(abs);
    } catch {}
  }
  return Array.from(new Set(links));
}

async function getRobots(domain: string): Promise<string | null> {
  return await fetchText(`https://${domain}/robots.txt`, 10000);
}

function buildDisallowSet(robots: string | null): string[] {
  if (!robots) return [];
  const disallows: string[] = [];
  const lines = robots.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    // Very naive: honor global or User-agent: * rules only
    if (/^disallow:/i.test(trimmed)) {
      const path = trimmed.split(':')[1]?.trim() || '';
      if (path) disallows.push(path);
    }
  }
  return disallows;
}

function isAllowedByRobots(url: string, disallows: string[]): boolean {
  try {
    const u = new URL(url);
    const path = u.pathname;
    for (const rule of disallows) {
      if (rule === '/') return false;
      if (rule !== '' && path.startsWith(rule)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function looksLikeProductUrl(url: string): boolean {
  const u = url.toLowerCase();
  return (
    u.includes('/product') ||
    u.includes('/dp/') ||
    u.includes('/p/') ||
    u.includes('/item/') ||
    u.includes('/sku/') ||
    u.match(/\/(?:[a-z0-9-]+){3,}\/?$/) !== null
  );
}

const CATEGORY_SEEDS: Record<string, string[]> = {
  smartphone: ['amazon.in', 'flipkart.com', 'croma.com', 'reliancedigital.in', 'vijaysales.com'],
  laptop: ['amazon.in', 'flipkart.com', 'croma.com', 'reliancedigital.in'],
  headphones: ['amazon.in', 'flipkart.com', 'croma.com'],
  smartwatch: ['amazon.in', 'flipkart.com', 'croma.com'],
  camera: ['amazon.in', 'flipkart.com'],
  shoes: ['myntra.com', 'ajio.com', 'amazon.in', 'flipkart.com'],
  clothing: ['myntra.com', 'ajio.com', 'amazon.in'],
  monitor: ['amazon.in', 'flipkart.com', 'reliancedigital.in'],
};

function detectCategory(query: string): string | null {
  const q = query.toLowerCase();
  for (const k of Object.keys(CATEGORY_SEEDS)) {
    if (q.includes(k)) return k;
  }
  if (q.includes('phone') || q.includes('mobile')) return 'smartphone';
  return null;
}

export async function crawlForProducts(options: {
  query: string;
  seedDomains?: string[];
  maxPages?: number;
  perDomainLimit?: number;
  maxDepth?: number;
  requestDelayMs?: number;
}): Promise<ScrapedProduct[]> {
  const {
    query,
    seedDomains,
    maxPages = 40,
    perDomainLimit = 10,
    maxDepth = 2,
    requestDelayMs = 300,
  } = options;

  const category = detectCategory(query);
  const seeds = seedDomains && seedDomains.length > 0
    ? seedDomains
    : category
      ? CATEGORY_SEEDS[category]
      : ['amazon.in', 'flipkart.com'];

  const startUrls = seeds.map((d) => `https://${d}/`);
  const domainRobots: Record<string, string[]> = {};
  const visited = new Set<string>();
  const perDomainCount: Record<string, number> = {};
  const queue: Array<{ url: string; depth: number }> = [];
  const products: ScrapedProduct[] = [];

  for (const u of startUrls) queue.push({ url: u, depth: 0 });

  while (queue.length > 0 && visited.size < maxPages) {
    const { url, depth } = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    const domain = getDomain(url);
    perDomainCount[domain] = (perDomainCount[domain] || 0) + 1;
    if (perDomainCount[domain] > perDomainLimit) continue;

    if (!domainRobots[domain]) {
      const robotsTxt = await getRobots(domain);
      domainRobots[domain] = buildDisallowSet(robotsTxt);
    }
    if (!isAllowedByRobots(url, domainRobots[domain])) continue;

    const html = await fetchText(url);
    if (!html) continue;

    // Extract products via JSON-LD first
    const partials = parseJsonLdProducts(html, url);
    for (const p of partials) {
      const normalized = normalizeToScraped(p as any, url);
      if (normalized) products.push(normalized);
    }

    // Heuristic: attempt meta extraction if no JSON-LD and looks like product URL
    if (partials.length === 0 && looksLikeProductUrl(url)) {
      const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) ||
        html.match(/<title>([^<]+)<\/title>/i);
      const priceMatch = html.match(/(?:₹|Rs\.?|INR|\$|USD)\s?([\d,]+(?:\.\d+)?)/i);
      const imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i);
      const title = titleMatch ? (titleMatch[1] || '').trim() : '';
      const price = priceMatch ? Number((priceMatch[1] || '').replace(/,/g, '')) : 0;
      if (title && price > 0) {
        products.push({
          id: `basic_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          title,
          price,
          currency: 'INR',
          rating: 0,
          reviewCount: 0,
          image: imageMatch ? imageMatch[1] : '',
          url,
          source: 'google_shopping',
          availability: 'Unknown',
        } as ScrapedProduct);
      }
    }

    // Enqueue next links
    if (depth < maxDepth) {
      const links = extractLinks(html, url)
        .filter((l) => getDomain(l) === domain); // stay within domain
      for (const l of links) {
        if (!visited.has(l)) queue.push({ url: l, depth: depth + 1 });
      }
    }

    if (requestDelayMs > 0) await sleep(requestDelayMs);
  }

  return dedupeProducts(products).slice(0, maxPages);
}


