# ShopWhiz - AI-Powered Shopping Assistant

A modern e-commerce chatbot powered by Google's Gemini AI that helps users find the perfect products through conversational interactions.

## Features

- **AI-Powered Chat**: Conversational shopping assistant using Gemini AI
- **Real-Time Product Data**: Live product information from Google Shopping and Amazon India
- **Smart Product Discovery**: Intelligent product filtering and recommendations
- **Interactive Quiz**: Personalized product recommendations based on user preferences
- **Product Comparison**: AI-generated product comparisons and insights
- **Modern Payment Flow**: Clean, professional checkout experience
- **Responsive Design**: Mobile-first design with dark/light mode support
- **Real-time Animations**: Smooth interactions using Framer Motion

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: Google Gemini AI API
- **Data Scraping**: ScraperAPI for real-time product data
- **Animations**: Framer Motion
- **Payments**: Stripe (test mode)
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd shopwhiz-chatbot
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required - Gemini AI API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional - ScraperAPI Key (for real-time product data)
SCRAPER_API_KEY=your_scraper_api_key_here

# Optional - Stripe Keys (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### 3. Get API Keys

#### Gemini AI (Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

#### ScraperAPI (Optional - for real-time data)
1. Visit [ScraperAPI](https://www.scraperapi.com/)
2. Sign up for a free account (1,000 requests/month)
3. Get your API key from the dashboard
4. Add it to your `.env.local` file as `SCRAPER_API_KEY`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Real-Time Product Data

The app uses a hybrid approach for product data:

### With ScraperAPI (Recommended)
- **Live Pricing**: Current market prices from Google Shopping and Amazon India
- **Real Availability**: Actual stock status and shipping information
- **Genuine Reviews**: Real customer ratings and review counts
- **Multiple Sources**: Combines data from multiple e-commerce platforms

### Without ScraperAPI (Fallback)
- **AI-Generated Products**: Intelligent product suggestions using Gemini AI
- **Realistic Data**: AI creates believable product information
- **Always Available**: Works even without real-time data access

## API Routes

### `/api/scrape` (POST)
Server-side proxy for ScraperAPI to avoid CORS issues and secure API keys.

**Request Body:**
```json
{
  "url": "https://www.amazon.in/s?k=laptop",
  "source": "amazon"
}
```

**Response:**
```json
{
  "html": "<html>...</html>",
  "success": true,
  "source": "amazon"
}
```

## Security Features

- **Server-Side API Keys**: ScraperAPI key is never exposed to the client
- **CORS Protection**: All external API calls go through server-side proxy
- **Rate Limiting**: Efficient use of API quotas
- **Error Handling**: Graceful fallback to AI-generated data

## Project Structure

```
├── app/
│   ├── api/scrape/          # Server-side scraping proxy
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── chat/                # Chat-related components
│   ├── payment/             # Payment modal
│   ├── product/             # Product components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── scraper-api.ts       # ScraperAPI service
│   ├── gemini.ts            # Gemini AI service
│   └── ai-responses-enhanced.ts # Enhanced AI responses
└── types/                   # TypeScript definitions
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Optional (enables real-time product data)
SCRAPER_API_KEY=your_scraper_api_key

# Optional (for Stripe payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## Deployment

The app is configured for static export and can be deployed to any hosting service that supports API routes:

```bash
npm run build
```

**Note**: For static hosting (like Netlify/Vercel), the `/api/scrape` route will work automatically. For other hosting providers, ensure they support Next.js API routes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.