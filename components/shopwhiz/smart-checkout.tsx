"use client";

import { useState } from "react";
import { ShieldCheck, CreditCard, Wallet, Truck, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SmartCheckout() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep(3);
      setIsProcessing(false);
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-muted-foreground">Your AI shopping assistant has secured the best price.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl max-w-md w-full text-left">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono">#WHIZ-8829</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span>Tomorrow, by 2 PM</span>
          </div>
          <div className="flex justify-between font-bold pt-4 border-t border-white/10">
            <span>Total Paid</span>
            <span>$348.00</span>
          </div>
        </div>
        <Button onClick={() => setStep(1)} className="bg-gradient-to-r from-blue-600 to-violet-600">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold">AI Secure Checkout</h2>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className={cn("flex-1 h-1 rounded-full", step >= 1 ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700")} />
            <div className={cn("flex-1 h-1 rounded-full", step >= 2 ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700")} />
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl border border-blue-500 bg-blue-500/10 flex flex-col items-center gap-2 transition-all">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <span className="font-medium">Card</span>
              </button>
              <button className="p-4 rounded-xl border border-white/10 hover:bg-white/5 flex flex-col items-center gap-2 transition-all">
                <Wallet className="w-6 h-6" />
                <span className="font-medium">Crypto</span>
              </button>
            </div>

            <div className="space-y-4 mt-6">
              <input 
                type="text" 
                placeholder="Card Number" 
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="CVC" 
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/20">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-white p-2 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200" alt="Product" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-medium">Sony WH-1000XM5</h4>
                <p className="text-sm text-muted-foreground">Silver</p>
                <p className="font-bold">$348.00</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 py-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$348.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-emerald-500 font-medium">Free (AI Plus)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxes</span>
              <span>$24.00</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold py-4 border-t border-white/10">
            <span>Total</span>
            <span>$372.00</span>
          </div>

          <div className="bg-blue-500/10 rounded-xl p-3 mb-6 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              ShopWhiz AI found a better price coupon and applied it automatically! You saved $51.00.
            </p>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 shadow-lg shadow-blue-500/20 text-lg font-semibold"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure SSL Encrypted Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
