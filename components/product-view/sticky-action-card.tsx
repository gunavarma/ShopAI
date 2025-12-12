"use client";

import { Truck } from "lucide-react";

interface StickyActionCardProps {
  price: string;
}

export function StickyActionCard({ price }: StickyActionCardProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-28">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col gap-6">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {price}
            </span>
            <span className="text-green-500 text-sm font-bold">In Stock</span>
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full flex items-center justify-center h-12 px-6 rounded-full bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors">
              Buy Now
            </button>
            <button className="w-full flex items-center justify-center h-12 px-6 rounded-full bg-primary/10 text-primary text-base font-bold hover:bg-primary/20 transition-colors">
              Add to Cart
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Truck className="w-5 h-5" />
            <span>Free shipping on orders over $50.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
