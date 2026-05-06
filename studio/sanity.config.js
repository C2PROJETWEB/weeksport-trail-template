import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas/index'

// Raccourci : lien direct vers une page par son ID
const pageLien = (S, id, titre) =>
  S.listItem().title(titre).child(
    S.document().schemaType('page').documentId(id).title(titre)
  )

export default defineConfig({
  name: 'weeksport-admin',
  title: 'WEEK&SPORT Admin',

  projectId: process.env.SANITY_PROJECT_ID || 'd2tkdmxe',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Événements')
          .items([

            // ── TRAIL DU LAC DE VILLEREST ──────────────────────
            S.listItem()
              .title('🏞️ Trail du Lac de Villerest')
              .child(
                S.list()
                  .title('Trail du Lac de Villerest')
                  .items([

                    S.listItem().title('⚙️  Logo · Couleurs · Bouton inscription').child(
                      S.document().schemaType('site').documentId('site-villerest').title('Réglages du site')
                    ),
                    S.listItem().title('☰  Menu de navigation').child(
                      S.documentList().schemaType('navigation').title('Menu')
                        .filter('_type == "navigation" && site._ref == *[_type=="site" && slug.current=="villerest"][0]._id')
                    ),

                    S.divider(),

                    S.listItem().title('── Les Épreuves ──').child(
                      S.list().title('Épreuves').items([
                        pageLien(S, 'page-villerest-run-night',          '🌙  Run Night 9 km'),
                        pageLien(S, 'page-villerest-echappee-nocturne',  '🦉  Échappée Nocturne 11 km'),
                        pageLien(S, 'page-villerest-tour-du-lac',        '🏃  Tour du Lac 23 km'),
                        pageLien(S, 'page-villerest-grand-duc',          '🏔️  Grand Duc 43 km'),
                        pageLien(S, 'page-villerest-course-enfants',     '🧒  Course Enfants'),
                        pageLien(S, 'page-villerest-randonnees',         '🥾  Randonnées'),
                      ])
                    ),

                    S.divider(),

                    S.listItem().title('── Informations ──').child(
                      S.list().title('Informations').items([
                        pageLien(S, 'page-villerest-programme',   '📅  Programme'),
                        pageLien(S, 'page-villerest-reglement',   '📋  Règlement'),
                        pageLien(S, 'page-villerest-repas',       '🍽️  Repas'),
                        pageLien(S, 'page-villerest-hebergement', '🛏️  Hébergement'),
                        pageLien(S, 'page-villerest-benevoles',   '🙋  Bénévoles'),
                      ])
                    ),

                    S.divider(),

                    S.listItem().title('── Résultats & Médias ──').child(
                      S.list().title('Résultats & Médias').items([
                        pageLien(S, 'page-villerest-resultats', '🏆  Résultats'),
                        pageLien(S, 'page-villerest-photos',    '📷  Photos'),
                      ])
                    ),

                    S.divider(),

                    pageLien(S, 'page-villerest-partenaires', '🤝  Partenaires'),
                    pageLien(S, 'page-villerest-contact',     '📞  Contact'),

                  ])
              ),

            S.divider(),

            // ── AUTRES ÉVÉNEMENTS ──────────────────────────────
            S.listItem()
              .title('🌍 Trail de la Planète Mars')
              .child(
                S.list().title('Trail de la Planète Mars').items([
                  S.listItem().title('⚙️  Réglages').child(
                    S.document().schemaType('site').documentId('site-planete').title('Réglages')
                  ),
                  S.listItem().title('☰  Menu').child(
                    S.documentList().schemaType('navigation').title('Menu')
                      .filter('_type == "navigation" && site._ref == *[_type=="site" && slug.current=="planete"][0]._id')
                  ),
                  S.listItem().title('📄  Pages').child(
                    S.documentList().schemaType('page').title('Pages')
                      .filter('_type == "page" && site._ref == *[_type=="site" && slug.current=="planete"][0]._id')
                  ),
                ])
              ),

            S.listItem()
              .title('🏙️ Roanne Trail Urbain')
              .child(
                S.list().title('Roanne Trail Urbain').items([
                  S.listItem().title('⚙️  Réglages').child(
                    S.document().schemaType('site').documentId('site-roanne').title('Réglages')
                  ),
                  S.listItem().title('☰  Menu').child(
                    S.documentList().schemaType('navigation').title('Menu')
                      .filter('_type == "navigation" && site._ref == *[_type=="site" && slug.current=="roanne"][0]._id')
                  ),
                  S.listItem().title('📄  Pages').child(
                    S.documentList().schemaType('page').title('Pages')
                      .filter('_type == "page" && site._ref == *[_type=="site" && slug.current=="roanne"][0]._id')
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
