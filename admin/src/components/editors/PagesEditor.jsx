import { useState, useEffect } from 'react'
import { getPages, getPage, savePage, uploadImage, uploadFile, fileUrl, blocksToText, textToBlocks, imageUrl } from '../../lib/sanity.js'

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

// ── Types de sections disponibles ─────────────────────────────────────────
const SECTION_TYPES = [
  { type: 'sectionTexte',      label: '📝 Bloc texte' },
  { type: 'sectionGalerie',    label: '🖼️ Galerie photos' },
  { type: 'sectionCompteur',   label: '⏱️ Compte à rebours' },
  { type: 'sectionEpreuves',   label: '🏃 Épreuves' },
  { type: 'sectionResultats',  label: '🏆 Résultats' },
  { type: 'sectionPartenaires',label: '🤝 Partenaires' },
  { type: 'sectionBenevoles',  label: '🙋 Bénévoles' },
  { type: 'sectionContact',    label: '✉️ Contact' },
  { type: 'sectionProgramme',  label: '📅 Programme' },
  { type: 'sectionPhotos',     label: '📸 Albums photos' },
  { type: 'sectionPub',        label: '📢 Espace pub' },
]

function defaultSection(type) {
  const key = Math.random().toString(36).slice(2)
  const map = {
    sectionTexte:       { titre: '', contenu: [], images: [], boutons: [] },
    sectionGalerie:     { titre: '', photos: [] },
    sectionCompteur:    { titre: 'Prochaine édition' },
    sectionEpreuves:    { titre: 'Les épreuves', epreuves: [] },
    sectionResultats:   { titre: 'Résultats', annees: [] },
    sectionPartenaires: { titre: 'Nos partenaires', groupe: 'evenement', partenaires: [] },
    sectionBenevoles:   { titre: 'Devenir bénévole' },
    sectionContact:     { titre: 'Contactez-nous' },
    sectionProgramme:   { titre: 'Le Programme', contenu: [] },
    sectionPhotos:      { titre: 'Photos', annees: [] },
    sectionPub:         { titre: '', pubs: [] },
  }
  return { _type: type, _key: key, ...(map[type] || {}) }
}

