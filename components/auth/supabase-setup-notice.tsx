"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ExternalLink, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SupabaseSetupNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const hasSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url';
    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
                          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key';

    // Show notice if Supabase is not configured and not dismissed
    const dismissed = localStorage.getItem('supabase-setup-dismissed');
    if ((!hasSupabaseUrl || !hasSupabaseKey) && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('supabase-setup-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <Alert className="border-amber-500/50 bg-amber-500/10 backdrop-blur-sm">
          <Database className="h-4 w-4 text-amber-500" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  Supabase Setup Required
                </span>
                <Badge variant="outline" className="text-xs">
                  Authentication
                </Badge>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-300 mb-3">
                To enable authentication features, please set up your Supabase project and add the configuration to your .env.local file.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-amber-700 border-amber-500/50 hover:bg-amber-500/20"
                >
                  <a 
                    href="https://supabase.com/dashboard/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Create Project
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-amber-700 border-amber-500/50 hover:bg-amber-500/20"
                >
                  <a 
                    href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Setup Guide
                  </a>
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}