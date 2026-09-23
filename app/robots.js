export default function robots() {
  const baseUrl = process.env.SITE_URL || 'https://www.socialtech.id.vn/'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
