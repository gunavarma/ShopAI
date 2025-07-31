"use client";

import { motion } from 'framer-motion';
import { Search, Bot, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Tell Us What You Want",
      description: "Simply describe what you're looking for in natural language. Our AI understands context and preferences.",
      icon: <Search className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Get Smart Recommendations",
      description: "Receive personalized product suggestions with real-time pricing from multiple sources.",
      icon: <Bot className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Shop with Confidence",
      description: "Compare options, read AI-analyzed reviews, and complete secure checkout with order tracking.",
      icon: <CreditCard className="w-8 h-8" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shopping Made <span className="gradient-text">Simple</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to find your perfect product with AI assistance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="glass-card rounded-xl p-8 text-center hover:neon-glow transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center mx-auto mb-6 text-white">
                  {step.icon}
                </div>
                <div className="text-sm font-mono text-primary mb-2">{step.step}</div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Connecting Line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}