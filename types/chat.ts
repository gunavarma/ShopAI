export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number; // Changed from Date to number
  products?: string[]; // Legacy support
  hasProducts?: boolean; // New flag for real-time products
  isTyping?: boolean;
  suggestedActions?: string[];
  clarifyingQuestions?: string[];
  brandSuggestions?: string[];
  needsMoreInfo?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentQuery: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
}

export interface QuizResponse {
  questionId: string;
  answer: string;
}

// Shopping Assistant Types
export interface ProductRecommendation {
  name: string;
  price: string;
  rating?: number;
  reason: string;
  merchant: string;
  buyLink?: string;
  youtubeReviewLink?: string;
  image?: string;
}

export interface ShoppingAssistantResponse {
  summary: string;
  recommendations: ProductRecommendation[];
  alternatives?: ProductRecommendation[];
  clarifyingQuestions?: string[];
  success: boolean;
}

// Enhanced Product Review Types
export interface ProductReview {
  rating: number;
  text: string;
  reviewer: string;
  date: string;
}