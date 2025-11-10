"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ClientOnly } from "@/components/client-only";

// Dynamically import the enhanced chat interface to avoid hydration issues
const ChatInterfaceEnhanced = dynamic(
  () =>
    import("@/components/chat/chat-interface-enhanced").then((mod) => ({
      default: mod.ChatInterfaceEnhanced,
    })),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background to-muted/20" />

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
  );
}
