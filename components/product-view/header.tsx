"use client";

import { Search, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200/80 dark:border-b-slate-800/80 px-4 md:px-10 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-6 text-primary">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Shopwhiz
          </h2>
        </div>
        <label className="hidden lg:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full">
            <div className="text-slate-500 dark:text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-full border-r-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Search"
            />
          </div>
        </label>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="hidden lg:flex items-center gap-9">
          <Link
            className="text-slate-900 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
            href="#"
          >
            Categories
          </Link>
          <Link
            className="text-slate-900 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
            href="#"
          >
            Deals
          </Link>
          <Link
            className="text-slate-900 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
            href="#"
          >
            AI Assistant
          </Link>
          <Link
            className="text-slate-900 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
            href="#"
          >
            New Arrivals
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <Heart className="w-5 h-5" />
          </button>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJo5s-aCXGeFOAcBxcQvPry1v2LHOOXh82LNqwAKX5-_3EMFtdFafWvcTii5nPv6iWzu9Hj8EGpbQKFaNLpiUomTyQaujlWfTpJ5rktwIh-SbAkukCuG5pczqgu3UAVZLz9z6edHsS33BQEKCvj4jNHz4IYveRbk_cqHBqqCAsbs5vbNrthJwnsdEV798PKdjJs9XzdkVyS3ygbqI4lsG0_L40W625F4zlXrf5BrR5WN2NumJyvdXB_UsWpzevc8W8VGJcty3Q0qPa")',
          }}
        ></div>
      </div>
    </header>
  );
}
