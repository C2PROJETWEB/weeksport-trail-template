export default function HelpEditor() {
  return (
    <div className="space-y-5 pb-10">
      <h2 className="text-xl font-bold text-slate-800">Guide d'utilisation</h2>

      <Notice type="info">
        Toute modification est <strong>sauvegardée instantanément</strong> dans la base de données.
        Elle apparaît sur le site public dans <strong>2 à 4 minutes</strong> (rebuild automatique).
      </Notice>

      {/* Accueil */}
      <Section icon="🏠" title="Onglet Accueil">
        <Item label="Logo & Favicon">
          Uploadez le logo affiché dans le header/footer et l'icône visible dans l'onglet du navigateur.
          Formats acceptés : PNG, SVG, ICO.
        </Item>
        <Item label="Photo d'en-tête">
          Image affichée en grand fond sur la page d'accueil. Préférez une image large (min. 1920×1080 px).
        </Item>
        <Item label="Vidéo d'en-tête (optionnel)">
          Collez l'URL directe d'un fichier <code>.mp4</code> (Dropbox, Google Drive, Cloudinary…).
          Si renseignée, la vidéo remplace la photo. La photo reste utilisée comme poster de chargement.
        </Item>
        <Item label="Titre, date, bouton d'inscription">
          Texte affiché au centre du hero. Le bouton d'inscription ouvre l'URL renseignée dans un nouvel onglet.
        </Item>
        <Item label="Description SEO">
          Texte affiché sous le titre dans les résultats Google. Maximum 160 caractères.
        </Item>
        <Item label="Événements dans le footer">
          <strong>Organisateur</strong> : logo + lien affiché en bas de page sous "Un événement organisé par…"<br />
          <strong>Nos événements Trail / Autres événements</strong> : logos cliquables vers d'autres sites.
          Si un logo est manquant, le nom s'affiche en texte.
        </Item>
      </Section>

      {/* Menu */}
      <Section icon="☰" title="Onglet Menu">
        <Item label="Éléments de navigation">
          Chaque ligne correspond à un lien dans la barre de navigation.
          Le champ <em>Slug</em> doit correspondre exactement au slug de la page (ex : <code>les-epreuves</code>).
        </Item>
        <Item label="Sous-menu (épreuves)">
          Un élément avec des sous-liens affiche un menu déroulant. C'est utilisé pour les épreuves.
          Chaque sous-lien doit pointer vers le slug d'une page existante.
        </Item>
        <Item label="Ordre">
          Glissez-déposez les éléments pour réordonner la navigation. Cliquez sur Enregistrer ensuite.
        </Item>
      </Section>

      {/* Pages */}
      <Section icon="📄" title="Onglet Pages">
        <Item label="Choisir une page">
          Sélectionnez la page à modifier dans la liste déroulante. Chaque page correspond à une URL du site.
        </Item>
        <Item label="Réordonner / supprimer les sections">
          Chaque section affiche une barre sombre avec des boutons <strong>↑ ↓ ✕</strong>.
          Le déplacement et la suppression sont sauvegardés immédiatement.
        </Item>
        <Item label="Ajouter une section">
          Cliquez sur <em>"+ Ajouter une section"</em> en bas de la page pour choisir parmi 11 types :
          bloc texte, galerie, compte à rebours, épreuves, résultats, partenaires, bénévoles, contact,
          programme, albums photos, espace pub.
        </Item>
        <Item label="📝 Bloc texte">
          Titre + contenu rédigé (retours à la ligne respectés). Vous pouvez ajouter des photos et des boutons
          (texte, lien, style plein ou contour, ouverture dans un nouvel onglet).
        </Item>
        <Item label="📢 Espace pub">
          1 à 3 bannières publicitaires affichées côte à côte. Chaque bannière : image uploadée ou URL externe,
          lien cliquable, texte alternatif.
        </Item>
        <Item label="🖼️ Galerie photos">
          Uploadez plusieurs photos. Elles s'affichent en grille responsive.
        </Item>
        <Item label="🤝 Partenaires">
          Logos des partenaires avec liens. Choisissez la catégorie (événement, institutionnel, médias…).
        </Item>
      </Section>

      {/* Publication */}
      <Section icon="🚀" title="Publication sur le site">
        <Item label="Comment ça fonctionne ?">
          Quand vous enregistrez depuis l'admin, les données sont envoyées à Sanity (base de données).
          Sanity déclenche automatiquement un <em>webhook</em> → GitHub Actions → rebuild Astro → déploiement Cloudflare.
        </Item>
        <Item label="Délai">
          Le site public est mis à jour en <strong>2 à 4 minutes</strong> après l'enregistrement.
          L'admin, lui, reflète les changements <strong>immédiatement</strong>.
        </Item>
        <Item label="Sitemap Google">
          La sitemap est disponible à l'adresse <code>/sitemap-index.xml</code>. Elle est
          automatiquement régénérée à chaque rebuild et liste toutes les pages du site.
        </Item>
      </Section>

      {/* Conseils */}
      <Section icon="💡" title="Bonnes pratiques">
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span> Optimisez vos images avant upload (max 2 Mo recommandé).</li>
          <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span> Pour les logos, privilégiez le format PNG avec fond transparent ou SVG.</li>
          <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span> Le favicon doit être carré (ex : 64×64 px ou 512×512 px).</li>
          <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span> La description SEO doit être unique par page et ne pas dépasser 160 caractères.</li>
          <li className="flex gap-2"><span className="text-yellow-500 shrink-0">⚠</span> Ne supprimez pas la page <strong>accueil</strong> — elle est obligatoire pour la page d'accueil du site.</li>
          <li className="flex gap-2"><span className="text-yellow-500 shrink-0">⚠</span> Les slugs de pages doivent être en minuscules, sans accents ni espaces (ex : <code>les-epreuves</code>).</li>
        </ul>
      </Section>

      <p className="text-xs text-slate-400 text-center pt-2">
        Une création <a href="https://www.c2projetweb.fr" target="_blank" rel="noopener" className="underline hover:text-slate-600">C2 Projet Web</a>
      </p>
    </div>
  )
}

function Section({ icon, title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
        <span>{icon}</span>
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  )
}

function Item({ label, children }) {
  return (
    <div className="flex gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
      <div className="text-sm text-slate-600 leading-relaxed">
        <span className="font-semibold text-slate-800">{label} — </span>
        {children}
      </div>
    </div>
  )
}

function Notice({ type, children }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warn: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }
  return (
    <div className={`border rounded-xl px-5 py-4 text-sm ${styles[type]}`}>
      {children}
    </div>
  )
}
