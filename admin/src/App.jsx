import { useState } from 'react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [logged, setLogged] = useState(() => sessionStorage.getItem('ws_admin') === '1')

  function handleLogin() {
    sessionStorage.setItem('ws_admin', '1')
    setLogged(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('ws_admin')
    setLogged(false)
  }

  if (!logged) return <Login onLogin={handleLogin} />
  return <Dashboard onLogout={handleLogout} />
}
