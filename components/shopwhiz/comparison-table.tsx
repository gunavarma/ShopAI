"use client";

import { Check, X, Trophy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COMPARISON_DATA = {
  features: [
    { id: "price", label: "Price" },
    { id: "rating", label: "Rating" },
    { id: "battery", label: "Battery Life" },
    { id: "noise_cancellation", label: "Noise Cancellation" },
    { id: "connectivity", label: "Connectivity" },
    { id: "weight", label: "Weight" },
  ],
  products: [
    {
      id: "1",
      name: "Sony WH-1000XM5",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200",
      price: "$348",
      rating: "4.8/5",
      battery: "30 Hours",
      noise_cancellation: "Industry Leading",
      connectivity: "Bluetooth 5.2",
      weight: "250g",
      isWinner: true,
      aiSummary: "Best overall choice for noise cancellation and comfort."
    },
    {
      id: "2",
      name: "Bose QC45",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=200",
      price: "$329",
      rating: "4.6/5",
      battery: "24 Hours",
      noise_cancellation: "Excellent",
      connectivity: "Bluetooth 5.1",
      weight: "240g",
      isWinner: false,
      aiSummary: "Great comfort, but slightly less battery life."
    },
    {
      id: "3",
      name: "AirPods Max",
      image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=200",
      price: "$549",
      rating: "4.7/5",
      battery: "20 Hours",
      noise_cancellation: "Excellent",
      connectivity: "Bluetooth 5.0",
      weight: "385g",
      isWinner: false,
      aiSummary: "Premium build, but heavier and more expensive."
    }
  ]
};

export function ComparisonTable() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compare Products</h1>
          <p className="text-muted-foreground">AI-powered detailed comparison to help you decide.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <AlertCircle className="w-4 h-4" />
          How we compare
        </Button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="p-6 text-left w-48 bg-white/5 backdrop-blur-sm sticky left-0 z-10 border-b border-white/10">
                  <span className="font-semibold text-lg">Features</span>
                </th>
                {COMPARISON_DATA.products.map((product) => (
                  <th key={product.id} className="p-6 min-w-[250px] border-b border-white/10 relative group">
                    {product.isWinner && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-bounce">
                        <Trophy className="w-3 h-3" />
                        AI Winner
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-4 pt-4">
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white p-2 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-xl mt-1">{product.price}</p>
                      </div>
                      <Button 
                        className={cn(
                          "w-full rounded-xl",
                          product.isWinner 
                            ? "bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20" 
                            : "bg-white/10 hover:bg-white/20 text-foreground"
                        )}
                      >
                        {product.isWinner ? "Buy Now" : "Select"}
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* AI Summary Row */}
              <tr>
                <td className="p-6 font-medium text-muted-foreground bg-white/5 backdrop-blur-sm sticky left-0 z-10 border-b border-white/10">
                  AI Verdict
                </td>
                {COMPARISON_DATA.products.map((product) => (
                  <td key={product.id} className="p-6 border-b border-white/10 bg-white/5">
                    <p className="text-sm leading-relaxed italic text-muted-foreground">
                      "{product.aiSummary}"
                    </p>
                  </td>
                ))}
              </tr>

              {/* Feature Rows */}
              {COMPARISON_DATA.features.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? "bg-white/5" : ""}>
                  <td className="p-6 font-medium bg-white/5 backdrop-blur-sm sticky left-0 z-10 border-b border-white/10">
                    {feature.label}
                  </td>
                  {COMPARISON_DATA.products.map((product) => (
                    <td key={product.id} className="p-6 text-center border-b border-white/10">
                      <span className="font-medium">
                        {(product as any)[feature.id]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
