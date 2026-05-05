export default {
  name: 'site',
  title: 'Site',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nom du site',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Identifiant unique',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required()
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image'
    },
    {
      name: 'couleurPrimaire',
      title: 'Couleur principale',
      type: 'string',
      description: 'Code hexadécimal, ex: #E63946',
      validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6})$/, { name: 'hex color' })
    },
    {
      name: 'couleurSecondaire',
      title: 'Couleur secondaire',
      type: 'string',
      description: 'Code hexadécimal, ex: #1D3557'
    },
    {
      name: 'heroImage',
      title: "Image d'en-tête",
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'heroImageUrl',
      title: "URL image d'en-tête (externe)",
      type: 'url',
      description: 'Utilisé si pas d\'image uploadée dans Sanity'
    },
    {
      name: 'logoUrl',
      title: 'URL logo (externe)',
      type: 'url',
      description: 'Utilisé si pas de logo uploadé dans Sanity'
    },
    {
      name: 'heroTitre',
      title: "Titre principal",
      type: 'string'
    },
    {
      name: 'heroDate',
      title: "Date de l'événement",
      type: 'string',
      description: 'Ex: 29 août 2026'
    },
    {
      name: 'heroCTA',
      title: "Texte du bouton principal",
      type: 'string'
    },
    {
      name: 'heroCTAUrl',
      title: "Lien du bouton principal",
      type: 'url'
    },
    {
      name: 'metaDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 2
    }
  ],
  preview: {
    select: { title: 'name', media: 'logo' }
  }
}
