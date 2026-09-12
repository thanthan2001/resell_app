import { getCatalog } from '@/lib/source-api'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialtech.vn'

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    const data = await getCatalog()
    const products = data.products || []

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/shop/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...routes, ...productRoutes]
  } catch (err) {
    console.error('Sitemap product fetch error:', err)
    return routes
  }
}
