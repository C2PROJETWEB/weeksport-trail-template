# WEEK&SPORT — Trail Template

Template multi-sites pour événements trail. Un seul admin Sanity, N sites déployés.

## Structure

```
trail-template/
├── studio/   → Admin Sanity (interface client)
└── web/      → Template Astro (site public)
```

## Démarrage rapide

### 1. Créer le projet Sanity

1. Aller sur https://sanity.io → créer un compte
2. Nouveau projet → "weeksport-trail-cms"
3. Récupérer le **Project ID**

### 2. Configurer le Studio

```bash
cd studio
# Mettre le Project ID dans sanity.config.js
npm run dev        # Lance l'admin sur http://localhost:3333
npm run deploy     # Déploie l'admin sur studio.sanity.io/weeksport-trail-cms
```

Dans le Studio, créer les 3 sites :
- `villerest` → Trail du Lac de Villerest
- `planete` → Trail de la Planète Mars
- `roanne` → Roanne Trail Urbain

### 3. Déployer un site

Pour chaque site, copier le dossier `web/` et créer un `.env` :

```env
PUBLIC_SANITY_PROJECT_ID=votre_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SITE_SLUG=villerest   # ← changer par site
```

Puis déployer sur Netlify :
- Connecter le repo GitHub
- Build command : `npm run build`
- Publish directory : `dist`
- Ajouter les variables d'environnement

### 4. Ajouter un 4e site

1. Dans le Studio Sanity → créer un nouveau Site (logo, couleurs, contenu)
2. Dupliquer le repo `web/` → changer `PUBLIC_SITE_SLUG` dans `.env`
3. Déployer sur Netlify → pointer le domaine

## Variables d'environnement

| Variable | Description |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | ID du projet Sanity |
| `PUBLIC_SANITY_DATASET` | Dataset (production) |
| `PUBLIC_SITE_SLUG` | Identifiant du site (ex: `villerest`) |
