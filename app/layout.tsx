import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { LoadingProvider } from "@/lib/loading-context";
import { InitialLoadingScreen } from "./components/initial-loading-screen";
import { NavigationProgress } from "./components/navigation-progress";
import { Toaster } from "sonner";

import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FABRIC. - Woven with Intention",
  description:
    "Experience the finest fabrics, sustainably sourced and crafted with artisanal quality for modern living.",
  generator: "v0.app",
  icons: {
    icon: "/images/logo1.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`font-sans antialiased`}>
        <LoadingProvider>
          <CartProvider>
            {/* <InitialLoadingScreen /> */}
            <NavigationProgress />
            <Toaster richColors position="top-right" />
            {children}
          </CartProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
