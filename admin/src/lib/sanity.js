import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'd2tkdmxe',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
})

export const SITE_SLUG = import.meta.env.VITE_SITE_SLUG || 'villerest'

// ── Lecture ────────────────────────────────────────────────────────────────
export async function getSite() {
  return client.fetch(
    `*[_type == "site" && slug.current == $slug][0]`,
    { slug: SITE_SLUG }
  )
}

export async function getNav() {
  return client.fetch(
    `*[_type == "navigation" && site->slug.current == $slug][0]`,
    { slug: SITE_SLUG }
  )
}

export async function getPages() {
  return client.fetch(
    `*[_type == "page" && site->slug.current == $slug] | order(title asc) { _id, title, slug }`,
    { slug: SITE_SLUG }
  )
}

export async function getPage(id) {
  return client.fetch(`*[_id == $id][0]`, { id })
}

// ── Upload image ────────────────────────────────────────────────────────────
export async function uploadImage(file) {
  return client.assets.upload('image', file, { filename: file.name })
}

// ── Écriture ────────────────────────────────────────────────────────────────
export async function saveSite(id, patch) {
  return client.patch(id).set(patch).commit()
}

export async function saveNav(id, items) {
  return client.patch(id).set({ items }).commit()
}

export async function savePage(id, patch) {
  return client.patch(id).set(patch).commit()
}

// ── Portable text helpers ───────────────────────────────────────────────────
export function blocksToText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .filter(b => b._type === 'block')
    .map(b => (b.children || []).map(c => c.text || '').join(''))
    .join('\n\n')
}

export function textToBlocks(text) {
  if (!text || !text.trim()) return []
  return text.split('\n\n').filter(Boolean).map(paragraph => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: Math.random().toString(36).slice(2, 9),
      text: paragraph.trim(),
      marks: []
    }]
  }))
}

// ── Image URL ───────────────────────────────────────────────────────────────
export function imageUrl(ref) {
  if (!ref) return null
  const id = ref._ref || ref
  const [, , dims, fmt] = id.split('-')
  return `https://cdn.sanity.io/images/d2tkdmxe/production/${id.replace('image-', '').replace(`-${fmt}`, '')}.${fmt}`
}
