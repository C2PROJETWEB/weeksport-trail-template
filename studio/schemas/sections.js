export const sectionTexte = {
  name: 'sectionTexte',
  title: 'Bloc texte / contenu',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string' },
    {
      name: 'contenu',
      title: 'Contenu',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' }
          ],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' }
            ]
          }
        },
        { type: 'image', options: { hotspot: true } }
      ]
    }
  ],
  preview: { select: { title: 'titre' }, prepare({ title }) { return { title: `Texte — ${title || 'Sans titre'}` } } }
}

export const sectionGalerie = {
  name: 'sectionGalerie',
  title: 'Galerie photos',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre de la galerie', type: 'string' },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [{ name: 'caption', title: 'Légende', type: 'string' }]
      }]
    }
  ],
  preview: { select: { title: 'titre' }, prepare({ title }) { return { title: `Galerie — ${title || ''}` } } }
}

export const sectionPartenaires = {
  name: 'sectionPartenaires',
  title: 'Partenaires',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Nos partenaires' },
    {
      name: 'partenaires',
      title: 'Liste des partenaires',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'nom', title: 'Nom', type: 'string' },
          { name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } },
          { name: 'url', title: 'Site web', type: 'url' }
        ],
        preview: { select: { title: 'nom', media: 'logo' } }
      }]
    }
  ],
  preview: { prepare() { return { title: 'Partenaires' } } }
}

export const sectionEpreuves = {
  name: 'sectionEpreuves',
  title: 'Les épreuves',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Les épreuves' },
    {
      name: 'epreuves',
      title: 'Épreuves',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'nom', title: 'Nom', type: 'string' },
          { name: 'distance', title: 'Distance', type: 'string', description: 'Ex: 23 km' },
          { name: 'denivele', title: 'Dénivelé', type: 'string', description: 'Ex: +1200 m' },
          { name: 'description', title: 'Description', type: 'text', rows: 3 },
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'lienInscription', title: "Lien d'inscription", type: 'url' }
        ],
        preview: { select: { title: 'nom', subtitle: 'distance' } }
      }]
    }
  ],
  preview: { prepare() { return { title: 'Les épreuves' } } }
}

export const sectionResultats = {
  name: 'sectionResultats',
  title: 'Résultats',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Résultats' },
    {
      name: 'annees',
      title: 'Résultats par année',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'annee', title: 'Année', type: 'string' },
          { name: 'lien', title: 'Lien vers les résultats', type: 'url' },
          { name: 'fichier', title: 'Ou fichier PDF', type: 'file' }
        ],
        preview: { select: { title: 'annee' } }
      }]
    }
  ],
  preview: { prepare() { return { title: 'Résultats' } } }
}

export const sectionContact = {
  name: 'sectionContact',
  title: 'Contact',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Contactez-nous' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'telephone', title: 'Téléphone', type: 'string' },
    { name: 'adresse', title: 'Adresse', type: 'text', rows: 2 },
    { name: 'texteFormulaire', title: 'Texte au-dessus du formulaire', type: 'text', rows: 2 }
  ],
  preview: { prepare() { return { title: 'Contact' } } }
}

export const sectionBenevoles = {
  name: 'sectionBenevoles',
  title: 'Bénévoles',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Devenir bénévole' },
    { name: 'description', title: 'Description', type: 'text', rows: 4 },
    { name: 'lienInscription', title: "Lien d'inscription bénévoles", type: 'url' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
  ],
  preview: { prepare() { return { title: 'Bénévoles' } } }
}
