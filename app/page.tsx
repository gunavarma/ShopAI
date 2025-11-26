"use client";

import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/shopwhiz/sidebar-nav";
import { ProductFeed } from "@/components/shopwhiz/product-feed";
import { ChatPanel } from "@/components/shopwhiz/chat-panel";
import { Message } from "@/types/chat";
import { EnhancedAIAssistant } from "@/lib/ai-responses-enhanced";
import { EnhancedRealtimeProduct } from "@/lib/realtime-products-enhanced";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm ShopWhiz, your smart shopping assistant. Tell me what you're looking for and I'll find the best options with live prices and reviews.",
      role: "assistant",
      timestamp: Date.now(),
    },
  ]);
  const [products, setProducts] = useState<any[]>([]); // Using any[] to allow mapping
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: "typing",
      content: "",
      role: "assistant",
      timestamp: Date.now(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await EnhancedAIAssistant.processQuery(content);

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

      if (response.products) {
        // Map EnhancedRealtimeProduct to the format expected by ProductFeed
        const mappedProducts = response.products.map((p: EnhancedRealtimeProduct) => ({
          name: p.name,
          brand: p.brand,
          price: `₹${p.price}`, // Assuming price is number
          rating: p.rating.toString(),
          reviews: p.reviewCount.toString(),
          img: p.image,
          recommended: p.sentiment === 'positive'
        }));
        setProducts(mappedProducts);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: "assistant",
        timestamp: Date.now(),
        hasProducts: response.products && response.products.length > 0,
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while searching. Please try again.",
        role: "assistant",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full px-8 py-3 glassmorphism">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8 text-[#151118]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-[#151118]">Shopwhiz</h2>
          </div>
          <div className="flex-1 max-w-2xl">
            <label className="flex w-full items-center rounded-full h-12 bg-white/60 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50">
              <div className="text-gray-500 flex items-center justify-center pl-5">
                <span className="material-symbols-outlined">spark</span>
              </div>
              <input 
                className="form-input flex-1 w-full min-w-0 resize-none overflow-hidden rounded-full text-[#151118] focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 px-4 text-base" 
                placeholder="Ask or search anything — e.g., ‘patterned puffer jackets’" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/50 text-[#151118] hover:bg-white/80 transition-colors">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/50 text-[#151118] hover:bg-white/80 transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/50 text-[#151118] hover:bg-white/80 transition-colors">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Side Navigation */}
          <SidebarNav />

          {/* Center Column: Products */}
          <ProductFeed products={products} />

          {/* Right Column: AI Chat Panel */}
          <ChatPanel 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-10 p-6 bg-gradient-to-t from-gray-900/40 to-transparent">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-sm text-gray-800">
          <p>© 2024 Shopwhiz, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="hover:underline" href="#">Support</a>
            <a className="hover:underline" href="#">Privacy Policy</a>
            <div className="flex gap-4">
              <a className="text-gray-600 hover:text-gray-900" href="#">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z"></path></svg>
              </a>
              <a className="text-gray-600 hover:text-gray-900" href="#">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

