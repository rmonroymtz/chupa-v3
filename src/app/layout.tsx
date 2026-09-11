import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono, Inter, Roboto_Flex } from "next/font/google";

import { CartData, CartMenuSkeleton } from "@/components/cart/cart-data";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";

// Design System v3 — Roboto Flex for display/H1/H2, Inter for H3 down to UI.
const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chupaprecios",
  description: "Compara precios en las tiendas más grandes de México.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${robotoFlex.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {/*
              The cart is rendered here, in a Server Component, and handed to
              the client header as an element. That is the only way round: the
              header is a Client Component and cannot import CartData without
              pulling the Magento endpoint into the browser bundle.
            */}
            <Header
              cartSlot={
                <Suspense fallback={<CartMenuSkeleton />}>
                  <CartData />
                </Suspense>
              }
            />
            <main className="flex-1">{children}</main>
            <Footer />
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
