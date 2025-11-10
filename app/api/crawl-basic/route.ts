import { NextRequest, NextResponse } from 'next/server';
import { crawlForProducts } from '@/lib/crawler-basic';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { query, seedDomains, maxPages, perDomainLimit, maxDepth } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const products = await crawlForProducts({
      query,
      seedDomains,
      maxPages: Math.min(60, maxPages || 40),
      perDomainLimit: Math.min(15, perDomainLimit || 8),
      maxDepth: Math.min(3, maxDepth || 2),
      requestDelayMs: 300,
    });

    return NextResponse.json({ success: true, total: products.length, products });
  } catch (err) {
    console.error('crawl-basic error', err);
    return NextResponse.json({ error: 'crawl_basic_failed' }, { status: 500 });
  }
}


