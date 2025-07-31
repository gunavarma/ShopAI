"use client";

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ClientOnly } from '@/components/client-only';
import { ProtectedRoute } from '@/components/auth/protected-route';

// Dynamically import the enhanced chat interface to avoid hydration issues
const ChatInterfaceEnhanced = dynamic(
  () => import('@/components/chat/chat-interface-enhanced').then(mod => ({ default: mod.ChatInterfaceEnhanced })),
  { ssr: false }
);

export default function ChatPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Main Content */}
        <ClientOnly>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen"
          >
            <ChatInterfaceEnhanced />
          </motion.main>
        </ClientOnly>
      </div>
    </ProtectedRoute>
  );
}