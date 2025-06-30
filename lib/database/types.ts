// Database types for ShopWhiz application

export interface DatabaseProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    currency: string;
    language: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  product_image: string;
  current_price: number;
  original_price?: number;
  target_price?: number;
  category: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  availability: string;
  alert_enabled: boolean;
  product_url?: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  product_image: string;
  price: number;
  original_price?: number;
  quantity: number;
  category: string;
  rating: number;
  in_stock: boolean;
  product_url?: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total_amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  shipping_address: {
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  tracking_number?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  product_image: string;
  price: number;
  quantity: number;
  category: string;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  wishlist_item_id: string;
  target_price: number;
  alert_type: 'drops_below' | 'percentage_discount';
  percentage?: number;
  is_active: boolean;
  last_checked: string;
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: number;
    products?: any[];
    metadata?: any;
  }>;
  last_message: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductView {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  category: string;
  price: number;
  source: string;
  viewed_at: string;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  category?: string;
  results_count: number;
  clicked_product_id?: string;
  created_at: string;
}