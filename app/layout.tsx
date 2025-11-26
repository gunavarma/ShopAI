import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { BoltNewBadge } from "@/components/ui/bolt-new-badge";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopWhiz - AI-Powered Shopping Assistant",
  description:
    "Find the perfect products with real-time prices, reviews, and AI recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
      </head>
      <body className={`${inter.className} font-display text-gray-800`}>
          <AuthProvider>
            {children}
            <SupabaseSetupNotice />
            {/* <BoltNewBadge position="bottom-right" variant="auto" size="medium" /> */}
            <Toaster />
          </AuthProvider>
      </body>
    </html>
  );
}
