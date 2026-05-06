import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas/index'

export default defineConfig({
  name: 'weeksport-admin',
  title: 'WEEK&SPORT Admin',

  projectId: process.env.SANITY_PROJECT_ID || 'd2tkdmxe',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Gestion des événements')
          .items([
            S.listItem()
              .title('🏃 Trail du Lac de Villerest')
              .child(
                S.list()
                  .title('Trail du Lac de Villerest')
                  .items([
                    S.listItem().title('⚙️ Réglages du site').child(
                      S.document().schemaType('site').documentId('site-villerest').title('Réglages')
                    ),
                    S.listItem().title('☰ Menu de navigation').child(
                      S.documentList().schemaType('navigation').title('Menu').filter('_type == "navigation" && site._ref == *[_type=="site" && slug.current=="villerest"][0]._id')
                    ),
                    S.listItem().title('📄 Pages').child(
                      S.documentList().schemaType('page').title('Pages').filter('_type == "page" && site._ref == *[_type=="site" && slug.current=="villerest"][0]._id')
                    ),
                  ])
              ),
            S.listItem()
              .title('🌍 Trail de la Planète Mars')
              .child(
                S.list()
                  .title('Trail de la Planète Mars')
                  .items([
                    S.listItem().title('⚙️ Réglages du site').child(
                      S.document().schemaType('site').documentId('site-planete').title('Réglages')
                    ),
                    S.listItem().title('☰ Menu de navigation').child(
                      S.documentList().schemaType('navigation').title('Menu').filter('_type == "navigation" && site._ref == *[_type=="site" && slug.current=="planete"][0]._id')
                    ),
                    S.listItem().title('📄 Pages').child(
                      S.documentList().schemaType('page').title('Pages').filter('_type == "page" && site._ref == *[_type=="site" && slug.current=="planete"][0]._id')
                    ),
                  ])
              ),
            S.listItem()
              .title('🏙️ Roanne Trail Urbain')
              .child(
                S.list()
                  .title('Roanne Trail Urbain')
                  .items([
                    S.listItem().title('⚙️ Réglages du site').child(
                      S.document().schemaType('site').documentId('site-roanne').title('Réglages')
                    ),
                    S.listItem().title('☰ Menu de navigation').child(
                      S.documentList().schemaType('navigation').title('Menu').filter('_type == "navigation" && site._ref == *[_type=="site" && slug.current=="roanne"][0]._id')
                    ),
                    S.listItem().title('📄 Pages').child(
                      S.documentList().schemaType('page').title('Pages').filter('_type == "page" && site._ref == *[_type=="site" && slug.current=="roanne"][0]._id')
                    ),
                  ])
              ),
          ])
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
