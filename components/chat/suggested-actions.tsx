"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SuggestedActionsProps {
  actions: string[];
  onActionClick?: (action: string) => void;
}

export function SuggestedActions({ actions, onActionClick }: SuggestedActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mt-2"
    >
      {actions.map((action, index) => (
        <motion.div
          key={action}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onActionClick?.(action)}
            className="text-xs glass-card border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-colors"
          >
            {action}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}