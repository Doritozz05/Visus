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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://visuslabs.tech"),
  title: "Visus - Advanced Speed Reading Platform",
  description: "Boost your visual reading speeds using RSVP and visual semantic clustering. Open-source multi-device PWA.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Outfit-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Outfit-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "Visus",
                  "url": "https://visuslabs.tech",
                  "description": "Advanced Speed Reading Platform based on RSVP."
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Visus",
                  "operatingSystem": "Web, Windows, macOS, Linux, Android, iOS",
                  "applicationCategory": "EducationalApplication",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
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
                var theme = 'nord';
                var isDark = true;
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
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
