import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/index'

export default defineConfig({
  name: 'weeksport-trail-cms',
  title: 'WEEK&SPORT — Gestion des sites Trail',

  projectId: process.env.SANITY_PROJECT_ID || 'REMPLACER_PAR_VOTRE_PROJECT_ID',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('WEEK&SPORT Trail CMS')
          .items([
            S.listItem()
              .title('Sites')
              .icon(() => '🏃')
              .child(
                S.documentTypeList('site')
                  .title('Mes sites Trail')
              ),
            S.divider(),
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(
                S.documentTypeList('page')
                  .title('Toutes les pages')
              ),
            S.listItem()
              .title('Menus de navigation')
              .icon(() => '☰')
              .child(
                S.documentTypeList('navigation')
                  .title('Menus')
              ),
          ])
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
