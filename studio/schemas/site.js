// Champs réservés à l'administrateur (cachés pour les éditeurs)
const adminOnly = ({ currentUser }) =>
  !currentUser?.roles?.find(r => r.name === 'administrator')

export default {
  name: 'site',
  title: 'Site',
  type: 'document',
  liveEdit: true,
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
      validation: Rule => Rule.required(),
      hidden: adminOnly,
      readOnly: adminOnly,
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'logoUrl',
      title: 'URL logo (externe)',
      type: 'url',
      description: 'Utilisé si pas de logo uploadé dans Sanity',
      hidden: adminOnly,
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      hidden: adminOnly,
    },
    {
      name: 'couleurPrimaire',
      title: 'Couleur principale',
      type: 'string',
      description: 'Code hexadécimal, ex: #E63946',
      validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6})$/, { name: 'hex color' }),
      hidden: adminOnly,
    },
    {
      name: 'couleurSecondaire',
      title: 'Couleur secondaire',
      type: 'string',
      description: 'Code hexadécimal, ex: #1D3557',
      hidden: adminOnly,
    },
    {
      name: 'heroImage',
      title: "Photo d'en-tête",
      type: 'image',
      options: { hotspot: true },
      description: 'Photo principale affichée en haut du site (utilisée aussi comme poster si vidéo)'
    },
    {
      name: 'heroImageUrl',
      title: "URL image d'en-tête (externe)",
      type: 'url',
      description: 'Utilisé si pas d\'image uploadée',
      hidden: adminOnly,
    },
    {
      name: 'heroVideoUrl',
      title: "Vidéo d'en-tête (URL)",
      type: 'url',
      description: 'URL directe vers un fichier MP4 (ex: https://monsite.com/video.mp4). Si renseignée, remplace la photo.',
    },
    {
      name: 'heroTitre',
      title: 'Titre principal',
      type: 'string',
      description: 'Nom de l\'événement affiché en grand sur l\'en-tête'
    },
    {
      name: 'heroDate',
      title: "Date de l'événement",
      type: 'string',
      description: 'Ex: 29 août 2026'
    },
    {
      name: 'heroCTA',
      title: 'Texte du bouton principal',
      type: 'string',
      description: 'Ex: S\'inscrire maintenant'
    },
    {
      name: 'heroCTAUrl',
      title: 'Lien du bouton principal',
      type: 'url',
      description: 'URL vers le formulaire d\'inscription'
    },
    {
      name: 'metaDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 2,
      description: 'Texte affiché dans les résultats Google (160 caractères max)'
    },
    {
      name: 'organisateur',
      title: 'Organisateur (footer)',
      type: 'object',
      description: 'Affiché dans le footer : "Un événement organisé par…"',
      fields: [
        { name: 'nom', title: 'Nom', type: 'string', initialValue: 'Weekandsport' },
        { name: 'logo', title: 'Logo (upload)', type: 'image', options: { hotspot: true } },
        { name: 'logoUrl', title: 'Logo URL externe', type: 'url', description: 'Si pas d\'upload' },
        { name: 'lien', title: 'Lien vers le site', type: 'url' }
      ]
    },
    {
      name: 'evenementsTrail',
      title: 'Événements Trail (footer)',
      type: 'array',
      description: 'Logos affichés dans le footer — "Nos événements Trail"',
      of: [{
        type: 'object',
        fields: [
          { name: 'nom', title: 'Nom', type: 'string' },
          { name: 'logo', title: 'Logo (upload)', type: 'image', options: { hotspot: true } },
          { name: 'logoUrl', title: 'Logo URL externe', type: 'url', description: 'Si pas d\'upload' },
          { name: 'url', title: 'Lien vers le site', type: 'url' }
        ],
        preview: {
          select: { title: 'nom', media: 'logo' },
          prepare({ title, media }) { return { title: title || 'Événement trail', media } }
        }
      }]
    },
    {
      name: 'autresEvenements',
      title: 'Autres événements (footer)',
      type: 'array',
      description: 'Logos affichés dans le footer — "Nos autres événements"',
      of: [{
        type: 'object',
        fields: [
          { name: 'nom', title: 'Nom', type: 'string' },
          { name: 'logo', title: 'Logo (upload)', type: 'image', options: { hotspot: true } },
          { name: 'logoUrl', title: 'Logo URL externe', type: 'url', description: 'Si pas d\'upload' },
          { name: 'url', title: 'Lien vers le site', type: 'url' }
        ],
        preview: {
          select: { title: 'nom', media: 'logo' },
          prepare({ title, media }) { return { title: title || 'Autre événement', media } }
        }
      }]
    }
    {
      name: 'documentsGlobaux',
      title: 'Documents partagés',
      type: 'array',
      description: 'Documents téléchargeables disponibles pour toutes les pages',
      of: [{
        type: 'object',
        fields: [
          { name: 'nom', title: 'Nom affiché', type: 'string', validation: Rule => Rule.required() },
          { name: 'fichier', title: 'Fichier', type: 'file' }
        ],
        preview: {
          select: { title: 'nom' },
          prepare({ title }) { return { title: title || 'Document' } }
        }
      }]
    }
  ],
  preview: {
    select: { title: 'name', media: 'logo' }
  }
}
