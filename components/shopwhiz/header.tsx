"use client";

import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full px-8 py-3 glassmorphism bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <svg className="h-8 w-8 text-[#151118]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
          </svg>
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-[#151118]">Shopwhiz</h2>
        </div>
        <div className="flex-1 max-w-2xl">
          <label className="flex w-full items-center rounded-full h-12 bg-gray-100/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all">
            <div className="text-gray-500 flex items-center justify-center pl-5">
              <span className="material-symbols-outlined">spark</span>
            </div>
            <input 
              className="form-input flex-1 w-full min-w-0 resize-none overflow-hidden rounded-full text-[#151118] focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 px-4 text-base" 
              placeholder="Ask or search anything — e.g., ‘patterned puffer jackets’" 
            />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100/50 text-[#151118] hover:bg-gray-200/50 transition-colors">
            <span className="material-symbols-outlined">language</span>
          </button>
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100/50 text-[#151118] hover:bg-gray-200/50 transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100/50 text-[#151118] hover:bg-gray-200/50 transition-colors">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </header>
  );
}
