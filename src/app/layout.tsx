import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
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
  openGraph: {
    type: "website",
    siteName: "Visus",
    title: "Visus - Advanced Speed Reading Platform",
    description: "Boost your visual reading speeds using RSVP and visual semantic clustering. Open-source multi-device PWA.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Visus - Advanced Speed Reading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visus - Advanced Speed Reading Platform",
    description: "Boost your visual reading speeds using RSVP and visual semantic clustering. Open-source multi-device PWA.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <Providers>{children}</Providers>
        {/* <Analytics />
        <SpeedInsights /> */}
      </body>
    </html>
  );
}
