"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  ShoppingBag, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  Sparkles,
  Zap,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Home", href: "/", color: "text-gray-500" },
  { icon: Search, label: "Discover", href: "/discover", color: "text-blue-500" },
  { icon: MessageSquare, label: "AI Assistant", href: "/chat", color: "text-violet-500" },
  { icon: BarChart2, label: "Compare", href: "/compare", color: "text-pink-500" },
  { icon: ShoppingBag, label: "My Cart", href: "/cart", color: "text-emerald-500" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="col-span-2 hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-white shadow-sm text-primary font-medium" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? item.color : "group-hover:text-gray-700")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <Zap className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm mb-1 text-gray-900">Pro Plan</h3>
            <p className="text-xs text-gray-500 mb-3">Get access to all AI agents</p>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
