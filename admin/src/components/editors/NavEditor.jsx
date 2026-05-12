import { useState, useEffect } from 'react'
import { getNav, saveNav } from '../../lib/sanity.js'

export default function NavEditor() {
  const [nav, setNav] = useState(null)
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getNav().then(data => {
      setNav(data)
      setItems(data?.items || [])
    })
  }, [])

  function updateItem(i, field, value) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { _key: Math.random().toString(36).slice(2), label: '', slug: '' }])
  }

  function removeItem(i) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function moveUp(i) {
    if (i === 0) return
    setItems(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a })
  }

  function moveDown(i) {
    setItems(prev => {
      if (i >= prev.length - 1) return prev
      const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await saveNav(nav._id, items)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!nav) return <Skeleton />

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Menu de navigation</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3">
        {items.map((item, i) => (
          <div key={item._key || i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => moveUp(i)} className="text-slate-400 hover:text-slate-700 text-xs leading-none">▲</button>
              <button type="button" onClick={() => moveDown(i)} className="text-slate-400 hover:text-slate-700 text-xs leading-none">▼</button>
            </div>
            <input
              type="text"
              placeholder="Libellé (ex: Programme)"
              value={item.label || ''}
              onChange={e => updateItem(i, 'label', e.target.value)}
              className="input flex-1"
            />
            <input
              type="text"
              placeholder="Lien (ex: programme)"
              value={item.slug || ''}
              onChange={e => updateItem(i, 'slug', e.target.value)}
              className="input flex-1 text-slate-500 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-400 hover:text-red-600 text-lg leading-none px-1"
              title="Supprimer"
            >×</button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 transition text-sm"
        >
          + Ajouter un lien
        </button>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-lg font-semibold text-white transition mt-2 ${
            saved ? 'bg-green-500' : saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saved ? '✅ Enregistré !' : saving ? 'Enregistrement…' : 'Enregistrer le menu'}
        </button>
      </form>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 rounded w-48" />
      <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-3">
        {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-200 rounded-lg" />)}
      </div>
    </div>
  )
}
