import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { SupabaseSetupNotice } from '@/components/auth/supabase-setup-notice';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopWhiz - AI-Powered Shopping Assistant',
  description: 'Your intelligent shopping companion. Find the perfect products with AI assistance.',
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
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}