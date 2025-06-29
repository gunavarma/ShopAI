"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from './auth-modal';
import { useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Please sign in to access this feature and enjoy personalized shopping experience.
          </p>

          <div className="flex gap-3">
            <Button onClick={() => setShowAuthModal(true)} className="neon-glow">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="outline" onClick={() => setShowAuthModal(true)}>
              Create Account
            </Button>
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-muted/30 rounded-lg max-w-md"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Why sign in?</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Save your favorite products and searches</li>
              <li>• Track your orders and delivery status</li>
              <li>• Get personalized recommendations</li>
              <li>• Access exclusive deals and offers</li>
              <li>• Sync your cart across devices</li>
            </ul>
          </motion.div>
        </motion.div>

        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="login"
        />
      </>
    );
  }

  // User is authenticated or authentication is not required
  return <>{children}</>;
}