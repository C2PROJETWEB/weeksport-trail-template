import { useState, useEffect } from 'react'
import { getPages, getPage, savePage, uploadImage, blocksToText, textToBlocks, imageUrl } from '../../lib/sanity.js'

export default function PagesEditor() {
  const [pages, setPages] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => { getPages().then(setPages) }, [])

  if (!pages) return <Skeleton />

  if (selected) {
    return <PageEditor id={selected._id} title={selected.title} onBack={() => setSelected(null)} />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Pages du site</h2>
      <div className="space-y-2">
        {pages.map(p => (
          <button
            key={p._id}
            onClick={() => setSelected(p)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-200 text-left flex items-center justify-between hover:border-blue-300 hover:shadow-md transition group"
          >
            <div>
              <p className="font-semibold text-slate-800">{p.title}</p>
              <p className="text-xs text-slate-400 font-mono">/{p.slug?.current}</p>
            </div>
            <span className="text-slate-300 group-hover:text-blue-500 transition text-xl">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function PageEditor({ id, title, onBack }) {
  const [page, setPage] = useState(null)
  const [sections, setSections] = useState([])
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    getPage(id).then(data => {
      setPage(data)
      setSections(data?.sections || [])
    })
  }, [id])

  async function saveSection(idx, patch) {
    setSaving(idx)
    setSaveError(null)
    const updated = sections.map((s, i) => i === idx ? { ...s, ...patch } : s)
    setSections(updated)
    try {
      await savePage(id, { sections: updated })
      setSaving(null)
      setSaved(idx)
      setTimeout(() => setSaved(null), 3000)
    } catch (err) {
      setSaving(null)
      setSaveError(idx)
      setTimeout(() => setSaveError(null), 4000)
      console.error('Erreur sauvegarde Sanity:', err)
      alert('❌ Erreur de sauvegarde : ' + (err.message || 'Vérifiez votre connexion'))
    }
  }

  if (!page) return <Skeleton />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 transition text-sm flex items-center gap-1">
          ← Retour
        </button>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>

      {sections.length === 0 && (
        <p className="text-slate-500 text-sm bg-white rounded-xl p-6 border border-slate-200">
          Aucun contenu sur cette page pour le moment.
        </p>
      )}

      {sections.map((section, idx) => (
        <SectionEditor
          key={section._key || idx}
          section={section}
          saving={saving === idx}
          saved={saved === idx}
          error={saveError === idx}
          onSave={patch => saveSection(idx, patch)}
        />
      ))}
    </div>
  )
}

function SectionEditor({ section, saving, saved, error, onSave }) {
  const props = { section, saving, saved, error, onSave }
  switch (section._type) {
    case 'sectionTexte':
    case 'sectionProgramme':
      return <TextSectionEditor {...props} />
    case 'sectionGalerie':
      return <GallerieSectionEditor {...props} />
    case 'sectionEpreuves':
      return <EpreuvesSectionEditor {...props} />
    case 'sectionContact':
      return <ContactSectionEditor {...props} />
    case 'sectionBenevoles':
      return <BenevoleSectionEditor {...props} />
    case 'sectionCompteur':
      return <CompteurSectionEditor {...props} />
    case 'sectionResultats':
      return <ResultatsSectionEditor {...props} />
    case 'sectionPhotos':
      return <PhotosSectionEditor {...props} />
    case 'sectionPartenaires':
      return <PartenairesSectionEditor {...props} />
    default:
      return null
  }
}

// ── Section Texte ──────────────────────────────────────────────────────────
function TextSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre || '')
  const [contenu, setContenu] = useState(() => blocksToText(section.contenu))
  const [images, setImages] = useState(section.images || [])
  const [boutons, setBoutons] = useState(section.boutons || [])
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const newImages = [...images]
    for (const file of files) {
      const asset = await uploadImage(file)
      newImages.push({
        _type: 'image',
        _key: Math.random().toString(36).slice(2),
        asset: { _type: 'reference', _ref: asset._id }
      })
    }
    setImages(newImages)
    setUploading(false)
  }

  function removeImage(i) {
    setImages(prev => prev.filter((_, idx) => idx !== i))
  }

  function addBouton() {
    setBoutons(prev => [...prev, {
      _type: 'bouton',
      _key: Math.random().toString(36).slice(2),
      label: '', url: '', style: 'primary', externe: false
    }])
  }

  function updateBouton(i, k, v) {
    setBoutons(prev => prev.map((b, idx) => idx === i ? { ...b, [k]: v } : b))
  }

  function removeBouton(i) {
    setBoutons(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <Card label={section.titre || 'Bloc texte'} saving={saving} saved={saved} error={error}
      onSave={() => onSave({ titre, contenu: textToBlocks(contenu), images, boutons })}>
      <Field label="Titre du bloc">
        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} className="input" />
      </Field>
      <Field label="Contenu" hint="Pour aller à la ligne, appuyez sur Entrée deux fois">
        <textarea value={contenu} onChange={e => setContenu(e.target.value)} rows={8} className="input resize-y" />
      </Field>

      {/* ── Photos ── */}
      <Field label="📷 Photos">
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((img, i) => {
              const src = img.asset ? imageUrl(img.asset) : null
              return (
                <div key={i} className="relative group">
                  {src && <img src={src} className="w-full h-24 object-cover rounded-lg" />}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hidden group-hover:flex items-center justify-center"
                  >×</button>
                </div>
              )
            })}
          </div>
        )}
        <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition text-sm text-slate-500 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? '⏳ Téléchargement…' : '📷 Ajouter des photos'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        </label>
      </Field>

      {/* ── Boutons ── */}
      <Field label="🔗 Boutons">
        <div className="space-y-2 mb-2">
          {boutons.map((btn, i) => (
            <div key={btn._key || i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Texte du bouton"
                  value={btn.label || ''}
                  onChange={e => updateBouton(i, 'label', e.target.value)}
                  className="input flex-1"
                />
                <button type="button" onClick={() => removeBouton(i)} className="text-red-400 hover:text-red-600 text-xl px-1">×</button>
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={btn.url || ''}
                onChange={e => updateBouton(i, 'url', e.target.value)}
                className="input"
              />
              <div className="flex gap-4 text-sm items-center">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={btn.style !== 'outline'} onChange={() => updateBouton(i, 'style', 'primary')} />
                  <span>Primaire</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={btn.style === 'outline'} onChange={() => updateBouton(i, 'style', 'outline')} />
                  <span>Contour</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer ml-auto">
                  <input type="checkbox" checked={!!btn.externe} onChange={e => updateBouton(i, 'externe', e.target.checked)} />
                  <span>Nouvel onglet</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBouton}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition"
        >
          + Ajouter un bouton
        </button>
      </Field>
    </Card>
  )
}

// ── Section Galerie ────────────────────────────────────────────────────────
function GallerieSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre || '')
  const [photos, setPhotos] = useState(section.photos || [])
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    setUploading(true)
    const newPhotos = [...photos]
    for (const file of files) {
      const asset = await uploadImage(file)
      newPhotos.push({ _type: 'image', _key: Math.random().toString(36).slice(2), asset: { _type: 'reference', _ref: asset._id } })
    }
    setPhotos(newPhotos)
    setUploading(false)
  }

  function removePhoto(i) {
    setPhotos(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <Card label={section.titre || 'Galerie photos'} saving={saving} saved={saved} error={error}
      onSave={() => onSave({ titre, photos })}>
      <Field label="Titre">
        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} className="input" />
      </Field>
      <Field label="Photos">
        <div className="grid grid-cols-3 gap-3 mb-3">
          {photos.map((p, i) => {
            const src = p.asset ? imageUrl(p.asset) : null
            return (
              <div key={i} className="relative group">
                {src && <img src={src} className="w-full h-24 object-cover rounded-lg" />}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hidden group-hover:flex items-center justify-center"
                >×</button>
              </div>
            )
          })}
        </div>
        <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition text-sm text-slate-500 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? '⏳ Téléchargement…' : '📷 Ajouter des photos'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
      </Field>
    </Card>
  )
}

