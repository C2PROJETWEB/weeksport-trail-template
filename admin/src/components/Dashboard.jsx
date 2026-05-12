import { useState } from 'react'
import SiteEditor from './editors/SiteEditor.jsx'
import NavEditor from './editors/NavEditor.jsx'
import PagesEditor from './editors/PagesEditor.jsx'
import HelpEditor from './editors/HelpEditor.jsx'

const tabs = [
  { id: 'site', label: '🏠 Accueil', desc: 'Photo, titre, date, bouton' },
  { id: 'nav', label: '☰ Menu', desc: 'Navigation du site' },
  { id: 'pages', label: '📄 Pages', desc: 'Textes et contenus' },
  { id: 'help', label: '❓ Aide', desc: 'Guide d\'utilisation' },
]

export default function Dashboard({ onLogout }) {
  const [active, setActive] = useState('site')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏔️</span>
          <div>
            <h1 className="font-bold text-lg leading-none">WEEK&SPORT</h1>
            <p className="text-slate-400 text-xs">Administration du site</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          Déconnexion
        </button>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                active === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        {active === 'site' && <SiteEditor />}
        {active === 'nav' && <NavEditor />}
        {active === 'pages' && <PagesEditor />}
        {active === 'help' && <HelpEditor />}
      </main>
    </div>
  )
}
