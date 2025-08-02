"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, ShoppingBag, Zap, Heart, Star, Package, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Floating, { FloatingElement } from '@/components/ui/parallax-floating';

interface HeroSectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export function HeroSection({ onGetStarted, onTryDemo }: HeroSectionProps) {
  const productImages = [
    'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

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
            className="relative min-h-[600px]"
          >
            {/* Floating Product Images Background */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Floating sensitivity={-0.5} className="overflow-hidden">
                <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[0]}
                      alt="iPhone"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={1} className="top-[10%] left-[75%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[1]}
                      alt="Laptop"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={2} className="top-[25%] left-[5%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                    className="w-24 h-32 md:w-28 md:h-36 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[2]}
                      alt="Headphones"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={1} className="top-[20%] right-[8%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8 }}
                    className="w-18 h-18 md:w-22 md:h-22 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[3]}
                      alt="Smartwatch"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={3} className="top-[55%] left-[12%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.0 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[4]}
                      alt="Shoes"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={2} className="top-[65%] right-[15%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 }}
                    className="w-28 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[5]}
                      alt="Monitor"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={1} className="bottom-[15%] left-[25%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.4 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[6]}
                      alt="Camera"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>

                <FloatingElement depth={4} className="bottom-[8%] right-[25%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.6 }}
                    className="w-22 h-22 md:w-26 md:h-26 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={productImages[7]}
                      alt="Tablet"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </FloatingElement>
              </Floating>
            </div>

            {/* Main Content Card */}
            <div className="relative z-10 glass-card rounded-2xl p-8 neon-glow backdrop-blur-md">
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
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + i * 0.2 }}
                      className="bg-background/50 rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="w-full h-16 bg-muted rounded-md mb-2 overflow-hidden">
                        <img
                          src={productImages[i - 1]}
                          alt={`Product ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs font-medium mb-1">
                        {i === 1 ? 'iPhone 15 Pro Max' : 'MacBook Pro M3'}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {i === 1 ? '₹1,34,900' : '₹1,99,900'}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {i === 1 ? 'Live' : 'AI'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg z-20"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-20"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>

              {/* Additional floating badges */}
              <motion.div
                animate={{ 
                  y: [-5, 5, -5],
                  x: [-2, 2, -2]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -left-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3 shadow-lg z-20"
              >
                <Package className="w-5 h-5 text-white" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [8, -8, 8],
                  x: [3, -3, 3]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-1/3 -right-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 shadow-lg z-20"
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}