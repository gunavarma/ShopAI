"use client";

import { Star, Sparkles } from "lucide-react";
import { useState } from "react";

interface ProductInfoProps {
  title: string;
  brand: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
}

export function ProductInfo({
  title,
  brand,
  rating,
  reviews,
  colors,
  sizes,
}: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[2]); // Default to 10 for demo

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <p className="text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
            by {brand}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          Best AI Recommendation
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(rating)
                  ? "fill-current"
                  : "text-slate-300 dark:text-slate-600"
              }`}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {rating}{" "}
          <span className="text-slate-500 dark:text-slate-400">
            ({reviews.toLocaleString()} reviews)
          </span>
        </p>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Color
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex items-center justify-center h-10 px-4 rounded-full text-sm font-semibold transition-colors ${
                  selectedColor === color
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Size
          </p>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex items-center justify-center h-10 w-12 rounded-full text-sm font-semibold transition-colors ${
                  selectedSize === size
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
