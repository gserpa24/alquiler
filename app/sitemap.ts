import { MetadataRoute } from 'next'
import { MOCK_VEHICLES } from '@/lib/mock-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://premiumauto.ec'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const vehicleRoutes: MetadataRoute.Sitemap = MOCK_VEHICLES.filter(
    (v) => v.status !== 'sold'
  ).map((v) => ({
    url: `${baseUrl}/catalog/${v.slug}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [...staticRoutes, ...vehicleRoutes]
}
