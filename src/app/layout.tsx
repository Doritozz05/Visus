import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Visus - Advanced Speed Reading Platform",
  description: "Boost your visual reading speeds using RSVP and visual semantic clustering. Open-source multi-device PWA.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Visus",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  verification: {
    google: 'kQS_aofbtHE0ifRmQCFFVqQrcntk7oF-A2l6RVbk_eA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${hanken.variable} dark`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <Providers>{children}</Providers>
        {/* <Analytics />
        <SpeedInsights /> */}
      </body>
    </html>
  );
}
