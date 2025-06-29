# ShopWhiz - AI-Powered Shopping Assistant with Real-Time Data

A modern e-commerce chatbot powered by Google's Gemini AI and real-time product data from Google Shopping and Amazon India.

## 🚀 Features

### **Real-Time Product Data**
- **Live Pricing**: Current prices from Google Shopping and Amazon India
- **Real Availability**: Actual stock status and shipping information
- **Live Reviews**: Current ratings and review counts
- **Multiple Sources**: Combines data from multiple shopping platforms

### **AI-Powered Intelligence**
- **Smart Search**: Gemini AI understands natural language queries
- **Product Analysis**: AI-enhanced product descriptions and features
- **Personalized Recommendations**: Tailored suggestions based on preferences
- **Interactive Quiz**: Personalized product discovery

### **Modern Shopping Experience**
- **Brand & Price Selection**: Dynamic brand and budget filtering
- **Product Comparison**: AI-generated product comparisons
- **Payment Integration**: Secure checkout with Stripe
- **Order Tracking**: Complete order management system

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: Google Gemini AI API
- **Data Scraping**: ScraperAPI for real-time product data
- **Animations**: Framer Motion
- **Payments**: Stripe (test mode)

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase Project** - [Create free project](https://supabase.com/dashboard/new)
3. **Gemini AI API Key** - [Get free key](https://makersuite.google.com/app/apikey)
4. **ScraperAPI Key** - [Get free key](https://www.scraperapi.com/) (1,000 free requests/month)

## 🚀 Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd shopwhiz-chatbot
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key
NEXT_PUBLIC_SCRAPER_API_KEY=your_actual_scraper_api_key
```

### 3. Set Up Supabase (Required for Authentication)

#### **Create Supabase Project**
1. Visit [Supabase Dashboard](https://supabase.com/dashboard/new)
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created (2-3 minutes)

#### **Get Supabase Configuration**
1. Go to Project Settings → API
2. Copy your Project URL and Anon Key
3. Add them to your `.env.local` file

#### **Set Up Database Schema**
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/001_create_profiles_table.sql`
3. Paste and run the SQL to create the profiles table and triggers

### 4. Get API Keys

#### **Gemini AI API Key** (Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env.local` file

#### **ScraperAPI Key** (Required for real-time data)
1. Visit [ScraperAPI](https://www.scraperapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Copy the key to your `.env.local` file

### 5. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration Options

### **Authentication**
The app uses Supabase for authentication, providing:

- **Email/Password Authentication**: Secure user registration and login
- **Email Verification**: Optional email confirmation for new accounts
- **Session Management**: Automatic token refresh and persistent sessions
- **User Profiles**: Extended user data with preferences and settings
- **Row Level Security**: Database-level security for user data

### **Data Sources**
The app automatically uses the best available data source:

1. **Real-Time Data** (when ScraperAPI key is configured)
   - Live prices from Google Shopping and Amazon India
   - Current availability and shipping info
   - Real customer reviews and ratings

2. **AI-Generated Data** (fallback)
   - Realistic product recommendations from Gemini AI
   - Market-aware pricing and specifications
   - Intelligent product categorization

3. **Mixed Mode** (best experience)
   - Combines real-time data with AI enhancements
   - Enhanced product descriptions and features
   - Smart product analysis and comparisons

### **API Rate Limits**
- **Gemini AI**: Generous free tier
- **ScraperAPI**: 1,000 requests/month (free tier)
- **Automatic Fallback**: App gracefully handles rate limits

## 📁 Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── product/          # Product display components
│   ├── payment/          # Payment processing
│   └── ui/               # shadcn/ui components
├── lib/                  # Core services
│   ├── scraper-api.ts    # ScraperAPI integration
│   ├── realtime-products-enhanced.ts  # Enhanced product service
│   ├── ai-responses-enhanced.ts       # Enhanced AI responses
│   └── gemini.ts         # Gemini AI service
└── types/               # TypeScript definitions
```

## 🔍 How It Works

### **1. Real-Time Data Collection**
```typescript
// ScraperAPI searches Google Shopping and Amazon
const products = await ScraperAPIService.searchMultipleSources(query, {
  sources: ['google_shopping', 'amazon'],
  maxResults: 20,
  minPrice: 1000,
  maxPrice: 50000
});
```

### **2. AI Enhancement**
```typescript
// Gemini AI enhances scraped data with intelligent analysis
const enhanced = await EnhancedRealtimeProductService.enhanceScrapedProducts(
  scrapedProducts, 
  userQuery
);
```

### **3. Smart Responses**
```typescript
// AI generates contextual responses based on data source
const response = await EnhancedAIAssistant.processQuery(userQuery);
```

## 🎯 Key Features Explained

### **Dynamic Brand Selection**
- Gemini AI generates relevant brands based on product category
- Real-time pricing ranges for Indian market
- Popular brand identification and recommendations

### **Real-Time Product Search**
- Scrapes live data from Google Shopping and Amazon India
- Handles price filtering and sorting
- Removes duplicates and ranks by relevance

### **AI-Enhanced Product Data**
- Adds intelligent product descriptions
- Generates realistic specifications
- Creates sample reviews and ratings
- Provides pros/cons analysis

### **Fallback System**
- Graceful degradation when APIs are unavailable
- AI-generated products as backup
- Maintains user experience regardless of data source

## 🔒 Security & Privacy

- **Authentication**: Powered by Supabase with industry-standard security
- **Row Level Security**: Database-level access control
- **API Keys**: Stored securely in environment variables
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Comprehensive error management
- **Data Privacy**: User data encrypted and securely stored in Supabase

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_GEMINI_API_KEY
# - NEXT_PUBLIC_SCRAPER_API_KEY
```

### **Other Platforms**
The app works on any platform supporting Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📊 Monitoring & Analytics

### **API Usage Tracking**
- Monitor ScraperAPI usage in dashboard
- Track Gemini AI requests
- Set up alerts for rate limits

### **Performance Metrics**
- Response times for different data sources
- Success rates for product searches
- User engagement analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly with both real and AI data
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### **Common Issues**

**Authentication not working:**
- Check Supabase configuration in `.env.local`
- Verify database schema is set up correctly
- Check Supabase project status in dashboard

**No products found:**
- Check API keys in `.env.local`
- Verify ScraperAPI account status
- Try different search terms

**Slow responses:**
- ScraperAPI requests take 3-5 seconds
- AI fallback is faster
- Consider upgrading ScraperAPI plan

**Rate limits:**
- ScraperAPI: 1,000 requests/month (free)
- Gemini AI: Generous free tier
- Supabase: 50,000 monthly active users (free)
- App automatically handles limits

### **Getting Help**
- Check the [Issues](link-to-issues) page
- Review API documentation
- Test with example queries

---

**Built with ❤️ using Next.js, Supabase, Gemini AI, and ScraperAPI**