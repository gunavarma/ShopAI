"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ShoppingCart, 
  Package, 
  Settings, 
  User,
  Book,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShopWhizSidebar() {
  const links = [
    {
      label: "Search Products",
      href: "/",
      icon: (
        <Search className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My Orders",
      href: "/orders",
      icon: (
        <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: (
        <Heart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Shopping Cart",
      href: "/cart",
      icon: (
        <ShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Books & Literature",
      href: "/books",
      icon: (
        <Book className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Assistant",
      href: "/chat",
      icon: (
        <Sparkles className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row glass-card w-full flex-1 max-w-7xl mx-auto border border-border/50 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <ShopWhizLogo /> : <ShopWhizLogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Your Profile",
                href: "/profile",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <ShopWhizDashboard />
    </div>
  );
}

export const ShopWhizLogo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-r from-primary to-purple-400 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 flex items-center justify-center">
        <ShoppingBag className="w-3 h-3 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium gradient-text whitespace-pre"
      >
        ShopWhiz
      </motion.span>
    </Link>
  );
};

export const ShopWhizLogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-r from-primary to-purple-400 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 flex items-center justify-center">
        <ShoppingBag className="w-3 h-3 text-white" />
      </div>
    </Link>
  );
};

// ShopWhiz Dashboard component
const ShopWhizDashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-border/50 bg-background flex flex-col gap-2 flex-1 w-full h-full">
        {/* Quick Stats */}
        <div className="flex gap-2">
          <div className="h-20 w-full rounded-lg glass-card flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Cart Items</p>
              <p className="font-semibold">3</p>
            </div>
          </div>
          <div className="h-20 w-full rounded-lg glass-card flex items-center justify-center">
            <div className="text-center">
              <Heart className="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p className="text-xs text-muted-foreground">Wishlist</p>
              <p className="font-semibold">12</p>
            </div>
          </div>
          <div className="h-20 w-full rounded-lg glass-card flex items-center justify-center">
            <div className="text-center">
              <Package className="w-6 h-6 mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="font-semibold">8</p>
            </div>
          </div>
          <div className="h-20 w-full rounded-lg glass-card flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-1 text-purple-500" />
              <p className="text-xs text-muted-foreground">AI Chats</p>
              <p className="font-semibold">24</p>
            </div>
          </div>
        </div>
        
        {/* Main Content Areas */}
        <div className="flex gap-2 flex-1">
          <div className="h-full w-full rounded-lg glass-card p-6 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold gradient-text mb-2">Welcome to ShopWhiz</h3>
              <p className="text-muted-foreground">Your AI-powered shopping assistant</p>
            </div>
          </div>
          <div className="h-full w-full rounded-lg glass-card p-6 flex items-center justify-center">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-muted-foreground">Find products with AI assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};