const adminOnly = ({ currentUser }) =>
  !currentUser?.roles?.find(r => r.name === 'administrator')

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  liveEdit: true,
  fields: [
    {
      name: 'site',
      title: 'Site',
      type: 'reference',
      to: [{ type: 'site' }],
      validation: Rule => Rule.required(),
      hidden: adminOnly,
      readOnly: adminOnly,
    },
    {
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
      hidden: adminOnly,
      readOnly: adminOnly,
    },
    {
      name: 'sections',
      title: 'Contenu de la page',
      type: 'array',
      of: [
        { type: 'sectionTexte' },
        { type: 'sectionGalerie' },
        { type: 'sectionPartenaires' },
        { type: 'sectionEpreuves' },
        { type: 'sectionResultats' },
        { type: 'sectionContact' },
        { type: 'sectionBenevoles' },
        { type: 'sectionCompteur' },
        { type: 'sectionProgramme' },
        { type: 'sectionPhotos' }
      ]
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'site.name' }
  }
}
