import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { SettingsProvider } from "@/lib/settings-context"
import { Toaster } from "@/components/ui/sonner"
import { SettingsDrawer } from "@/components/settings-drawer"
import { khTeka } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { headers } from 'next/headers'
import ContextProvider from '@/context'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merch Store - Premium Apparel & Accessories",
  description: "Shop premium t-shirts, hoodies, and tote bags with modern design and quality materials.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Retrieve cookies from request headers on the server
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(khTeka.className)}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <ContextProvider cookies={cookies}>
                <CartProvider>
                  {children}
                  <Toaster />
                  <SettingsDrawer />
                </CartProvider>
              </ContextProvider>
            </SettingsProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
