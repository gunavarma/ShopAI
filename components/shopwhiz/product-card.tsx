"use client";

import { useState } from "react";
import { Star, Heart, ArrowRightLeft, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  aiScore?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold shadow-lg">
          {product.badge}
        </div>
      )}

      {/* AI Score */}
      {product.aiScore && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-1 shadow-lg">
          <span className="text-emerald-500">★</span>
          <span>{product.aiScore}/10 AI Score</span>
        </div>
      )}

      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button size="icon" variant="secondary" className="rounded-full bg-white text-black hover:bg-blue-50">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white text-black hover:bg-blue-50">
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white text-black hover:bg-blue-50">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="ml-1 font-medium text-foreground">{product.rating}</span>
              </div>
              <span>({product.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
          <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
