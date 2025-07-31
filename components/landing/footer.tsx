"use client";

import { ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ShopWhiz</span>
            </div>
            <p className="text-muted-foreground">
              Your intelligent shopping companion powered by AI and real-time data.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Features</div>
              <div>How it Works</div>
              <div>Pricing</div>
              <div>API</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>About</div>
              <div>Blog</div>
              <div>Careers</div>
              <div>Contact</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Help Center</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Status</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © 2024 ShopWhiz. All rights reserved.
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-sm text-muted-foreground">
              Powered by Gemini AI & ScraperAPI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}