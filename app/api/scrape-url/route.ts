import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type ProductJSONLD = {
  '@type'?: string | string[];
  name?: string;
  image?: string | string[];
  description?: string;
  brand?: { name?: string } | string;
  sku?: string;
  gtin13?: string;
  aggregateRating?: { ratingValue?: number; reviewCount?: number };
  review?: Array<{
    reviewRating?: { ratingValue?: number };
    author?: { name?: string } | string;
    datePublished?: string;
    reviewBody?: string;
  }>;
  offers?: {
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
    seller?: { name?: string };
    url?: string;
  } | Array<any>;
  additionalProperty?: Array<{ name?: string; value?: string }>;
  additionalType?: any;
  category?: string;
  material?: string;
  color?: string;
  itemCondition?: string;
  depth?: any;
  height?: any;
  width?: any;
  weight?: any;
  additionalPropertyValue?: any;
  [key: string]: any;
};

function extractBetween(html: string, start: string, end: string): string | null {
  const si = html.indexOf(start);
  if (si === -1) return null;
  const ei = html.indexOf(end, si + start.length);
  if (ei === -1) return null;
  return html.substring(si + start.length, ei);
}

function extractMetaContent(html: string, property: string): string | undefined {
  const re = new RegExp(`<meta[^>]+property=["']${property}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  if (!tag) return undefined;
  const contentMatch = tag.match(/content=["']([^"']+)["']/i);
  return contentMatch?.[1];
}

function extractJSONLDBlocks(html: string): any[] {
  const blocks: any[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const raw = match[1]
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        blocks.push(...parsed);
      } else {
        blocks.push(parsed);
      }
    } catch {
      // ignore malformed blocks
    }
  }
  return blocks;
}

function pickProductFromJSONLD(blocks: any[]): ProductJSONLD | undefined {
  for (const b of blocks) {
    const type = b['@type'];
    if (!type) continue;
    if (typeof type === 'string' && type.toLowerCase() === 'product') return b as ProductJSONLD;
    if (Array.isArray(type) && type.map((t: string) => t.toLowerCase()).includes('product')) {
      return b as ProductJSONLD;
    }
    if (b.item && (b.item['@type'] === 'Product' || (Array.isArray(b.item['@type']) && b.item['@type'].includes('Product')))) {
      return b.item as ProductJSONLD;
    }
  }
  return undefined;
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function normalizePrice(val: any): number | undefined {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = parseFloat(val.replace(/[^\d.]/g, ''));
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Valid url is required' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // OpenGraph fallbacks
    const ogTitle = extractMetaContent(html, 'og:title');
    const ogImage = extractMetaContent(html, 'og:image');
    const ogDesc = extractMetaContent(html, 'og:description');
    const twitterImage = extractMetaContent(html, 'twitter:image');

    // Try to extract JSON-LD Product schema
    const blocks = extractJSONLDBlocks(html);
    const productLD = pickProductFromJSONLD(blocks);

    // Basic title fallback
    let title = ogTitle;
    if (!title) {
      const t = extractBetween(html, '<title>', '</title>');
      title = t ? t.replace(/\s+/g, ' ').trim() : undefined;
    }

    const images: string[] = [];
    toArray(productLD?.image).forEach((i) => typeof i === 'string' && images.push(i));
    if (ogImage) images.push(ogImage);
    if (twitterImage) images.push(twitterImage);
    const uniqueImages = Array.from(new Set(images.filter(Boolean)));

    // Offers/price
    let price: number | undefined;
    let currency: string | undefined;
    let availability: string | undefined;
    let seller: string | undefined;

  const offersArr = toArray(productLD?.offers);
    if (offersArr.length > 0) {
      const o = offersArr[0];
      price = normalizePrice(o?.price);
      currency = o?.priceCurrency;
      availability = o?.availability?.split('/').pop();
      seller = o?.seller?.name;
    }

    // Rating/reviews
    const ratingValue = productLD?.aggregateRating?.ratingValue;
    const reviewCount = productLD?.aggregateRating?.reviewCount;
  const sampleReviews = toArray(productLD?.review)
    .slice(0, 3)
    .map((rev) => ({
      rating: normalizePrice(rev?.reviewRating?.ratingValue),
      text: typeof rev?.reviewBody === 'string' ? rev.reviewBody : undefined,
      reviewer:
        typeof rev?.author === 'string'
          ? rev.author
          : typeof rev?.author?.name === 'string'
          ? rev.author.name
          : undefined,
      date: typeof rev?.datePublished === 'string' ? rev.datePublished : undefined,
    }))
    .filter((r) => r.text);

    // Specifications: common patterns in JSON-LD additionalProperty
    const specs: Record<string, string> = {};
    if (Array.isArray(productLD?.additionalProperty)) {
      for (const p of productLD!.additionalProperty!) {
        if (p?.name && typeof p.name === 'string' && typeof p.value === 'string') {
          specs[p.name] = p.value;
        }
      }
    }

    // Minimal description
    const description = productLD?.description || ogDesc || undefined;

    const brand =
      typeof productLD?.brand === 'string'
        ? productLD?.brand
        : (productLD?.brand as any)?.name;

    return NextResponse.json({
      success: true,
      url,
      data: {
        title: productLD?.name || title,
        images: uniqueImages,
        description,
        brand,
        sku: productLD?.sku,
        price,
        currency,
        availability,
        seller,
        rating: typeof ratingValue === 'number' ? ratingValue : undefined,
        reviewCount: typeof reviewCount === 'number' ? reviewCount : undefined,
        specs,
        sampleReviews
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to scrape URL', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


