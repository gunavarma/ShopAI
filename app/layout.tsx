import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <SupabaseSetupNotice />
            {/* <BoltNewBadge position="bottom-right" variant="auto" size="medium" /> */}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
