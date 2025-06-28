# ShopWhiz - AI-Powered Shopping Assistant

A modern e-commerce chatbot powered by Google's Gemini AI that helps users find the perfect products through conversational interactions.

## Features

- **AI-Powered Chat**: Conversational shopping assistant using Gemini AI
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

### 2. Configure Gemini AI

1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Gemini AI Integration

The app uses Google's Gemini AI for:

- **Query Analysis**: Understanding user intent and extracting product preferences
- **Product Recommendations**: Generating personalized product suggestions
- **Conversational Responses**: Creating natural, helpful responses
- **Quiz Processing**: Analyzing quiz answers for better recommendations
- **Product Comparisons**: Generating detailed product comparisons

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── chat/             # Chat-related components
│   ├── payment/          # Payment modal
│   ├── product/          # Product components
│   └── ui/               # shadcn/ui components
├── data/                 # Mock product data
├── lib/                  # Utility functions
│   ├── gemini.ts        # Gemini AI service
│   └── ai-responses.ts  # AI response handling
└── types/               # TypeScript type definitions
```

## Key Components

- **ChatInterface**: Main chat component with message handling
- **GeminiService**: Handles all Gemini AI API interactions
- **AIAssistant**: Processes user queries and generates responses
- **ProductCarousel**: Displays recommended products
- **PaymentModal**: Modern checkout experience
- **QuizModal**: Interactive product preference quiz

## Environment Variables

```env
# Required
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Optional (for Stripe payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## Deployment

The app is configured for static export and can be deployed to any static hosting service:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.