// ── Section Épreuves ───────────────────────────────────────────────────────
function EpreuvesSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre || '')
  const [epreuves, setEpreuves] = useState(section.epreuves || [])

  function update(i, field, value) {
    setEpreuves(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))
  }

  async function uploadEpreuveImage(i, file) {
    const asset = await uploadImage(file)
    update(i, 'image', { _type: 'image', asset: { _type: 'reference', _ref: asset._id } })
  }

  return (
    <Card label={section.titre || 'Épreuves'} saving={saving} saved={saved} error={error}
      onSave={() => onSave({ titre, epreuves })}>
      <Field label="Titre de la section">
        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} className="input" />
      </Field>
      <div className="space-y-4">
        {epreuves.map((ep, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <p className="font-semibold text-slate-700">{ep.nom || `Épreuve ${i+1}`}</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom"><input type="text" value={ep.nom||''} onChange={e=>update(i,'nom',e.target.value)} className="input" /></Field>
              <Field label="Distance"><input type="text" value={ep.distance||''} onChange={e=>update(i,'distance',e.target.value)} className="input" placeholder="Ex: 42 km" /></Field>
              <Field label="Dénivelé"><input type="text" value={ep.denivele||''} onChange={e=>update(i,'denivele',e.target.value)} className="input" placeholder="Ex: +1200 m" /></Field>
              <Field label="Heure de départ"><input type="text" value={ep.depart||''} onChange={e=>update(i,'depart',e.target.value)} className="input" placeholder="Ex: 19h30" /></Field>
            </div>
            <Field label="Description courte">
              <textarea value={ep.description||''} onChange={e=>update(i,'description',e.target.value)} rows={2} className="input resize-none" />
            </Field>
            <Field label="Lien inscription">
              <input type="url" value={ep.lienInscription||''} onChange={e=>update(i,'lienInscription',e.target.value)} className="input" placeholder="https://..." />
            </Field>
            <Field label="Photo principale">
              {ep.image?.asset && <img src={imageUrl(ep.image.asset)} className="w-full h-32 object-cover rounded-lg mb-2" />}
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-2 hover:border-blue-400 text-sm text-slate-500 transition">
                📷 Changer la photo
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadEpreuveImage(i, e.target.files[0])} />
              </label>
            </Field>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section Contact ────────────────────────────────────────────────────────
function ContactSectionEditor({ section, saving, saved, error, onSave }) {
  const [form, setForm] = useState({
    titre: section.titre || '',
    email: section.email || '',
    telephone: section.telephone || '',
    adresse: section.adresse || '',
    texteFormulaire: section.texteFormulaire || '',
  })
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <Card label="Contact" saving={saving} saved={saved} error={error} onSave={() => onSave(form)}>
      <Field label="Titre"><input type="text" value={form.titre} onChange={e=>u('titre',e.target.value)} className="input" /></Field>
      <Field label="Email"><input type="email" value={form.email} onChange={e=>u('email',e.target.value)} className="input" /></Field>
      <Field label="Téléphone"><input type="tel" value={form.telephone} onChange={e=>u('telephone',e.target.value)} className="input" /></Field>
      <Field label="Adresse"><textarea value={form.adresse} onChange={e=>u('adresse',e.target.value)} rows={2} className="input resize-none" /></Field>
      <Field label="Texte au-dessus du formulaire"><textarea value={form.texteFormulaire} onChange={e=>u('texteFormulaire',e.target.value)} rows={3} className="input resize-none" /></Field>
    </Card>
  )
}

// ── Section Bénévoles ──────────────────────────────────────────────────────
function BenevoleSectionEditor({ section, saving, saved, error, onSave }) {
  const [form, setForm] = useState({ titre: section.titre||'', description: section.description||'', lienInscription: section.lienInscription||'' })
  const [image, setImage] = useState(section.image)
  const u = (k,v) => setForm(p=>({...p,[k]:v}))

  async function handlePhoto(e) {
    const file = e.target.files[0]; if (!file) return
    const asset = await uploadImage(file)
    setImage({ _type: 'image', asset: { _type: 'reference', _ref: asset._id } })
  }

  return (
    <Card label="Bénévoles" saving={saving} saved={saved} error={error} onSave={() => onSave({ ...form, image })}>
      <Field label="Titre"><input type="text" value={form.titre} onChange={e=>u('titre',e.target.value)} className="input" /></Field>
      <Field label="Description"><textarea value={form.description} onChange={e=>u('description',e.target.value)} rows={4} className="input resize-y" /></Field>
      <Field label="Lien inscription bénévoles"><input type="url" value={form.lienInscription} onChange={e=>u('lienInscription',e.target.value)} className="input" placeholder="https://..." /></Field>
      <Field label="Photo">
        {image?.asset && <img src={imageUrl(image.asset)} className="w-full h-32 object-cover rounded-lg mb-2" />}
        <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-2 hover:border-blue-400 text-sm text-slate-500 transition">
          📷 Changer la photo
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>
      </Field>
    </Card>
  )
}

// ── Section Compteur ───────────────────────────────────────────────────────
function CompteurSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre||'')
  const [date, setDate] = useState(section.dateEpreuve ? section.dateEpreuve.slice(0,16) : '')

  return (
    <Card label="Compte à rebours" saving={saving} saved={saved} error={error} onSave={() => onSave({ titre, dateEpreuve: date ? new Date(date).toISOString() : null })}>
      <Field label="Titre"><input type="text" value={titre} onChange={e=>setTitre(e.target.value)} className="input" /></Field>
      <Field label="Date et heure de l'épreuve"><input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="input" /></Field>
    </Card>
  )
}

