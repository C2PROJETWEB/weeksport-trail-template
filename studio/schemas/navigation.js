const adminOnly = ({ currentUser }) =>
  !currentUser?.roles?.find(r => r.name === 'administrator')

export default {
  name: 'navigation',
  title: 'Menu de navigation',
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
      name: 'items',
      title: 'Éléments du menu',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            { name: 'label', title: 'Libellé', type: 'string' },
            { name: 'slug', title: 'Lien (slug)', type: 'string', description: 'Ex: infos-pratiques' },
            {
              name: 'sousMenu',
              title: 'Sous-menu',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Libellé', type: 'string' },
                    { name: 'slug', title: 'Lien', type: 'string' }
                  ]
                }
              ]
            }
          ],
          preview: { select: { title: 'label' } }
        }
      ]
    }
  ],
  preview: {
    select: { title: 'site.name' },
    prepare({ title }) { return { title: `Menu — ${title}` } }
  }
}
