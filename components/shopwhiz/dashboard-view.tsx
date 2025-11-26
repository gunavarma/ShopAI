"use client";

import { Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Sony WH-1000XM5",
    price: 348,
    originalPrice: 399,
    rating: 4.8,
    reviews: 2450,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    badge: "Top Pick",
    aiScore: 9.8
  },
  {
    id: "2",
    name: "MacBook Air M2",
    price: 1099,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
    badge: "Best Value",
    aiScore: 9.5
  },
  {
    id: "3",
    name: "Nike Air Max 270",
    price: 150,
    rating: 4.7,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    aiScore: 8.9
  },
  {
    id: "4",
    name: "PlayStation 5",
    price: 499,
    rating: 4.9,
    reviews: 5600,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800",
    badge: "Trending",
    aiScore: 9.9
  }
];

const CATEGORIES = [
  { name: "Electronics", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Fashion", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Trending", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export function DashboardView() {
  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-blue-500 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Shopping v2.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Discover the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Future of Retail</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            ShopWhiz analyzes millions of products, reviews, and prices to find exactly what you need in seconds.
          </p>
          
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search for anything..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg"
            />
            <Button className="absolute right-2 top-2 bottom-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="glass-card p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.bg}`}>
              <cat.icon className={`w-6 h-6 ${cat.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">Explore collection</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">AI Recommended for You</h2>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-600">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