// ── Section Résultats ──────────────────────────────────────────────────────
function ResultatsSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre||'')
  const [annees, setAnnees] = useState(section.annees||[])
  const update = (i,k,v) => setAnnees(prev => prev.map((a,idx) => idx===i ? {...a,[k]:v} : a))

  return (
    <Card label="Résultats" saving={saving} saved={saved} error={error} onSave={() => onSave({ titre, annees })}>
      <Field label="Titre"><input type="text" value={titre} onChange={e=>setTitre(e.target.value)} className="input" /></Field>
      <div className="space-y-3">
        {annees.map((a,i) => (
          <div key={i} className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
            <input type="text" placeholder="Année" value={a.annee||''} onChange={e=>update(i,'annee',e.target.value)} className="input w-24" />
            <input type="url" placeholder="Lien vers les résultats" value={a.lien||''} onChange={e=>update(i,'lien',e.target.value)} className="input flex-1" />
            <button type="button" onClick={() => setAnnees(p=>p.filter((_,idx)=>idx!==i))} className="text-red-400 hover:text-red-600 text-lg">×</button>
          </div>
        ))}
        <button type="button" onClick={() => setAnnees(p=>[...p,{_key:Math.random().toString(36).slice(2),annee:'',lien:''}])}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition">
          + Ajouter une année
        </button>
      </div>
    </Card>
  )
}

