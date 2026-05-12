import { useState } from 'react'

const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'weeksport2026'

export default function Login({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pw === PASSWORD) { onLogin() }
    else { setError(true); setPw('') }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🏔️</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">WEEK&SPORT</h1>
        <p className="text-slate-500 text-sm mb-8">Espace d'administration</p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            autoFocus
            className={`w-full border rounded-lg px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
          />
          {error && <p className="text-red-500 text-sm">Mot de passe incorrect</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
