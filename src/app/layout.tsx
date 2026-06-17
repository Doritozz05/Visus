import React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/landing/Navbar";
import { BUILTIN_THEMES } from "@/core/config/themes";
import { generateThemeCss } from "@/lib/color-utils";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});

const outfit = localFont({
  src: [
    {
      path: "../../public/fonts/Outfit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Outfit-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://visuslabs.tech"),
  title: {
    default: "Visus - Read faster, retain more & boost your reading focus",
    template: "%s | Visus",
  },
  description: "Double your reading speed and improve focus with Visus. The advanced speed reading platform for EPUBs and PDFs. Free, open-source, and privacy-first.",
  keywords: [
    "speed reading",
    "read faster",
    "online epub reader",
    "improve reading focus",
    "speed reading trainer",
    "RSVP reading",
    "cognitive enhancement",
    "focus tools",
    "open source speed reader"
  ],
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
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  verification: {
    google: 'kQS_aofbtHE0ifRmQCFFVqQrcntk7oF-A2l6RVbk_eA',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Visus",
    title: "Visus - Advanced Speed Reading Platform",
    description: "Boost your visual reading speeds using RSVP and visual semantic clustering. Open-source multi-device PWA.",
    url: "https://visuslabs.tech",
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
  // Static generation of all built-in themes to prevent FOUC
  const staticThemeCss = BUILTIN_THEMES.map((t) => generateThemeCss(t)).join("\n");

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <style id="visus-static-themes" dangerouslySetInnerHTML={{ __html: staticThemeCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://visuslabs.tech/#website",
                  "url": "https://visuslabs.tech",
                  "name": "Visus",
                  "description": "Advanced Speed Reading Platform based on RSVP.",
                  "publisher": { "@id": "https://visuslabs.tech/#organization" }
                },
                {
                  "@type": "Organization",
                  "@id": "https://visuslabs.tech/#organization",
                  "name": "Visus Labs",
                  "url": "https://visuslabs.tech",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://visuslabs.tech/icons/icon-512x512.png",
                    "width": "512",
                    "height": "512"
                  },
                  "sameAs": [
                    "https://github.com/visus-labs"
                  ]
                },
                {
                  "@type": "WebApplication",
                  "name": "Visus",
                  "applicationCategory": "EducationApplication",
                  "operatingSystem": "Web, Windows, macOS, Linux, Android, iOS",
                  "author": { "@id": "https://visuslabs.tech/#organization" },
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "review": {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "Alex C."
                    },
                    "reviewBody": "I've doubled my reading speed in just a week. The RSVP engine is smooth and the typography choices are perfect for developers."
                  }
                }
              ]
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('visus_settings');
                var theme = 'sepia';
                var isDark = false;
                if (stored) {
                  var parsed = JSON.parse(stored);
                  if (parsed && parsed.general && parsed.general.theme) {
                    theme = parsed.general.theme;
                    var legacyThemes = ["dark", "midnight", "sepia", "nordic", "nord", "forest", "light", "matrix-green"];
                    if (legacyThemes.includes(theme)) {
                      if (theme === "dark" || theme === "midnight" || theme === "forest" || theme === "matrix-green") {
                        theme = "dark-violet";
                      } else if (theme === "light") {
                        theme = "light";
                        isDark = false;
                      } else if (theme === "sepia") {
                        theme = "sepia";
                        isDark = false;
                      } else if (theme === "nordic" || theme === "nord") {
                        theme = "nord";
                      }
                    } else if (theme === "light" || theme === "sepia") {
                       isDark = false;
                    }
                  }
                }
                var root = document.documentElement;
                root.classList.add('theme-' + theme);
                if (isDark) root.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <Providers>
          <React.Suspense fallback={null}>
            <Navbar />
          </React.Suspense>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