// ── Section Photos ─────────────────────────────────────────────────────────
function PhotosSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre||'')
  const [annees, setAnnees] = useState(section.annees||[])
  const update = (i,k,v) => setAnnees(prev => prev.map((a,idx) => idx===i ? {...a,[k]:v} : a))

  async function uploadAlbumCover(i, file) {
    const asset = await uploadImage(file)
    update(i, 'image', { _type:'image', asset:{ _type:'reference', _ref:asset._id } })
  }

  return (
    <Card label="Photos" saving={saving} saved={saved} error={error} onSave={() => onSave({ titre, annees })}>
      <Field label="Titre"><input type="text" value={titre} onChange={e=>setTitre(e.target.value)} className="input" /></Field>
      <div className="space-y-3">
        {annees.map((a,i) => (
          <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex gap-3 items-center">
              <input type="text" placeholder="Année" value={a.annee||''} onChange={e=>update(i,'annee',e.target.value)} className="input w-24" />
              <input type="url" placeholder="Lien vers l'album" value={a.lien||''} onChange={e=>update(i,'lien',e.target.value)} className="input flex-1" />
              <button type="button" onClick={() => setAnnees(p=>p.filter((_,idx)=>idx!==i))} className="text-red-400 hover:text-red-600 text-lg">×</button>
            </div>
            {a.image?.asset && <img src={imageUrl(a.image.asset)} className="w-full h-20 object-cover rounded" />}
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded p-2 hover:border-blue-400 text-xs text-slate-500 transition">
              📷 Photo d'aperçu
              <input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files[0]&&uploadAlbumCover(i,e.target.files[0])} />
            </label>
          </div>
        ))}
        <button type="button" onClick={() => setAnnees(p=>[...p,{_key:Math.random().toString(36).slice(2),annee:'',lien:''}])}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition">
          + Ajouter un album
        </button>
      </div>
    </Card>
  )
}

