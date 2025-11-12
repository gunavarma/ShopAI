const stores = [
  {
    name: "Deux par Deux",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXa5GCP_EHEgeRnjw9t-qJP-7kdLqpPaClT4g0CzCzioWKju73abAWkWILGCxPIS1ktvHlZ9on0T9BoQxktIzYaiYz-x1nvqB5pmoqOFHOqe_cuuyEd9x_VkyYj0uGcSQLSdlnc3PrBIgP4YT2msqHFj2lOSs4uSYOTzJX-KIYgxiLiJO46LG5mA3ynVKzFu3OnEvBLC4qCxkszx0UZ9dTfFz6BdqtocFdhm0i3H8MFLHv_FoEAnVIGFj4TZeHZStEFDe8Do7Vsir_",
    stars: ["star", "star", "star", "star", "star"],
    reviews: "(2.6k)",
  },
  {
    name: "Paisley & Grey",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmudYuVVxcPlGDquXaum7WpnyzA3f-OfAG8C2IaJCOp__PJBd5l9IUkkdnYqOMOJ-xz9KhuIrA12JfXmNFK6ArkbOUoiqWmZX0Dt8KUNIjT9KsQYCgWouZXt_U2ghuqwGg3JmZKXgc-A9HEWZzx3nKX0b6S7qu-WvA59rfAmu-2CeKMqYWR6ZpmZkkHZtg9KRncNcgzRSt6mu26Slrs60AonO6yoak7B7AIjFf252gbgGiAEynBRN3fPv4DClhGlQxx2_qTWk6gM-j",
    stars: ["star", "star", "star", "star", "star_half"],
    reviews: "(2.6k)",
  },
  {
    name: "Ally fashion",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-UR1iMXbr76lzWJvDJOQE-yKLujMT9k_Y4lvwmWH6xQlysiG4igaZniPb8yoi-PV8s-lna3IlDa8IA0FJxipPo-Dq8GyAru-5VU-XVRPAge_48NbHemGosa816aMXPfl2dRxd5fJ6X2_vH0_lGs1SwTz_V-02Ol3QqBqJockYhxaJNfXVf8OrNzZtI13K0hU2nDjHAmWqufozw-FRaEnrWINhIjA_9meew9fBUDUwis7PkiQbYKKs07D0MBOUFL0MJINWI6MbNgKX",
    stars: ["star", "star", "star", "star", "star"],
    reviews: "(2.6k)",
  },
  {
    name: "Activewear Co.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOr5iiBNZoC1KSaBTV7e03FgTR_XWvcvkIkrC_FCDjD9w6XwGk53qSjnlNpF5Eu7CYpjTlhGM7FoLJnQakQy5iLwsa43c9ThoNlcvhTnw6lErLoCoCb3rfWCRFlaIKTVQbr7KjEkawTODl8h4UpbM2vh1sa6Guz_s_goCqOZgM5UCBtrbzODmeTA9LZKaur6EfJRZnGNZ-U0nRzvwcELt9a9v-OfwHIsTmNfKwgX2Ij6EV93i-Q5HIi0QPbmujW28wlHYbNTQYMe1B",
    stars: ["star", "star", "star", "star", "star_border"],
    reviews: "(2.8k)",
  },
  {
    name: "Urban Threads",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKxZf6b__t0_PI2fsYmQ2giKRFzlYI-LQAqYdmDSZ4q9gXStPF3yXV99mUrYY_8Cf1PIltTdcVPnzw5f_7CdWX-toR_IqiuZjfig0dCe5s5XVCvUJxw4l09vs5--v8o_CUiz6UMg7F4dVVzHEf-3s01_eJAM2wOpM_kE8o38XaVvwotR99HAptDve6ot8x12IEJGpFyFYGYKQPppLfKplH1M1kkP_iC7feJtMoWzkxQIYuAp7IzLA1gkIjDt8gU-wba54Ns4da5520",
    stars: ["star", "star", "star", "star", "star_half"],
    reviews: "(1.9k)",
  },
];

