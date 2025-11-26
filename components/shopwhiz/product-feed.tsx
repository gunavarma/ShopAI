"use client";

import { motion } from "framer-motion";

interface Product {
  id?: string;
  name: string;
  brand: string;
  price: string;
  rating: string;
  reviews: string;
  img: string;
  recommended?: boolean;
}

interface ProductFeedProps {
  products: Product[];
}

export function ProductFeed({ products }: ProductFeedProps) {
  // Default products if none provided (initial state)
  const displayProducts = products.length > 0 ? products : [
    { name: "Retro High-Top Sneakers", brand: "Brand B", price: "$89.99", rating: "4.8", reviews: "345", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBljcJz1Gbi4imjE3cmJ91E35I1jSGBLyqtXYWrLjQtiJQSbJp7HRvLedDXk5su9wti8bqRWsnJ9AOh0u5XoJMPcBz_KQzUFUWoBC2zYX3KwgdzU6p5UPpiW2zumRlMTSHqA3Jej_C1qK73zOy8sIQg6d195VVZCMYTT5srFfcsZg2ClTuP4lMmgK8XQZGbhYaRcDrtP10-W5onqne1qUeWm1Q5aON1BUHSK3n39tF_ML7Dq-WfoYCHOFO3kubSPba1aGwMkJHkHgTU" },
    { name: "Organic Cotton Hoodie", brand: "Brand C", price: "$65.00", rating: "4.7", reviews: "210", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBneAHlJeaMmi8mek63qAuQ2-7sO8OeZv7LstWXxNWju34CURfuANVIilMxniLXrHC_a7Ed5k-sUIWGOl6_UomkkodpClNB7dJs6Wfwe6RgVnSUgrE_H9e9f7TtZfUi4uW-gglOPf2ZqkF_B5L6ISwgRfq1hsmgfHeaF5gTfYQtXGyz8tnssNceyMRqm3-GALhoBLCfLsL9TY47X8INtLuA7ejr-9q4oqKvohIoy0QtjNC4aT7rYd6hl5cQUn-aH7ZADnU48p3045h_", recommended: true },
    { name: "Smart Fitness Watch", brand: "Brand D", price: "$199.99", rating: "4.9", reviews: "550", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAILQ1aeZrHM6Lfw5TEIqBhu7N-oFptM0tWS1_MzPVga1BtfcxE_M-MCMQ2eUoQfdG3U4ab9I60jr977notm6h1HnmTreh10XPqDjj_Cyrrq5sHX_pX8-EFs4WrsEea72IXcjQa6NVXvK9hUevbqr8L9Gti2zKzhi7uFN07n_Vhj2P5Pu9PfpkrqSDAwT8IwdmFBxiDY-GlBW0v5jK4--sD4JdZI-mXC4rIXiiYBgJd_sIP36qcvSAdoWxkTOA395ud91q5ZZp2YBXl" },
    { name: "Wireless Noise-Cancelling Headphones", brand: "Brand E", price: "$249.00", rating: "4.8", reviews: "890", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMTWrfVuCufRRGWWPbYUmJchIID9LqVMcKs8CnJ60TH-lVuyWsKYaLpFkfaOtYVgPAhHLv1sQiTwwEnI06ONQ1cqZJGC921d7Bwuoiq_HkZJKfXgYFncspOIcQba9Jatg605BoJLV6Stivded6YIMv7KK6fvdICZeUFL9sjVAzfmbECK5-uOBzPJHwEwemQGaOMWnj1pXP_K3bDUjgKpiYxisUtMWyaM8p73odFge3O68_3C43vfac56e_cs0Y6BWSAUBihHdZk95j" },
    { name: "Minimalist Leather Backpack", brand: "Brand F", price: "$150.00", rating: "4.6", reviews: "95", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9RIqu3wUbFOOzcG6LHbXbTWefpdAf9xkEQ4RFYxBy03Sdp27IxWZfEsOCHeCmWHKMGPsYiEzXBnW_qT_QHTw6XjSwTpPPqYnSpKTEBy7UBDejPd1ALTlJq-ycNi3BcgQ59xCxWJ3w3VY3Fs4OEkgdJR2BkGXbbHRUPUA-KgWFGOFPKQf59_8xQ0a2yNLYM-zB7tF14thIoUinJ28dN4THjbRZDi9BWATMBX6eaz7vqdP5XsSIIVCU-s7VHK2ayB7TBysMzNrBSKYo" },
    { name: "Linen Summer Dress", brand: "Brand G", price: "$75.00", rating: "4.5", reviews: "150", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHQjnVaIBIb2Iaa0vAYrxwNL_FG7FfmI4Nr1NScnjTb5-E-6OW17dlos-T_3qdR9Mgox-Ihbt6JQTi37XWaS76dnPACr2r7PBPOGryoU88m7COy9SblWx2QRpDiYzD9KGhxwKs_NX99hsEfjbtMj8egq6pjsZsYl7Pdf9i44-kIBUscCuOja4RvMFQXFLGPMB3miZ9Fzc9A9Gbvg7jXwxQEje9Ch1sMHEkTYjxGES8bIafQJU8e1H54ffNP2mGcc4_Ig8Fi06H7Ekq", recommended: true },
  ];

  return (
    <div className="col-span-7 flex flex-col gap-6">
      {/* Filter Chips */}
      <div className="flex gap-3 items-center overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-white gradient-accent shadow-md hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold">Category</p>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>
        {["Rating", "Gender", "Size", "Color", "Price", "Sort"].map((filter) => (
          <button key={filter} className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/60 px-4 hover:bg-white/90 transition-colors shadow-sm">
            <p className="text-[#151118] text-sm font-medium">{filter}</p>
            <span className="material-symbols-outlined text-base text-[#151118]">expand_more</span>
          </button>
        ))}
      </div>

      {/* Brand Carousel */}
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2">
        <div className="flex items-stretch gap-4">
          {[
            { rating: "4.8", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4f1YzZduq408YzZoZwGtNi89N2_zkA6wgabzmbNcjos5vZ9eDmrV9R5DPVtSrGPSvr9cSYBjpPuOp9-yox6dJtHSeH8SmJYXHeSD1IE43sHnd9_6bXFxi9hpg54u6cL2ZqqFlVODgAhTcPiN2SLbVI-x1MuntIi8hyMO6cYQQ9aGk4AmJzfxo1wwqn3e7OPhGDre0o_GT6rVvHVdvHyIBYGu6MvT6EC6utT8LPNjvFlDeQBdXpmkGWVIFnfXV8gXEBk-JwxznGqfk" },
            { rating: "4.7", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4f1YzZduq408YzZoZwGtNi89N2_zkA6wgabzmbNcjos5vZ9eDmrV9R5DPVtSrGPSvr9cSYBjpPuOp9-yox6dJtHSeH8SmJYXHeSD1IE43sHnd9_6bXFxi9hpg54u6cL2ZqqFlVODgAhTcPiN2SLbVI-x1MuntIi8hyMO6cYQQ9aGk4AmJzfxo1wwqn3e7OPhGDre0o_GT6rVvHVdvHyIBYGu6MvT6EC6utT8LPNjvFlDeQBdXpmkGWVIFnfXV8gXEBk-JwxznGqfk" },
            { rating: "4.5", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4f1YzZduq408YzZoZwGtNi89N2_zkA6wgabzmbNcjos5vZ9eDmrV9R5DPVtSrGPSvr9cSYBjpPuOp9-yox6dJtHSeH8SmJYXHeSD1IE43sHnd9_6bXFxi9hpg54u6cL2ZqqFlVODgAhTcPiN2SLbVI-x1MuntIi8hyMO6cYQQ9aGk4AmJzfxo1wwqn3e7OPhGDre0o_GT6rVvHVdvHyIBYGu6MvT6EC6utT8LPNjvFlDeQBdXpmkGWVIFnfXV8gXEBk-JwxznGqfk" },
            { rating: "4.4", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4f1YzZduq408YzZoZwGtNi89N2_zkA6wgabzmbNcjos5vZ9eDmrV9R5DPVtSrGPSvr9cSYBjpPuOp9-yox6dJtHSeH8SmJYXHeSD1IE43sHnd9_6bXFxi9hpg54u6cL2ZqqFlVODgAhTcPiN2SLbVI-x1MuntIi8hyMO6cYQQ9aGk4AmJzfxo1wwqn3e7OPhGDre0o_GT6rVvHVdvHyIBYGu6MvT6EC6utT8LPNjvFlDeQBdXpmkGWVIFnfXV8gXEBk-JwxznGqfk" },
            { rating: "4.9", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4f1YzZduq408YzZoZwGtNi89N2_zkA6wgabzmbNcjos5vZ9eDmrV9R5DPVtSrGPSvr9cSYBjpPuOp9-yox6dJtHSeH8SmJYXHeSD1IE43sHnd9_6bXFxi9hpg54u6cL2ZqqFlVODgAhTcPiN2SLbVI-x1MuntIi8hyMO6cYQQ9aGk4AmJzfxo1wwqn3e7OPhGDre0o_GT6rVvHVdvHyIBYGu6MvT6EC6utT8LPNjvFlDeQBdXpmkGWVIFnfXV8gXEBk-JwxznGqfk" },
            { rating: "4.7", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4f1YzZduq408YzZoZwGtNi89N2_zkA6wgabzmbNcjos5vZ9eDmrV9R5DPVtSrGPSvr9cSYBjpPuOp9-yox6dJtHSeH8SmJYXHeSD1IE43sHnd9_6bXFxi9hpg54u6cL2ZqqFlVODgAhTcPiN2SLbVI-x1MuntIi8hyMO6cYQQ9aGk4AmJzfxo1wwqn3e7OPhGDre0o_GT6rVvHVdvHyIBYGu6MvT6EC6utT8LPNjvFlDeQBdXpmkGWVIFnfXV8gXEBk-JwxznGqfk" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl min-w-24 glassmorphism hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-center bg-no-repeat aspect-square bg-cover rounded-full" style={{ backgroundImage: `url("${item.img}")` }}></div>
              <p className="text-[#151118] text-sm font-medium">{item.rating} ★</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Comparison - Only show if no specific products from search, or keep as static/demo for now */}
      {products.length === 0 && (
        <div className="flex items-center gap-4 p-4 rounded-xl glassmorphism shadow-sm">
          <div className="flex-1 flex flex-col gap-2 p-2 rounded-lg bg-white/30 relative">
            <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGFV3kcV7nYNfM7n81EoJrmgPa9-YnxkQ_-5y8VMF6oG-n8FzC70PjWfjj-Bgs6HtbX1B8GC9etBOPrewicW7M9E78h_5j37tloDEX77P7w-kly1UDZMp_Y5fSpr1Zqwd2gqWs8V34CNFnFLaec52KJPKNfMdXoNQa7SPi9-vNkNyCrNXLZZS1o7O1w3DEeSm4YnZUYP5s6rEywUpNkZQ1k67V41-eCjxC70PFmChBQuOVKB8RGp6Vqpr8-FkQJ98HmDfjlsB2FuzX")' }}></div>
            <div>
              <p className="font-semibold">Patterned Puffer Jacket</p>
              <p className="text-sm text-gray-600">$129.99, 4.5 ★ (120)</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold">vs</p>
            <button className="text-white text-sm font-semibold py-2 px-4 rounded-full gradient-accent shadow-lg hover:shadow-xl transition-shadow">Compare</button>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-2 rounded-lg bg-white/30 relative">
            <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPQuDtTyAREgkItsnAaCAZRDzj6QGfEAuCl19UB7nRQ6m6bR8yj0xr1dBeYJYVEDyMIst8X3ip6OmToJ0LTcATAyWN9eCgkZnxQ9Q1eWbdVnZy6kmIquzTKcnKyB41WhmTDCw_fHKRTrVIVzh9RiL2l-tHcJO0_nKRaFsTq-RXDIe9s1ZUX9xly7wHu56xaLTkY6DGqnC_3U9kjc0xejhHjPSpnkry6WWAGtomcevzPLTJngTdRItblEcBkhAB7l57kBMdDpr1Y5B-")' }}></div>
            <div>
              <p className="font-semibold">Solid Color Puffer</p>
              <p className="text-sm text-gray-600">$119.99, 4.6 ★ (150)</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-6">
        {displayProducts.map((item, i) => (
          <motion.div 
            key={i} 
            className="flex flex-col gap-3 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="relative w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url("${item.img}")` }}>
              {item.recommended && (
                <div className="absolute top-3 left-3 bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">AI Recommended</div>
              )}
              <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm text-gray-800 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-xl">{item.recommended ? 'favorite' : 'favorite_border'}</span>
              </button>
            </div>
            <div>
              <p className="font-semibold text-[#151118]">{item.name}</p>
              <p className="text-sm text-gray-600">{item.brand}</p>
              <p className="text-sm text-gray-600">{item.price}, {item.rating} ★ ({item.reviews})</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
