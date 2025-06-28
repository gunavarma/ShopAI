// This file now serves as a fallback and type definitions
// Real-time data is fetched from RealtimeProductService

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  brand: string;
  category: string;
  features: string[];
  pros: string[];
  cons: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  description: string;
  inStock: boolean;
}

// Fallback products for when real-time data is unavailable
export const fallbackProducts: Product[] = [
  {
    id: 'fallback-monitor-1',
    name: 'Dell 24" Full HD Monitor',
    price: 12999,
    originalPrice: 15999,
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    reviewCount: 1247,
    brand: 'Dell',
    category: 'monitor',
    features: ['Full HD 1920x1080', 'IPS Panel', '75Hz Refresh Rate', 'HDMI & VGA'],
    pros: ['Good color accuracy', 'Affordable price', 'Reliable brand'],
    cons: ['Basic stand', 'No USB-C'],
    sentiment: 'positive',
    sentimentScore: 78,
    description: 'Reliable Full HD monitor perfect for office work and casual use.',
    inStock: true,
  },
  {
    id: 'fallback-monitor-2',
    name: 'ASUS 27" Gaming Monitor',
    price: 24999,
    originalPrice: 28999,
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 892,
    brand: 'ASUS',
    category: 'monitor',
    features: ['QHD 2560x1440', '144Hz Refresh Rate', 'G-Sync Compatible', 'HDR10'],
    pros: ['Excellent for gaming', 'High refresh rate', 'Good build quality'],
    cons: ['Higher price', 'Power consumption'],
    sentiment: 'positive',
    sentimentScore: 85,
    description: 'High-performance gaming monitor with smooth gameplay experience.',
    inStock: true,
  }
];

// Legacy functions for backward compatibility
export const getProductsByCategory = (category: string): Product[] => {
  return fallbackProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return fallbackProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return fallbackProducts.filter(product => product.price >= min && product.price <= max);
};

export const getProductById = (id: string): Product | undefined => {
  return fallbackProducts.find(product => product.id === id);
};