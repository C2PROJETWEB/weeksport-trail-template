import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = createImageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

export function fileUrl(ref) {
  if (!ref) return null
  const id = ref._ref || ref
  const body = id.replace(/^file-/, '')
  const lastDash = body.lastIndexOf('-')
  const hash = body.slice(0, lastDash)
  const ext = body.slice(lastDash + 1)
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'd2tkdmxe'
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${hash}.${ext}`
}

export async function getSite(siteSlug) {
  return client.fetch(
    `*[_type == "site" && slug.current == $slug][0]{
      name, slug, logo, logoUrl, favicon, couleurPrimaire, couleurSecondaire,
      heroImage, heroImageUrl, heroVideoUrl, heroTitre, heroDate, heroCTA, heroCTAUrl, metaDescription,
      organisateur{ nom, logo, logoUrl, lien },
      evenementsTrail[]{ nom, logo, logoUrl, url },
      autresEvenements[]{ nom, logo, logoUrl, url }
    }`,
    { slug: siteSlug }
  )
}

export async function getNavigation(siteSlug) {
  return client.fetch(
    `*[_type == "navigation" && site->slug.current == $slug][0]{ items }`,
    { slug: siteSlug }
  )
}

export async function getPage(siteSlug, pageSlug) {
  return client.fetch(
    `*[_type == "page" && site->slug.current == $siteSlug && slug.current == $pageSlug][0]{
      title, slug, sections
    }`,
    { siteSlug, pageSlug }
  )
}

export async function getPages(siteSlug) {
  return client.fetch(
    `*[_type == "page" && site->slug.current == $slug]{ title, slug }`,
    { slug: siteSlug }
  )
}
