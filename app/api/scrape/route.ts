import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, source } = await request.json();
    
    if (!url || !source) {
      return NextResponse.json(
        { error: 'Missing required parameters: url and source' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.SCRAPER_API_KEY;
    
    if (!API_KEY) {
      console.error('SCRAPER_API_KEY not configured');
      return NextResponse.json(
        { error: 'ScraperAPI not configured' },
        { status: 500 }
      );
    }

    // Construct ScraperAPI URL
    const scraperUrl = new URL('http://api.scraperapi.com/');
    scraperUrl.searchParams.append('api_key', API_KEY);
    scraperUrl.searchParams.append('url', url);
    scraperUrl.searchParams.append('render', 'true');
    scraperUrl.searchParams.append('country_code', 'in');
    
    // Add source-specific parameters
    if (source === 'amazon') {
      scraperUrl.searchParams.append('premium', 'true');
      scraperUrl.searchParams.append('session_number', Math.random().toString());
    }

    console.log(`Scraping ${source}:`, url);

    const response = await fetch(scraperUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`ScraperAPI returned ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html || html.length < 100) {
      throw new Error('Received empty or invalid response from ScraperAPI');
    }

    return NextResponse.json({ 
      html,
      success: true,
      source 
    });

  } catch (error) {
    console.error('ScraperAPI proxy error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown scraping error',
        success: false 
      },
      { status: 500 }
    );
  }
}