function PageEditor({ id, title, onBack }) {
  const [page, setPage] = useState(null)
  const [sections, setSections] = useState([])
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [structureSaving, setStructureSaving] = useState(false)

  useEffect(() => {
    getPage(id).then(data => {
      setPage(data)
      setSections(data?.sections || [])
    })
  }, [id])

  // Sauvegarde d'une section éditée
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

  // Sauvegarde de la structure (ajout / suppression / déplacement)
  async function saveStructure(updated) {
    setStructureSaving(true)
    try {
      await savePage(id, { sections: updated })
    } catch (err) {
      alert('❌ Erreur : ' + err.message)
    } finally {
      setStructureSaving(false)
    }
  }

  async function addSection(type) {
    const updated = [...sections, defaultSection(type)]
    setSections(updated)
    setAddOpen(false)
    await saveStructure(updated)
  }

  async function removeSection(idx) {
    if (!window.confirm('Supprimer cette section ? Cette action est irréversible.')) return
    const updated = sections.filter((_, i) => i !== idx)
    setSections(updated)
    await saveStructure(updated)
  }

  async function moveSection(idx, dir) {
    const target = idx + dir
    if (target < 0 || target >= sections.length) return
    const updated = [...sections]
    ;[updated[idx], updated[target]] = [updated[target], updated[idx]]
    setSections(updated)
    await saveStructure(updated)
  }

  if (!page) return <Skeleton />

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 transition text-sm flex items-center gap-1">
          ← Retour
        </button>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {structureSaving && <span className="text-xs text-slate-400 ml-auto">💾 Sauvegarde…</span>}
      </div>

      {sections.length === 0 && !addOpen && (
        <p className="text-slate-400 text-sm bg-white rounded-xl p-8 border border-slate-200 text-center">
          Aucune section — ajoutez-en une ci-dessous
        </p>
      )}

      {/* Sections avec barre de contrôle */}
      {sections.map((section, idx) => {
        const typeInfo = SECTION_TYPES.find(t => t.type === section._type)
        return (
          <div key={section._key || idx} className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
            {/* Barre de contrôle */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-700">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                {typeInfo?.label || section._type}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => moveSection(idx, -1)}
                  disabled={idx === 0}
                  title="Monter"
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-20 transition text-sm"
                >↑</button>
                <button
                  onClick={() => moveSection(idx, 1)}
                  disabled={idx === sections.length - 1}
                  title="Descendre"
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-20 transition text-sm"
                >↓</button>
                <button
                  onClick={() => removeSection(idx)}
                  title="Supprimer cette section"
                  className="w-7 h-7 flex items-center justify-center rounded text-red-400 hover:text-red-300 hover:bg-red-900/30 transition text-sm ml-1"
                >✕</button>
              </div>
            </div>
            {/* Éditeur — on retire le border-radius du haut (déjà géré par le wrapper) */}
            <div className="[&>div]:rounded-t-none [&>div]:shadow-none [&>div]:border-0">
              <SectionEditor
                section={section}
                saving={saving === idx}
                saved={saved === idx}
                error={saveError === idx}
                onSave={patch => saveSection(idx, patch)}
              />
            </div>
          </div>
        )
      })}

      {/* Panneau d'ajout */}
      {addOpen ? (
        <div className="bg-white rounded-xl border border-blue-300 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-slate-700 text-sm">Choisir le type de section</p>
            <button onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">×</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className="text-left text-sm px-3 py-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddOpen(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Ajouter une section
        </button>
      )}
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
    case 'sectionPub':
      return <PubSectionEditor {...props} />
    default:
      return null
  }
}

// ── Section Texte ──────────────────────────────────────────────────────────
const DISPOSITIONS = [
  { value: 'texte_seul',    label: 'Texte seul',       icon: <DispoIcon type="texte_seul" /> },
  { value: 'image_droite',  label: 'Image à droite',   icon: <DispoIcon type="image_droite" /> },
  { value: 'image_gauche',  label: 'Image à gauche',   icon: <DispoIcon type="image_gauche" /> },
  { value: 'image_dessus',  label: 'Image au-dessus',  icon: <DispoIcon type="image_dessus" /> },
  { value: 'image_dessous', label: 'Image en dessous', icon: <DispoIcon type="image_dessous" /> },
]

function TextSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre || '')
  const [contenu, setContenu] = useState(() => blocksToText(section.contenu))
  const [images, setImages] = useState(section.images || [])
  const [boutons, setBoutons] = useState(section.boutons || [])
  const [disposition, setDisposition] = useState(section.disposition || 'image_dessous')
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState(section.documents || [])
  const [docUploading, setDocUploading] = useState(false)

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

  async function handleDocUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setDocUploading(true)
    const newDocs = [...documents]
    for (const file of files) {
      const asset = await uploadFile(file)
      newDocs.push({
        _type: 'fichier',
        _key: Math.random().toString(36).slice(2),
        nom: file.name.replace(/\.[^/.]+$/, ''),
        asset: { _type: 'reference', _ref: asset._id }
      })
    }
    setDocuments(newDocs)
    setDocUploading(false)
  }

  function updateDocNom(i, nom) {
    setDocuments(prev => prev.map((d, idx) => idx === i ? { ...d, nom } : d))
  }

  function removeDoc(i) {
    setDocuments(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <Card label={section.titre || 'Bloc texte'} saving={saving} saved={saved} error={error}
      onSave={() => onSave({ titre, contenu: textToBlocks(contenu), images, boutons, disposition, documents })}>
      <Field label="Titre du bloc">
        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} className="input" />
      </Field>

      {/* ── Disposition ── */}
      <Field label="📐 Disposition" hint="Comment le texte et l'image sont organisés">
        <div className="grid grid-cols-5 gap-2">
          {DISPOSITIONS.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDisposition(d.value)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition text-xs font-medium ${
                disposition === d.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {d.icon}
              <span className="leading-tight text-center">{d.label}</span>
            </button>
          ))}
        </div>
        {(disposition === 'image_droite' || disposition === 'image_gauche') && (
          <p className="text-xs text-amber-600 mt-2">⚠ Seule la première image sera affichée côte à côte avec le texte.</p>
        )}
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

      {/* ── Documents ── */}
      <Field label="📎 Documents à télécharger" hint="PDF, Word, Excel… Les visiteurs pourront les télécharger">
        {documents.length > 0 && (
          <div className="space-y-2 mb-2">
            {documents.map((doc, i) => (
              <div key={doc._key || i} className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-lg p-2">
                <span className="text-lg shrink-0">{docIcon(doc.asset)}</span>
                <input
                  type="text"
                  value={doc.nom || ''}
                  onChange={e => updateDocNom(i, e.target.value)}
                  className="input flex-1 text-sm py-1"
                  placeholder="Nom affiché"
                />
                {doc.asset && (
                  <a href={fileUrl(doc.asset)} target="_blank" rel="noopener"
                    className="text-blue-500 text-xs hover:text-blue-700 px-1 shrink-0" title="Voir le fichier">↗</a>
                )}
                <button type="button" onClick={() => removeDoc(i)}
                  className="text-red-400 hover:text-red-600 text-xl leading-none shrink-0">×</button>
              </div>
            ))}
          </div>
        )}
        <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition text-sm text-slate-500 ${docUploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {docUploading ? '⏳ Téléchargement…' : '📎 Ajouter des documents'}
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip" multiple className="hidden" onChange={handleDocUpload} />
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
          <div key={a._key||i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex gap-3 items-center">
              <input type="text" placeholder="Année (ex: 2025)" value={a.annee||''} onChange={e=>update(i,'annee',e.target.value)} className="input w-28 font-bold" />
              <button type="button" onClick={() => setAnnees(p=>p.filter((_,idx)=>idx!==i))} className="ml-auto text-red-400 hover:text-red-600 text-lg px-1">×</button>
            </div>
            <input
              type="text"
              placeholder="https://lien-vers-les-résultats.fr"
              value={a.lien||''}
              onChange={e=>update(i,'lien',e.target.value)}
              className="input font-mono text-sm"
            />
          </div>
        ))}
        <button type="button" onClick={() => setAnnees(p=>[...p,{_key:Math.random().toString(36).slice(2), _type:'anneeResultat', annee:'', lien:''}])}
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
          <div key={a._key||i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex gap-3 items-center">
              <input type="text" placeholder="Année (ex: 2025)" value={a.annee||''} onChange={e=>update(i,'annee',e.target.value)} className="input w-28 font-bold" />
              <button type="button" onClick={() => setAnnees(p=>p.filter((_,idx)=>idx!==i))} className="ml-auto text-red-400 hover:text-red-600 text-lg">×</button>
            </div>
            <input type="text" placeholder="https://lien-vers-l-album.fr" value={a.lien||''} onChange={e=>update(i,'lien',e.target.value)} className="input font-mono text-sm" />
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

// ── Section Pub ────────────────────────────────────────────────────────────
function PubSectionEditor({ section, saving, saved, error, onSave }) {
  const [titre, setTitre] = useState(section.titre || '')
  const [pubs, setPubs] = useState(section.pubs || [])
  const [uploading, setUploading] = useState(null) // index en cours

  function addPub() {
    setPubs(p => [...p, { _key: Math.random().toString(36).slice(2), alt: '', lien: '' }])
  }

  function removePub(i) {
    setPubs(p => p.filter((_, idx) => idx !== i))
  }

  function updatePub(i, k, v) {
    setPubs(p => p.map((pub, idx) => idx === i ? { ...pub, [k]: v } : pub))
  }

  async function handleUpload(i, file) {
    setUploading(i)
    const asset = await uploadImage(file)
    setPubs(p => p.map((pub, idx) => idx === i
      ? { ...pub, image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }
      : pub))
    setUploading(null)
  }

  return (
    <Card label={section.titre || 'Espace publicitaire'} saving={saving} saved={saved} error={error}
      onSave={() => onSave({ titre, pubs })}>
      <Field label="Titre de section" hint="Optionnel — ex: Nos annonceurs">
        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} className="input" placeholder="Laisser vide pour ne pas afficher de titre" />
      </Field>
      <Field label="Bannières publicitaires" hint="1 bannière = pleine largeur · 2 ou 3 = côte à côte">
        <div className="space-y-3 mb-3">
          {pubs.map((pub, i) => {
            const src = pub.image?.asset ? imageUrl(pub.image.asset) : (pub.imageUrl || null)
            return (
              <div key={pub._key || i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bannière {i + 1}</span>
                  <button type="button" onClick={() => removePub(i)} className="text-red-400 hover:text-red-600 text-xl leading-none">×</button>
                </div>

                {/* Aperçu image */}
                {src && (
                  <img src={src} className="w-full max-h-28 object-cover rounded" />
                )}

                {/* Upload */}
                <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded p-2 hover:border-blue-400 text-xs text-slate-500 transition ${uploading === i ? 'opacity-60 pointer-events-none' : ''}`}>
                  {uploading === i ? '⏳ Téléchargement…' : src ? '🔄 Changer l\'image' : '📷 Uploader la bannière'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleUpload(i, e.target.files[0])} />
                </label>

                {/* Ou URL externe */}
                {!pub.image?.asset && (
                  <input type="url" placeholder="Ou URL externe de l'image…" value={pub.imageUrl || ''} onChange={e => updatePub(i, 'imageUrl', e.target.value)} className="input text-xs" />
                )}

                {/* Lien */}
                <input type="url" placeholder="Lien (clic sur la bannière) — https://…" value={pub.lien || ''} onChange={e => updatePub(i, 'lien', e.target.value)} className="input" />

                {/* Alt */}
                <input type="text" placeholder="Nom du sponsor (pour accessibilité)" value={pub.alt || ''} onChange={e => updatePub(i, 'alt', e.target.value)} className="input" />
              </div>
            )
          })}
        </div>
        {pubs.length < 3 && (
          <button type="button" onClick={addPub}
            className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 text-sm transition">
            + Ajouter une bannière {pubs.length > 0 ? `(${pubs.length}/3)` : ''}
          </button>
        )}
        {pubs.length === 3 && (
          <p className="text-xs text-slate-400 text-center">Maximum 3 bannières atteint</p>
        )}
      </Field>
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

function docIcon(ref) {
  if (!ref) return '📎'
  const id = (ref._ref || ref || '').toLowerCase()
  if (id.endsWith('-pdf')) return '📄'
  if (id.endsWith('-docx') || id.endsWith('-doc')) return '📝'
  if (id.endsWith('-xlsx') || id.endsWith('-xls') || id.endsWith('-csv')) return '📊'
  if (id.endsWith('-pptx') || id.endsWith('-ppt')) return '📊'
  if (id.endsWith('-zip') || id.endsWith('-rar')) return '📦'
  return '📎'
}

function DispoIcon({ type }) {
  const s = { bg: 'bg-slate-300', txt: 'bg-slate-500' }
  const base = 'w-full h-8 rounded flex overflow-hidden gap-0.5'
  if (type === 'texte_seul') return (
    <div className={base + ' flex-col gap-0.5 p-0.5'}>
      {[1,2,3].map(i => <div key={i} className={`${s.txt} rounded h-1.5 w-full`} />)}
    </div>
  )
  if (type === 'image_droite') return (
    <div className={base + ' p-0.5 items-center'}>
      <div className="flex-1 flex flex-col gap-0.5">{[1,2,3].map(i=><div key={i} className={`${s.txt} rounded h-1.5`}/>)}</div>
      <div className={`${s.bg} rounded w-1/3 h-full`}/>
    </div>
  )
  if (type === 'image_gauche') return (
    <div className={base + ' p-0.5 items-center'}>
      <div className={`${s.bg} rounded w-1/3 h-full`}/>
      <div className="flex-1 flex flex-col gap-0.5">{[1,2,3].map(i=><div key={i} className={`${s.txt} rounded h-1.5`}/>)}</div>
    </div>
  )
  if (type === 'image_dessus') return (
    <div className={base + ' flex-col p-0.5'}>
      <div className={`${s.bg} rounded h-3 w-full`}/>
      <div className="flex flex-col gap-0.5 flex-1 justify-center">{[1,2].map(i=><div key={i} className={`${s.txt} rounded h-1.5`}/>)}</div>
    </div>
  )
  if (type === 'image_dessous') return (
    <div className={base + ' flex-col p-0.5'}>
      <div className="flex flex-col gap-0.5 flex-1 justify-center">{[1,2].map(i=><div key={i} className={`${s.txt} rounded h-1.5`}/>)}</div>
      <div className={`${s.bg} rounded h-3 w-full`}/>
    </div>
  )
  return null
}
