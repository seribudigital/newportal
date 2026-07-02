import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sit-portal.sch.id';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/tentang',
    '/jenjang/tkit',
    '/jenjang/sdit',
    '/jenjang/mts',
    '/jenjang/ma',
    '/berita',
    '/galeri',
    '/kontak',
    '/ppdb',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '/berita' || route === '/ppdb' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/ppdb' ? 0.9 : 0.8,
  }));
}
