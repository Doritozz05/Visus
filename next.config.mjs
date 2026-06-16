/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Custom headers to enable optimal performance and PWA caching rules
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-scripts.com va.vercel-scripts.com https://vercel.live https://*.vercel.live https://accounts.google.com; style-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live; img-src 'self' blob: data: https://*.googleusercontent.com https://vercel.live https://*.vercel.live https://vercel.com https://*.vercel.com; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co va.vercel-scripts.com https://vitals.vercel-insights.com https://*.vercel-insights.com https://vercel.live https://*.vercel.live wss://*.pusher.com https://*.sentry.io https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://accounts.google.com; frame-src 'self' https://accounts.google.com https://vercel.live https://*.vercel.live; object-src 'none'; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/auth/reset-password',
        destination: '/update-password',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