const products = [
  {
    name: "Color-blocked Puffer Jacket Multicolor",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPPTBm0xQFvmexwPVzgtwNn3UVxViSF87OUXSEPSt-qpMFzMDhp7gXuU3OsZzB-V0BL6nCrM8tP30dO7dU2Vfcq7KyqSTAdwAjv9RpHeedUCR4zZ10vdjL_g1SlbzXu0fwSZTc_tVxnkzqSyKCQZjgruSyub7XkbdVaSPTjRzF20aS4S98b8g8-6s_E49nQ9faCDJPFkXXN3ra9_beWLI2cJWEGckX5vWUMLFL1EzHsdff3hIp10A-dNYFY4MU7mPmo46jLWJUnEBH",
    rating: ["star", "star", "star", "star", "star_border"],
    reviews: "(100)",
    price: "300",
  },
  {
    name: "Unisex Printed Quilted Puffer Jacket",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd5VVUcBjB9bLEnOCgN-S54GoOc1v4nmyc1_tZkoOma_M6LNTTujTDBExI5gHgyKsO8hIztdaeqltKpbhJd_eMsWaAMUK1y3gimOKPt1DYXNgd3KkhwNr_onVWs1Sw8Af-Q2B4_E1eKYpsyceoqu3vIJ1uvEW6tg-wtfu8lWL6r8oC-58Gza6XFuN7AzNoMuKrFXAwdNxH-Wd-doqgNaDpmzM-o9EKg9AxUdIIEVbFIrr2rlxMeqGxzNomfM29XNq7QKbM4vbwCngG",
    rating: ["star", "star", "star", "star", "star_half"],
    reviews: "(1.2k)",
    price: "200.00",
  },
  {
    name: "Off Road Ventures Women's Lightweight...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCP-rr-Gj-LiRhqIj5mBWWiJ0uVMv1tbs185nz8RPnmoxzk07mbp7ctsyzNyTESia5uvjGC1kddFQE4n89viC6sgoYE0YJ1Exz9PY1u5D9EqXkUqkGzmywklW9K-W38m3lpVLbc9Ou6AIVEvM8zM7nXELAmSaPYjU8zw68Cri2m9nN-RmYAMmDiyYzngs9aQIiTMs0a1NV0inSKG6jG_7jqlYmrVnhGUM59R6DhU0DNIQlcQt6ztHvoHzC6OBTk1ybkoIdhf08ejM5",
    rating: ["star", "star", "star", "star", "star_border"],
    reviews: "(39)",
    price: "734.60",
  },
  {
    name: "Rowing Blazers Bright Multicolor Colorblock...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBW8s_kfTcsruGQQljSvKKHSDvIX8ulDbuUAJ1tApKB5fv3YyYo0dcidp4lvk8kMMEAjE5OCshgjgDuJO5oZuVbZ7v2DnENKPuPSL7MRxCXbJMUXWYqT_u0xSWeppGDUZ-ZEFDnhrIG7az6TzzlfWEf3XBNa_Wo-gC-2FOlf2QYYFReX5xKqTf7qnnXFLS0CqXRLoNZSJNX07PLxNUdyTL9hdaMheIrxwWFAQZP8RGHR26pboZ-4chMP4zVCGwNeL6zFMqJ44hK36aW",
    rating: ["star", "star", "star", "star", "star"],
    reviews: "(88)",
    price: "1469.20",
  },
  {
    name: "Brand Women's Crop Color-Blocked Puffer...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRCitHecQcINMzw2geyZCYTMkqZGNO0a-4zpWKLVcrg1tu3zPKTWF-g8GBWbkNU9Cb_3be4HAEEFTPZKCbgnTARiuMW4I_1fEBPEaSXedbRmPryM-3d5ab6vTQuI9zvyb3qirkDR3UAw0OSSQRYzYO1XobcV1OsZgUrMruvPkPTnfS_agrVFtTWDWaDagyV5gNsvWMZ_uUKFTn0Xb67HBkQWunZOZ1kqhwyes2SJQJ61Tgjvf27rfg3b73WCxeODC1Yc9brRmsO95u",
    rating: ["star", "star", "star", "star_border", "star_border"],
    reviews: "(24)",
    price: "326.90",
  },
  {
    name: "Pucci, Iride down jacket, Women, Multicolor",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5Gsd4kFvJcnomY4ByyoDPicT79gUN_27M_VKLIvCgjTZBfQgtEetohWkU-IhAcgTuOvIt6N3vwL2LUst2zpZ-TeRCS7V0aJ_SxYRnPM9ffbw7sxFxD1Y-jGx9L9X6aXI1cYVkgCAROZX9mQQJwabVHwIaWLXXpC623QDuP7W4ciVO6kNd6zxHXTqxChWh4gyfkow-tuMII8XJssR1bEg-YppXWM696hxjNhekt64o_Ub2JTJ7XuctbGQip5GafUl0trLUc6etGpio",
    rating: ["star", "star", "star", "star", "star_border"],
    reviews: "(120)",
    price: "609.36",
  },
  {
    name: "Only Padded Coat in Pink & Red",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZfN0SuvgL4U1L-g_xV4VC76nQMmQGOlZouXhsVEalMxVmxTWCaC4jAfn_P-kFVDOsDGfbrBJeI1T_QiFUL1OmjvHsL3JEHE5KBe9sY432YwcIehV7Bet7NZedCpxtL1G8rYZ_e6SCrL5WeBkngGVLf4TLtFS8px-ZRLKObiZdsQKu7_XseREOWWx1KhbjmjJv8yt4ulNlq3-5_Va2I-wI3P9F8y-iGIAYcfTNwA8bCew7InGec_xBD26ksu0IrJMtYd_s4F9jI_tv",
    rating: ["star", "star", "star", "star_border", "star_border"],
    reviews: "(16)",
    price: "209.36",
  },
  {
    name: "Off Road Ventures Women's Lightweight...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSKhRBn4CNZF4jOZ42LDPoNBeqHFLAk92jDSIPpe-NQxSszxX--Cqb6pTyLXcIyZ1sv-wJqW48CuJQWbEDbX7ZLBthlICdfKjtqCNw0pC2Hfd5W3CK41q7UFirPQysdBm4Q0lv2HYQ986fiCmbcnNdAraoZMaMAO_fgP-cd3VZu9LzNz1z3Fz4EkrqPzX1GDr06nWqYINCNIKiMuY7BageOQonw_o9-KFlrAISJKhALaiUfFr5ukHdX8fRq1gLrTfDXSW95ZlNVJNx",
    rating: ["star", "star", "star", "star", "star_half"],
    reviews: "(1.1k)",
    price: "624.41",
  },
];

