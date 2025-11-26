"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedColor, setSelectedColor] = useState("Midnight Blue");
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeAccordion, setActiveAccordion] = useState<string | null>("specs");

  const product = {
    title: "Neo-Tokyo Streetwear Bomber",
    brand: "Urban Zen",
    price: "$189.00",
    rating: 4.8,
    reviews: 420,
    stock: "In Stock",
    description: "Experience the fusion of traditional craftsmanship and futuristic aesthetics. This bomber jacket features water-resistant smart fabric, adaptive thermal regulation, and a silhouette inspired by the neon-lit streets of Tokyo.",
    colors: ["Midnight Blue", "Cyber Punk Pink", "Matrix Green"],
    sizes: ["XS", "S", "M", "L", "XL"],
    specs: [
      { label: "Material", value: "Smart-Tech Nylon Blend" },
      { label: "Fit", value: "Oversized Street Fit" },
      { label: "Care", value: "Machine Wash Cold" },
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBljcJz1Gbi4imjE3cmJ91E35I1jSGBLyqtXYWrLjQtiJQSbJp7HRvLedDXk5su9wti8bqRWsnJ9AOh0u5XoJMPcBz_KQzUFUWoBC2zYX3KwgdzU6p5UPpiW2zumRlMTSHqA3Jej_C1qK73zOy8sIQg6d195VVZCMYTT5srFfcsZg2ClTuP4lMmgK8XQZGbhYaRcDrtP10-W5onqne1qUeWm1Q5aON1BUHSK3n39tF_ML7Dq-WfoYCHOFO3kubSPba1aGwMkJHkHgTU", // Placeholder
    ]
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EAF2FF] via-[#F3E8FF] to-[#FFF7F0] font-sans text-[#151118] pb-20">
      {/* Header (Simplified for PDP) */}
      <header className="sticky top-0 z-50 w-full px-8 py-4 glassmorphism mb-8">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
            <span className="font-medium">Back to Shopping</span>
          </Link>
          <div className="flex items-center gap-4">
             <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <span className="material-symbols-outlined">favorite_border</span>
             </button>
             <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <span className="material-symbols-outlined">share</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-8 grid grid-cols-12 gap-10">
        {/* Left Column: Hero & Details */}
        <div className="col-span-8 flex flex-col gap-8">
          
          {/* Hero Image Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden shadow-xl group"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url("${product.images[0]}")` }}
            />
            <div className="absolute top-6 left-6">
               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-sm font-bold text-[#151118] shadow-sm">
                  <span className="material-symbols-outlined text-lg text-primary">auto_awesome</span>
                  Best AI Recommendation
               </span>
            </div>
          </motion.div>

          {/* Product Info Card */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="p-8 rounded-[32px] bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-medium text-gray-600 mb-1">{product.brand}</h3>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">{product.title}</h1>
                  <div className="flex items-center gap-2 text-sm">
                     <div className="flex text-yellow-500">
                        {[1,2,3,4,5].map(i => (
                           <span key={i} className="material-symbols-outlined text-[20px] fill-current">
                              {i <= Math.floor(product.rating) ? 'star' : 'star_border'}
                           </span>
                        ))}
                     </div>
                     <span className="font-medium">{product.rating}</span>
                     <span className="text-gray-500">({product.reviews} reviews)</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{product.price}</p>
                  <p className="text-green-600 font-medium flex items-center justify-end gap-1 mt-1">
                     <span className="material-symbols-outlined text-lg">check_circle</span>
                     {product.stock}
                  </p>
               </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
               {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-6">
               <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Select Color</p>
                  <div className="flex flex-wrap gap-3">
                     {product.colors.map(color => (
                        <button
                           key={color}
                           onClick={() => setSelectedColor(color)}
                           className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                              selectedColor === color 
                                 ? 'bg-[#151118] text-white shadow-lg scale-105' 
                                 : 'bg-white/50 text-gray-700 hover:bg-white/80'
                           }`}
                        >
                           {color}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-3">
                     {product.sizes.map(size => (
                        <button
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                              selectedSize === size 
                                 ? 'bg-[#151118] text-white shadow-lg scale-105' 
                                 : 'bg-white/50 text-gray-700 hover:bg-white/80'
                           }`}
                        >
                           {size}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Accordions */}
          <div className="space-y-4">
             {['specs', 'reviews', 'qa'].map((section, idx) => (
                <motion.div
                   key={section}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 + idx * 0.1 }}
                   className="rounded-[24px] bg-white/60 backdrop-blur-md border border-white/40 overflow-hidden shadow-sm"
                >
                   <button 
                      onClick={() => toggleAccordion(section)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/40 transition-colors"
                   >
                      <span className="text-xl font-bold capitalize">
                         {section === 'qa' ? 'Q&A' : section === 'specs' ? 'Specifications' : 'Reviews'}
                      </span>
                      <span className={`material-symbols-outlined transition-transform duration-300 ${activeAccordion === section ? 'rotate-180' : ''}`}>
                         expand_more
                      </span>
                   </button>
                   <AnimatePresence>
                      {activeAccordion === section && (
                         <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-8 pb-8"
                         >
                            {section === 'specs' && (
                               <div className="grid grid-cols-2 gap-4">
                                  {product.specs.map((spec, i) => (
                                     <div key={i} className="p-4 rounded-xl bg-white/50">
                                        <p className="text-sm text-gray-500">{spec.label}</p>
                                        <p className="font-medium">{spec.value}</p>
                                     </div>
                                  ))}
                               </div>
                            )}
                            {section === 'reviews' && (
                               <div className="space-y-4">
                                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50">
                                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
                                     <div>
                                        <div className="flex items-center gap-2">
                                           <span className="font-bold">John Doe</span>
                                           <div className="flex text-yellow-500 text-sm">★★★★★</div>
                                        </div>
                                        <p className="text-gray-600 text-sm">Absolutely love the fit and material. Feels very premium.</p>
                                     </div>
                                  </div>
                               </div>
                            )}
                            {section === 'qa' && (
                               <p className="text-gray-600">No questions yet. Be the first to ask!</p>
                            )}
                         </motion.div>
                      )}
                   </AnimatePresence>
                </motion.div>
             ))}
          </div>
        </div>

        {/* Right Column: Sticky Buy Card */}
        <div className="col-span-4 relative">
           <div className="sticky top-32">
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3 }}
                 className="p-8 rounded-[32px] bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl"
              >
                 <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600">
                       <span>Subtotal</span>
                       <span>{product.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                       <span>Shipping</span>
                       <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between text-xl font-bold">
                       <span>Total</span>
                       <span>{product.price}</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <button className="w-full py-4 rounded-full bg-[#151118] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined">shopping_bag</span>
                       Add to Cart
                    </button>
                    <button className="w-full py-4 rounded-full bg-primary/10 text-primary font-bold text-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined">flash_on</span>
                       Buy Now
                    </button>
                 </div>

                 <div className="mt-8 flex items-center gap-3 text-sm text-gray-500 justify-center">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                    <span>Secure transaction</span>
                 </div>
              </motion.div>
           </div>
        </div>
      </main>
    </div>
  );
}
