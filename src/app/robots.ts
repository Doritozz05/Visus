import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://visuslabs.tech'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/library/', '/reader/', '/settings/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}