// ── Section Partenaires ────────────────────────────────────────────────────
function PartenairesSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre||'')
  const [partenaires, setPartenaires] = useState(section.partenaires||[])
  const update = (i,k,v) => setPartenaires(prev => prev.map((p,idx) => idx===i ? {...p,[k]:v} : p))

  async function uploadLogo(i, file) {
    const asset = await uploadImage(file)
    update(i, 'logo', { _type:'image', asset:{ _type:'reference', _ref:asset._id } })
  }

  return (
    <Card label={section.titre||'Partenaires'} saving={saving} saved={saved} error={error} onSave={() => onSave({ titre, partenaires })}>
      <Field label="Titre"><input type="text" value={titre} onChange={e=>setTitre(e.target.value)} className="input" /></Field>
      <div className="space-y-3">
        {partenaires.map((p,i) => (
          <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex gap-2 items-center">
              <input type="text" placeholder="Nom du partenaire" value={p.nom||''} onChange={e=>update(i,'nom',e.target.value)} className="input flex-1" />
              <button type="button" onClick={() => setPartenaires(prev=>prev.filter((_,idx)=>idx!==i))} className="text-red-400 hover:text-red-600 text-lg">×</button>
            </div>
            <input type="url" placeholder="Site web du partenaire" value={p.url||''} onChange={e=>update(i,'url',e.target.value)} className="input" />
            {p.logo?.asset && <img src={imageUrl(p.logo.asset)} className="h-12 object-contain rounded" />}
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded p-2 hover:border-blue-400 text-xs text-slate-500 transition">
              🖼️ Logo
              <input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files[0]&&uploadLogo(i,e.target.files[0])} />
            </label>
          </div>
        ))}
        <button type="button" onClick={() => setPartenaires(p=>[...p,{_key:Math.random().toString(36).slice(2),nom:'',url:''}])}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition">
          + Ajouter un partenaire
        </button>
      </div>
    </Card>
  )
}

// ── Composants UI ──────────────────────────────────────────────────────────
function Card({ label, saving, saved, onSave, children }) {
  const isError = typeof saved === 'string' && saved.startsWith('err-')
  const isOk = saved === true || (typeof saved === 'number')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
        <h3 className="font-semibold text-slate-700 text-sm">{label}</h3>
      </div>
      <div className="p-4 space-y-4">
        {children}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isError ? 'bg-red-500' : isOk ? 'bg-green-500' : saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isError ? '❌ Erreur — réessayez' : isOk ? '✅ Enregistré !' : saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      {children}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-48" />
      {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
    </div>
  )
}
