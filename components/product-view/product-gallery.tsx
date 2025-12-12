"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      {/* Product Image */}
      <div
        className="relative w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 transition-all duration-300"
        style={{ backgroundImage: `url("${selectedImage}")` }}
      >
        <div className="absolute bottom-4 left-4 grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`w-16 bg-center bg-no-repeat aspect-square bg-cover rounded-lg border-2 cursor-pointer transition-all ${
                selectedImage === img
                  ? "border-white dark:border-primary"
                  : "border-transparent hover:border-white/50"
              }`}
              style={{ backgroundImage: `url("${img}")` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
