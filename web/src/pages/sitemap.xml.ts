import type { APIRoute } from 'astro'
import { getPages } from '../lib/sanity'

export const GET: APIRoute = async () => {
  const siteSlug = import.meta.env.PUBLIC_SITE_SLUG
  const base = import.meta.env.PUBLIC_SITE_URL || 'https://weeksport-villerest.pages.dev'

  const pages = await getPages(siteSlug)

  const urls = [
    `${base}/`,
    ...pages
      .filter(p => p.slug?.current && p.slug.current !== 'accueil')
      .map(p => `${base}/${p.slug.current}/`)
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
