"use client";

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export function CTASection({ onGetStarted, onTryDemo }: CTASectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-12 neon-glow"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingBag className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Shop <span className="gradient-text">Smarter</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who've discovered the perfect products with AI assistance. 
            Start your intelligent shopping journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 neon-glow"
              onClick={onGetStarted}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={onTryDemo}
            >
              Try Demo First
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Real-time data</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}