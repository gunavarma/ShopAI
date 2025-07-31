"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, ShoppingBag, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export function HeroSection({ onGetStarted, onTryDemo }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Powered by Gemini AI
                </Badge>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                Your AI Shopping
                <span className="gradient-text block">Assistant</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                Find the perfect products with real-time data from Google Shopping and Amazon India. 
                Get personalized recommendations, compare prices, and shop smarter with AI.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 neon-glow"
                onClick={onGetStarted}
              >
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={onTryDemo}
              >
                <Play className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glass-card rounded-2xl p-8 neon-glow">
              {/* Mock Chat Interface */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">ShopWhiz AI</div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live data active
                    </div>
                  </div>
                </div>

                {/* Sample Messages */}
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3 text-sm">
                    "Find me the best iPhone 15 Pro Max deals"
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 text-sm">
                    I found 12 live deals from Google Shopping and Amazon India! 
                    Here are the best options with current pricing...
                  </div>
                </div>

                {/* Mock Product Cards */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <div className="w-full h-16 bg-muted rounded-md mb-2"></div>
                      <div className="text-xs font-medium mb-1">iPhone 15 Pro Max</div>
                      <div className="text-xs text-muted-foreground mb-2">₹1,34,900</div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span>4.8</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}