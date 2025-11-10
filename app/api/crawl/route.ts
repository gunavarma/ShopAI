import { NextRequest, NextResponse } from 'next/server';
import { searchWeb, fetchPageHtml, parseJsonLdProducts, llmExtractProduct, normalizeToScraped, dedupeProducts } from '@/lib/crawler';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { query, limit = 10 } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    // 1) Discover URLs
    const results = await searchWeb(`${query} buy price site:com OR site:in`, Math.min(20, Math.max(5, limit * 3)));

    // 2) Fetch + extract (JSON-LD → LLM fallback)
    const extracted: any[] = [];
    for (const r of results) {
      const html = await fetchPageHtml(r.url);
      if (!html) continue;
      let partials = parseJsonLdProducts(html, r.url);
      if (partials.length === 0) {
        const llm = await llmExtractProduct(html, r.url);
        if (llm) partials = [llm];
      }
      for (const p of partials) {
        const normalized = normalizeToScraped(p as any, r.url);
        if (normalized) extracted.push(normalized);
      }
      if (extracted.length >= limit * 2) break;
    }

    // 3) Dedupe + limit
    const unique = dedupeProducts(extracted).slice(0, limit);

    return NextResponse.json({ success: true, total: unique.length, products: unique });
  } catch (err) {
    console.error('crawl route error', err);
    return NextResponse.json({ error: 'crawl_failed' }, { status: 500 });
  }
}