export function ShopwhizPreview() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/90 backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/60">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-8 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="6" cy="12" r="2.5" fill="#7C3AED" />
              <circle cx="12" cy="12" r="2.5" fill="#7C3AED" fillOpacity="0.6" />
              <circle cx="18" cy="12" r="2.5" fill="#7C3AED" fillOpacity="0.3" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shopwhiz
            </span>
          </div>

          <div className="flex-1">
            <div className="relative">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-primary">
                spark
              </span>
              <input
                defaultValue="Colorful patterned puffer jackets"
                className="w-full rounded-full border-2 border-transparent bg-slate-100 py-3 pl-12 pr-10 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/60 dark:bg-slate-700/60 dark:text-white"
              />
              <button
                type="button"
                className="material-icons-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label="Clear search"
              >
                close
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG2oC_gOh_GRTEODmPXjNA3ppoLeOEYpeKDUvqDmX1hB8V6I84_fEAX2j_0f269RJjn7LkebV93LDLFCfmapQyLKcWoBbFyLoBoPzG-bUUKuKx7BzcCSDyqypme2o5ZWXwR5s2blXWynldMd24O32XAlIp6BC_GkCJWHp39D9ReodRDdElRVJ3kWqGT1tizhAPERGhFmG2NGnp_TzoUh01xlcwQYROOLxYpMAN2RmN4DV3Nts69QxHiq2qSUze9gQ_7CMcahGKVyRQ"
                alt="UAE flag"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span>AE</span>
              <span className="material-icons-outlined text-base">expand_more</span>
            </button>
            <a
              href="#"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <span className="material-icons-outlined text-2xl">shopping_cart</span>
              <span>Cart</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <span className="material-icons-outlined text-2xl">person_outline</span>
              <span>Sign In</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-screen-2xl gap-8 px-6 py-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            {["Category", "Rating", "Gender", "Size", "Color", "Price", "Sort by"].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-slate-200/60 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {label}
                  <span className="material-icons-outlined text-base">expand_more</span>
                </button>
              )
            )}
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Store
              </h2>
              <a
                href="#"
                className="text-sm font-medium text-primary transition hover:underline"
              >
                View All &gt;
              </a>
            </div>
            <div className="relative">
              <div className="no-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-4">
                {stores.map((store) => (
                  <div
                    key={store.name}
                    className="min-w-[200px] rounded-lg bg-white p-4 text-center shadow-sm dark:bg-slate-800"
                  >
                    <img
                      src={store.image}
                      alt={store.name}
                      className="mx-auto mb-2 h-16 w-16 rounded-full bg-slate-100 object-cover dark:bg-slate-700"
                    />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {store.name}
                    </h3>
                    <div className="flex items-center justify-center text-xs text-blue-500">
                      {store.stars.map((icon, index) => (
                        <span
                          key={`${store.name}-star-${index}`}
                          className="material-icons-outlined text-base"
                        >
                          {icon}
                        </span>
                      ))}
                      <span className="ml-1 text-slate-500 dark:text-slate-400">
                        {store.reviews}
                      </span>
                    </div>
                    <a
                      href="#"
                      className="mt-1 inline-block text-xs font-medium text-primary"
                    >
                      Visit shop
                    </a>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-slate-600 shadow-md transition hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                aria-label="Scroll stores"
              >
                <span className="material-icons-outlined">arrow_forward_ios</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Result
              </h2>
              <a
                href="#"
                className="text-sm font-medium text-primary transition hover:underline"
              >
                View All &gt;
              </a>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-slate-800"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full bg-slate-100 object-cover dark:bg-slate-700"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-600 backdrop-blur transition hover:text-red-500 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-red-400"
                      aria-label="Add to wishlist"
                    >
                      <span className="material-icons-outlined text-xl">
                        favorite_border
                      </span>
                    </button>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="truncate font-semibold text-slate-800 dark:text-white">
                      {product.name}
                    </h3>
                    <div className="flex items-center text-xs">
                      <div className="flex text-blue-500">
                        {product.rating.map((icon, index) => (
                          <span
                            key={`${product.name}-rating-${index}`}
                            className="material-icons-outlined text-base"
                          >
                            {icon}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-slate-500 dark:text-slate-400">
                        {product.reviews}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {product.price}{" "}
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        AED
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="sticky top-24">
          <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="flex flex-shrink-0 items-center justify-between pb-4">
              <div className="flex-1 text-center">
                <div className="relative inline-block">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 opacity-40 blur-xl" />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzRQjy2NiMgGs5Ng7g887Z6t7cUD8IPLnon6HeCDkBxfxXAPHpsQJofanPC68qgHtVIfb-IeCF5sxRWczm62BNLMxicPHSZ6olM_Q6C58tlVuLc74DZmMhXcc_mmM5YaOshsiwlx4QtSkuwYmf2hdYk1WapN8CKDaYLOoodDAXRDXHdoqJob-bLUFXLDoWPR-m0XKuo6wa4zILjnif4CNHvKd_BV-aa0DtWZX97hocvZbWiAJzb_mmSz1FFQdGuOX1FOXaVrD-L5Ao"
                    alt="AI logo"
                    className="relative h-12 w-12"
                  />
                </div>
                <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  AI-Powered
                  <br />
                  Shopping Experience
                </h2>
              </div>
              <button
                type="button"
                className="material-icons-outlined text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label="Close panel"
              >
                close
              </button>
            </div>
            <div className="no-scrollbar flex-grow space-y-6 overflow-y-auto px-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Colorful patterned puffer jackets
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 text-xl text-primary">✨</div>
                <div className="rounded-lg rounded-tl-none bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Absolutely! 😊 We have a variety of colorful puffer jackets with unique
                  patterns. Do you have any specific color preferences? For example, do you
                  prefer vibrant multicolor, geometric patterns, or floral designs?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg rounded-br-none bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  I like multicolor and geometric patterns. Something stylish but warm.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 text-xl text-primary">✨</div>
                <div className="rounded-lg rounded-tl-none bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Absolutely! 😊 We have a variety of colorful puffer jackets with unique
                  patterns. Do you have any specific color preferences? For example, do you
                  prefer vibrant multicolor, geometric patterns, or floral designs?
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-900/60">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqTkACmkbRiQ-kY71N2uANT_s9yyCsoCxPsewhMkzZueCRKXnfLeCGc7g_l2T70iYQSPuTpEWQhtqpSEHX3_g1QrNdktMmpTx2OYmL6ofBuSSBnqlWFdWjGucRexxLCmxGKlyUEijlZ7uRQSlls5bNxeHsxn1M4sj1NNBw2q9J2P3Z2RpIGW55fwuD7KT38EWvsaQxbdwohNXFlJ75VM6vtH2QXS0HBLNMcuHkkyE0npjAA9EMs8F-nXWFTDoKXFmC0oAbAKG4WdcP"
                  alt="AI generated products illustration"
                  className="absolute -bottom-4 -right-8 w-32 opacity-80"
                />
                <div className="relative z-10 space-y-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    Generate an image of the item you're looking for and shop similar-looking
                    products.
                  </h3>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-purple-700"
                  >
                    <span className="material-icons-outlined text-base">auto_awesome</span>
                    Generate Images
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-4 pt-6">
              <div className="flex justify-center gap-2 text-sm">
                {["denim Jacket", "Purple Jacket", "leather Jacket"].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-primary">
                  spark
                </span>
                <input
                  type="text"
                  placeholder="Ask anything..."
                  className="w-full rounded-full border-2 border-transparent bg-slate-100 py-3 pl-12 pr-10 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/60 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <button
                  type="button"
                  className="material-icons-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  aria-label="Use microphone"
                >
                  mic
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default ShopwhizPreview;

