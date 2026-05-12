import { useState, useEffect } from 'react'
import { getSite, saveSite, uploadImage, imageUrl } from '../../lib/sanity.js'

export default function SiteEditor() {
  const [site, setSite] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [faviconUploading, setFaviconUploading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)

  // Organisateur
  const [organisateur, setOrganisateur] = useState({})
  const [orgLogoUploading, setOrgLogoUploading] = useState(false)

  // Événements footer
  const [evenementsTrail, setEvenementsTrail] = useState([])
  const [autresEvenements, setAutresEvenements] = useState([])
  const [savingEvents, setSavingEvents] = useState(false)
  const [savedEvents, setSavedEvents] = useState(false)

  useEffect(() => {
    getSite().then(data => {
      setSite(data)
      setForm({
        heroTitre: data?.heroTitre || '',
        heroDate: data?.heroDate || '',
        heroVideoUrl: data?.heroVideoUrl || '',
        heroCTA: data?.heroCTA || '',
        heroCTAUrl: data?.heroCTAUrl || '',
        metaDescription: data?.metaDescription || '',
      })
      setOrganisateur(data?.organisateur || {})
      setEvenementsTrail(data?.evenementsTrail || [])
      setAutresEvenements(data?.autresEvenements || [])
    })
  }, [])

  async function handleFavicon(e) {
    const file = e.target.files[0]
    if (!file) return
    setFaviconUploading(true)
    try {
      const asset = await uploadImage(file)
      await saveSite(site._id, { favicon: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      setSite(prev => ({ ...prev, favicon: { _type: 'image', asset: { _ref: asset._id } } }))
    } finally {
      setFaviconUploading(false)
    }
  }

  async function handleLogo(e) {
    const file = e.target.files[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const asset = await uploadImage(file)
      await saveSite(site._id, { logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      setSite(prev => ({ ...prev, logo: { _type: 'image', asset: { _ref: asset._id } } }))
    } finally {
      setLogoUploading(false)
    }
  }

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const asset = await uploadImage(file)
      await saveSite(site._id, { heroImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      setSite(prev => ({ ...prev, heroImage: { _type: 'image', asset: { _ref: asset._id } } }))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await saveSite(site._id, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleSaveEvents() {
    setSavingEvents(true)
    try {
      await saveSite(site._id, { organisateur, evenementsTrail, autresEvenements })
      setSavedEvents(true)
      setTimeout(() => setSavedEvents(false), 3000)
    } catch (err) {
      alert('❌ Erreur : ' + err.message)
    } finally {
      setSavingEvents(false)
    }
  }

  function makeEventHandlers(list, setList) {
    return {
      add() {
        setList(p => [...p, { _key: Math.random().toString(36).slice(2), nom: '', url: '' }])
      },
      remove(i) {
        setList(p => p.filter((_, idx) => idx !== i))
      },
      update(i, k, v) {
        setList(p => p.map((e, idx) => idx === i ? { ...e, [k]: v } : e))
      },
      async uploadLogo(i, file) {
        const asset = await uploadImage(file)
        setList(p => p.map((e, idx) => idx === i
          ? { ...e, logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }
          : e))
      }
    }
  }

  const trail = makeEventHandlers(evenementsTrail, setEvenementsTrail)
  const autres = makeEventHandlers(autresEvenements, setAutresEvenements)

  if (!site) return <Skeleton />

  const heroSrc = site.heroImage?.asset ? imageUrl(site.heroImage.asset) : site.heroImageUrl
  const logoSrc = site.logo?.asset ? imageUrl(site.logo.asset) : site.logoUrl
  const faviconSrc = site.favicon?.asset ? imageUrl(site.favicon.asset) : null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Page d'accueil</h2>

      {/* Logo + Favicon */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">🎨 Identité visuelle</h3>
        <div className="grid grid-cols-2 gap-6">

          {/* Logo */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1">Logo du site</p>
            <p className="text-xs text-slate-400 mb-3">Affiché dans le header et le footer</p>
            {logoSrc && (
              <div className="mb-3 p-3 bg-slate-800 rounded-lg flex items-center justify-center h-16">
                <img src={logoSrc} alt="Logo" className="h-10 w-auto object-contain" />
              </div>
            )}
            <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition text-sm text-slate-500 ${logoUploading ? 'opacity-60 pointer-events-none' : ''}`}>
              {logoUploading ? '⏳ Upload…' : logoSrc ? '🔄 Changer' : '🖼️ Uploader'}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
          </div>

          {/* Favicon */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1">Favicon</p>
            <p className="text-xs text-slate-400 mb-3">Icône dans l'onglet du navigateur</p>
            {faviconSrc && (
              <div className="mb-3 p-3 bg-slate-100 rounded-lg flex items-center justify-center h-16">
                <img src={faviconSrc} alt="Favicon" className="h-10 w-10 object-contain" />
              </div>
            )}
            <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition text-sm text-slate-500 ${faviconUploading ? 'opacity-60 pointer-events-none' : ''}`}>
              {faviconUploading ? '⏳ Upload…' : faviconSrc ? '🔄 Changer' : '⭐ Uploader'}
              <input type="file" accept="image/*,.ico" className="hidden" onChange={handleFavicon} />
            </label>
          </div>

        </div>
      </div>

      {/* Photo + Vidéo */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-5">

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Photo d'en-tête</label>
          <p className="text-xs text-slate-400 mb-3">Utilisée en fond (et comme aperçu si une vidéo est active)</p>
          {heroSrc && (
            <img src={heroSrc} alt="En-tête" className="w-full h-40 object-cover rounded-lg mb-3" />
          )}
          <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
            <span className="text-slate-500 text-sm">{uploading ? '⏳ Téléchargement…' : '📷 Choisir une photo'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1">🎬 Vidéo d'en-tête (optionnel)</label>
          <p className="text-xs text-slate-400 mb-2">
            URL directe vers un fichier <strong>.mp4</strong> — si renseignée, remplace la photo en fond.<br/>
            Hébergez votre vidéo sur Dropbox, Google Drive (lien direct), Cloudinary, etc.
          </p>
          <input
            type="url"
            value={form.heroVideoUrl || ''}
            onChange={e => setForm(p => ({ ...p, heroVideoUrl: e.target.value }))}
            className="input"
            placeholder="https://exemple.com/video.mp4"
          />
          {form.heroVideoUrl && (
            <p className="text-xs text-green-600 mt-1.5">✅ Vidéo active — la photo devient le poster de chargement</p>
          )}
        </div>

      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-5">
        <Field label="Titre principal" hint="Ex: Trail du Lac de Villerest">
          <input
            type="text"
            value={form.heroTitre}
            onChange={e => setForm(p => ({ ...p, heroTitre: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Date de l'événement" hint="Ex: 29 août 2026">
          <input
            type="text"
            value={form.heroDate}
            onChange={e => setForm(p => ({ ...p, heroDate: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Texte du bouton d'inscription" hint="Ex: S'inscrire maintenant">
          <input
            type="text"
            value={form.heroCTA}
            onChange={e => setForm(p => ({ ...p, heroCTA: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Lien du bouton d'inscription" hint="URL complète vers le formulaire d'inscription">
          <input
            type="url"
            value={form.heroCTAUrl}
            onChange={e => setForm(p => ({ ...p, heroCTAUrl: e.target.value }))}
            className="input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Description SEO" hint="Texte affiché dans Google (160 caractères max)">
          <textarea
            value={form.metaDescription}
            onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))}
            rows={2}
            maxLength={160}
            className="input resize-none"
          />
        </Field>

        <SaveBtn saving={saving} saved={saved} />
      </form>

      {/* ── Événements footer ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-700">🎪 Événements dans le footer</h3>
          <p className="text-xs text-slate-400 mt-0.5">Logos avec liens affichés en bas de page</p>
        </div>
        <div className="p-6 space-y-6">

          {/* Organisateur */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">🏢 Organisateur</p>
            <p className="text-xs text-slate-400 mb-3">Affiché dans le footer : "Un événement organisé par…"</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <input type="text" placeholder="Nom (ex: Weekandsport)" value={organisateur.nom || ''} onChange={e => setOrganisateur(p => ({ ...p, nom: e.target.value }))} className="input" />
              <input type="url" placeholder="Lien vers le site (https://…)" value={organisateur.lien || ''} onChange={e => setOrganisateur(p => ({ ...p, lien: e.target.value }))} className="input" />
              {organisateur.logo?.asset && (
                <img src={imageUrl(organisateur.logo.asset)} className="h-14 object-contain rounded" />
              )}
              <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded p-2 hover:border-blue-400 text-xs text-slate-500 transition ${orgLogoUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                {orgLogoUploading ? '⏳…' : organisateur.logo?.asset ? '🔄 Changer le logo' : '🖼️ Uploader le logo'}
                <input type="file" accept="image/*" className="hidden" onChange={async e => {
                  const file = e.target.files[0]; if (!file) return
                  setOrgLogoUploading(true)
                  const asset = await uploadImage(file)
                  setOrganisateur(p => ({ ...p, logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }))
                  setOrgLogoUploading(false)
                }} />
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Trail */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Nos événements Trail</p>
            <div className="space-y-3 mb-3">
              {evenementsTrail.map((ev, i) => (
                <EventRow key={ev._key || i} ev={ev}
                  onNom={v => trail.update(i, 'nom', v)}
                  onUrl={v => trail.update(i, 'url', v)}
                  onRemove={() => trail.remove(i)}
                  onLogo={f => trail.uploadLogo(i, f)} />
              ))}
            </div>
            <button type="button" onClick={trail.add}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition">
              + Ajouter un événement trail
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Autres */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Nos autres événements</p>
            <div className="space-y-3 mb-3">
              {autresEvenements.map((ev, i) => (
                <EventRow key={ev._key || i} ev={ev}
                  onNom={v => autres.update(i, 'nom', v)}
                  onUrl={v => autres.update(i, 'url', v)}
                  onRemove={() => autres.remove(i)}
                  onLogo={f => autres.uploadLogo(i, f)} />
              ))}
            </div>
            <button type="button" onClick={autres.add}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition">
              + Ajouter un autre événement
            </button>
          </div>

          <button type="button" onClick={handleSaveEvents} disabled={savingEvents}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              savedEvents ? 'bg-green-500' : savingEvents ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
            {savedEvents ? '✅ Enregistré !' : savingEvents ? 'Enregistrement…' : 'Enregistrer les événements'}
          </button>
        </div>
      </div>

    </div>
  )
}

function EventRow({ ev, onNom, onUrl, onRemove, onLogo }) {
  const [uploading, setUploading] = useState(false)
  const logoSrc = ev.logo?.asset ? imageUrl(ev.logo.asset) : (ev.logoUrl || null)

  async function handleFile(e) {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    await onLogo(file)
    setUploading(false)
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
      <div className="flex gap-2 items-center">
        <input type="text" placeholder="Nom de l'événement" value={ev.nom || ''} onChange={e => onNom(e.target.value)} className="input flex-1" />
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 text-xl px-1 shrink-0">×</button>
      </div>
      <input type="url" placeholder="https://site-evenement.fr" value={ev.url || ''} onChange={e => onUrl(e.target.value)} className="input" />
      <div className="flex items-center gap-3">
        {logoSrc && <img src={logoSrc} className="h-10 w-auto object-contain rounded" />}
        <label className={`flex items-center gap-1.5 cursor-pointer border border-slate-300 rounded px-3 py-1.5 hover:border-blue-400 text-xs text-slate-500 transition ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? '⏳…' : '🖼️ Logo'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

function SaveBtn({ saving, saved }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className={`w-full py-3 rounded-lg font-semibold text-white transition ${
        saved ? 'bg-green-500' : saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {saved ? '✅ Enregistré !' : saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
    </button>
  )
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-48" />
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="h-48 bg-slate-200 rounded-lg" />
        <div className="h-10 bg-slate-200 rounded" />
      </div>
    </div>
  )
}
