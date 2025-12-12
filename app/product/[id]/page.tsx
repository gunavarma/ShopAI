"use client";

import { Header } from "@/components/product-view/header";
import { ProductGallery } from "@/components/product-view/product-gallery";
import { ProductInfo } from "@/components/product-view/product-info";
import { ProductAccordions } from "@/components/product-view/product-accordions";
import { StickyActionCard } from "@/components/product-view/sticky-action-card";
import Link from "next/link";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = {
    title: "Aura Stride",
    brand: "Velocity",
    price: "$149.99",
    rating: 4.1,
    reviews: 1288,
    colors: ["Cosmic Blue", "Stellar Gray", "Solar Flare"],
    sizes: ["8", "9", "10", "11", "12"],
    specs: [
      { label: "Material", value: "FlexWeave™ Knit" },
      { label: "Weight", value: "250g (Size 10)" },
      { label: "Sole", value: "QuantumFoam™ Cushioning" },
      { label: "Best for", value: "Road Running, Gym" },
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv-NfShguwbTZygN0mG6ErEhZqUQFGT_iUQIRAPm8vROPfAo8iHxf0ZUcQ20cpQ-nSWBs7NLzloXHrZpHaqP_Ktih8RkkYJpGjh1TrOKOJWpglW2qcXSqvllVW180RWV2NR9pSqwAOG8BfqwyVIFrmBYSTeENvy5ZAEJsGI0htvKU-kmGXWAV08ShnLOKFGSjD91g9jc3VYAlFdWxm813Vpo0f4ESyCsBjot8msjI-u96HEQLqe7ueYxpQFhkP8qifxrpYiIsVmfpc",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAl025JJw0FaRT6o303UBO8AMzJr46-v-fCesMx2VqobKyZEnykHDpxCR2tPalN_ZJ0szZ1NaFXtePKgpS-KBgTzOVISEG1_Ygwif8FtwNrkx2dnx6pkSvmBYENlG7J9-Lxqk9p3ck6gzbK0gPyeaVWDV25JpmGJrlZ-rQsey7Q7XCdKCnofHKYXyK9VnzvYubMnujtm6YLdFv5akcfExzj9h8cnC1Fqnmqx_ZpdFwyS4WRV7Olmb7D-LDooLlyy8FP38sIWYDxXBNy",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIYbyXpEMI10A_h_PDmy_D6t2ZankI-GvPgKQoBmQu3wKAGQ_A8oB4BSCjtuiAOEV-C8zKkHeK9c3Afeso-0tI-b57dRRyspKJRnfDs_fY_qPTcnShOX8VcrD1vIJuDZY3o21TpvwhEFt20w3ENhH4EcQTO43IzNkgC3c22b-zIwiJnUZlQGicoinWr0SgQXa36MmvXxjLwMUt-dJApjCVOXnrXvqt2tSZPRlshNCsiWCMtMxjh8eGMskYlzlTIuoO8lqiruaUdltW",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAiPs8lwPbECXOuGof-pzf1LoqjaBzki286e04XilTNw-nHam7HXST3hWdeTKcnCLHxHfkoG4pCM8C5r0re_Kc0Ul00VgwlRuvAdtrijOYY9BAEMwdEOq1vk6R3SNty0H5kGSF4_UX1EGJaGP4kk66emvTr-pnIc2lfBMVqj_xR52VcoXIkfItx4ZxZqBM7si7s3Gu_yu01H76tkN23mwfDouMv6VH1E2m15LVcb0MuzAmu1wsRz7DFuDTwK-KY-eWdfSTWvXRqDEZ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfJoEEI8f7eiW1xe6fz-GURpJ5bupfCbeZt6GerRZ6SFN4NL-AlqPxUkr6ZUkg0TRCKM6LluUxhOcXmpeRMun_2pjJ0UQIp1qz2DoNn8N-oIxguZENhsnds4ECv0mivuHrVAhlfU_eITAEk7pvmtAuWMQnZK-i45C0JN8TBBlzvmJIcjrmmBG4Xn_iRwNyVqe-hpQeujs0y3UrFhBW5bPkEU5RgQ-vSHYz3F_xRDLol59eZrvopI0Fo16p5dH45-fW54ZVCNn9fLev",
    ],
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
      <Header />
      <main className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5 md:py-10">
          <div className="layout-content-container flex flex-col w-full max-w-[1400px] flex-1">
            <div className="flex flex-wrap gap-2 px-4 pb-4">
              <Link
                className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary"
                href="/"
              >
                Home
              </Link>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal">
                /
              </span>
              <Link
                className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary"
                href="#"
              >
                Running Shoes
              </Link>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal">
                /
              </span>
              <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">
                {product.title}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {/* Left Column: Product Gallery & Details */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <ProductGallery images={product.images} />
                <ProductInfo
                  title={product.title}
                  brand={product.brand}
                  rating={product.rating}
                  reviews={product.reviews}
                  colors={product.colors}
                  sizes={product.sizes}
                />
                <ProductAccordions specs={product.specs} />
              </div>
              {/* Right Column: Sticky Action Card */}
              <StickyActionCard price={product.price} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
