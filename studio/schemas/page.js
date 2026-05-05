export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'site',
      title: 'Site',
      type: 'reference',
      to: [{ type: 'site' }],
      validation: Rule => Rule.required()
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
      validation: Rule => Rule.required()
    },
    {
      name: 'sections',
      title: 'Sections de la page',
      type: 'array',
      of: [
        { type: 'sectionTexte' },
        { type: 'sectionGalerie' },
        { type: 'sectionPartenaires' },
        { type: 'sectionEpreuves' },
        { type: 'sectionResultats' },
        { type: 'sectionContact' },
        { type: 'sectionBenevoles' }
      ]
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'site.name' }
  }
}
