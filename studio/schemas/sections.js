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
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                fields: [{ name: 'href', type: 'url', title: 'URL' }]
              }
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
      options: { layout: 'grid' },
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
      name: 'groupe',
      title: 'Groupe',
      type: 'string',
      initialValue: 'evenement',
      options: {
        list: [
          { title: 'Partenaires de l\'événement', value: 'evenement' },
          { title: 'Partenaires de l\'agence', value: 'agence' }
        ],
        layout: 'radio'
      }
    },
    { name: 'description', title: 'Description (sous le titre)', type: 'text', rows: 2 },
    {
      name: 'partenaires',
      title: 'Liste des partenaires',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'nom', title: 'Nom', type: 'string' },
          { name: 'logo', title: 'Logo (upload)', type: 'image', options: { hotspot: true } },
          { name: 'logoUrl', title: 'Logo URL externe', type: 'url', description: 'Si pas d\'upload Sanity' },
          { name: 'url', title: 'Site web du partenaire', type: 'url' }
        ],
        preview: {
          select: { title: 'nom', media: 'logo' },
          prepare({ title, media }) { return { title: title || 'Partenaire', media } }
        }
      }]
    }
  ],
  preview: {
    select: { titre: 'titre', groupe: 'groupe' },
    prepare({ titre, groupe }) { return { title: `${titre || 'Partenaires'} (${groupe || 'evenement'})` } }
  }
}

export const sectionEpreuves = {
  name: 'sectionEpreuves',
  title: 'Les épreuves',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre de la section', type: 'string', initialValue: 'Les épreuves' },
    {
      name: 'epreuves',
      title: 'Épreuves',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'nom',
            title: 'Nom de l\'épreuve',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'distance',
            title: 'Distance',
            type: 'string',
            description: 'Ex: 23 km'
          },
          {
            name: 'denivele',
            title: 'Dénivelé positif',
            type: 'string',
            description: 'Ex: +1200 m'
          },
          {
            name: 'depart',
            title: 'Heure de départ',
            type: 'string',
            description: 'Ex: 19h30'
          },
          {
            name: 'description',
            title: 'Description courte (carte)',
            type: 'text',
            rows: 2,
            description: 'Affiché sur la carte multi-épreuves'
          },
          {
            name: 'image',
            title: 'Image principale (upload)',
            type: 'image',
            options: { hotspot: true }
          },
          {
            name: 'imageUrl',
            title: 'Image principale URL externe',
            type: 'url',
            description: 'Si pas d\'upload Sanity'
          },
          {
            name: 'photos',
            title: 'Galerie photos (4 max)',
            type: 'array',
            options: { layout: 'grid' },
            of: [{
              type: 'object',
              title: 'Photo',
              fields: [
                { name: 'image', title: 'Upload photo', type: 'image', options: { hotspot: true } },
                { name: 'url', title: 'OU URL externe', type: 'url' }
              ],
              preview: {
                select: { media: 'image', url: 'url' },
                prepare({ media, url }) { return { title: url || 'Photo', media } }
              }
            }],
            validation: Rule => Rule.max(4)
          },
          {
            name: 'openrunnerUrl',
            title: 'Carte du parcours (OpenRunner)',
            type: 'url',
            description: 'URL embed depuis openrunner.com/embed/...'
          },
          {
            name: 'lienPage',
            title: 'Lien page dédiée',
            type: 'string',
            description: 'Ex: /run-night — lien cliquable sur la carte d\'accueil'
          },
          {
            name: 'lienInscription',
            title: 'Lien inscription',
            type: 'url',
            description: 'Ex: https://www.chronopuces.fr/...'
          }
        ],
        preview: {
          select: { title: 'nom', subtitle: 'distance', media: 'image' },
          prepare({ title, subtitle, media }) {
            return { title: title || 'Épreuve', subtitle: subtitle || '', media }
          }
        }
      }]
    }
  ],
  preview: {
    select: { titre: 'titre' },
    prepare({ titre }) { return { title: `Épreuves — ${titre || ''}` } }
  }
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
          { name: 'annee', title: 'Année', type: 'string', description: 'Ex: 2025' },
          { name: 'lien', title: 'Lien vers les résultats', type: 'url' },
          { name: 'fichier', title: 'Ou fichier PDF', type: 'file' }
        ],
        preview: {
          select: { title: 'annee' },
          prepare({ title }) { return { title: `Résultats ${title || ''}` } }
        }
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
    { name: 'email', title: 'Email de contact', type: 'string' },
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
    { name: 'lienInscription', title: 'Lien inscription bénévoles', type: 'url' },
    { name: 'image', title: 'Image (upload)', type: 'image', options: { hotspot: true } },
    { name: 'imageUrl', title: 'Image URL externe', type: 'url', description: 'Si pas d\'upload Sanity' }
  ],
  preview: { prepare() { return { title: 'Bénévoles' } } }
}

export const sectionCompteur = {
  name: 'sectionCompteur',
  title: 'Compte à rebours',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Prochaine édition' },
    {
      name: 'dateEpreuve',
      title: 'Date et heure de départ',
      type: 'datetime',
      description: 'Date et heure locale (France) — ex: 29 août 2026 à 19h30',
      options: { dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', timeStep: 15 }
    }
  ],
  preview: {
    select: { titre: 'titre', date: 'dateEpreuve' },
    prepare({ titre, date }) {
      return { title: `Compte à rebours — ${titre || ''}`, subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : '' }
    }
  }
}

export const sectionProgramme = {
  name: 'sectionProgramme',
  title: 'Programme',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Le Programme' },
    {
      name: 'contenu',
      title: 'Contenu du programme',
      type: 'array',
      of: [{
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
      }]
    },
    { name: 'image', title: 'Image de fond (upload)', type: 'image', options: { hotspot: true } },
    { name: 'imageUrl', title: 'Image de fond URL externe', type: 'url', description: 'Si pas d\'upload Sanity' }
  ],
  preview: { prepare() { return { title: 'Programme' } } }
}

export const sectionPhotos = {
  name: 'sectionPhotos',
  title: 'Photos par année',
  type: 'object',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'Photos' },
    {
      name: 'annees',
      title: 'Albums par année',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'annee', title: 'Année', type: 'string', description: 'Ex: 2025' },
          { name: 'lien', title: 'Lien vers l\'album photo', type: 'url' },
          { name: 'image', title: 'Image d\'aperçu (upload)', type: 'image', options: { hotspot: true } },
          { name: 'imageUrl', title: 'Image d\'aperçu URL externe', type: 'url', description: 'Si pas d\'upload Sanity' }
        ],
        preview: {
          select: { title: 'annee', media: 'image' },
          prepare({ title, media }) { return { title: `Album ${title || ''}`, media } }
        }
      }]
    }
  ],
  preview: { prepare() { return { title: 'Photos par année' } } }
}
