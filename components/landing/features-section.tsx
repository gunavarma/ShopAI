"use client";

import { motion } from 'framer-motion';
import { Zap, Bot, Search, Shield, Package, Users, TrendingUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Product Data",
      description: "Live pricing and availability from Google Shopping and Amazon India",
      color: "text-blue-500"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Intelligence",
      description: "Gemini AI understands natural language and provides smart recommendations",
      color: "text-purple-500"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Find products across all categories with intelligent filtering and comparison",
      color: "text-green-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Shopping",
      description: "Protected checkout with Stripe and comprehensive order tracking",
      color: "text-red-500"
    }
  ];

  const stats = [
    { number: "1M+", label: "Products Tracked", icon: <Package className="w-5 h-5" /> },
    { number: "50K+", label: "Happy Users", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "4.9/5", label: "User Rating", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">ShopWhiz</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of online shopping with AI-powered assistance and real-time data
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 text-center hover:neon-glow transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-primary">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.number}</div>
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card rounded-xl p-6 text-center hover:neon-glow transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}