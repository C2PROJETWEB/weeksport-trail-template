const sites = [
  { slug: 'villerest', name: 'Trail du Lac de Villerest', color: '#1D3557', emoji: '🏞️' },
  { slug: 'planete', name: 'Trail de la Planète Mars', color: '#2D6A4F', emoji: '🌍' },
  { slug: 'roanne', name: 'Roanne Trail Urbain', color: '#C9184A', emoji: '🏙️' },
]

export function WelcomeDashboard() {
  return (
    <div style={{
      padding: '48px 40px',
      maxWidth: '960px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'inline-block',
          background: '#FFD93B',
          color: '#000',
          fontWeight: '900',
          fontSize: '11px',
          letterSpacing: '0.15em',
          padding: '4px 12px',
          borderRadius: '4px',
          marginBottom: '16px',
          textTransform: 'uppercase'
        }}>
          WEEK&amp;SPORT
        </div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          margin: '0 0 8px',
          color: '#111'
        }}>
          Bonjour 👋
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          Gérez le contenu de vos événements sportifs depuis cet espace.
        </p>
      </div>

      {/* Sites */}
      <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Vos événements
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '48px' }}>
        {sites.map(site => (
          <a
            key={site.slug}
            href={`/structure/site;${site.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = site.color
              e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#eee'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: site.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>
              {site.emoji}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#111', marginBottom: '4px' }}>{site.name}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>Modifier le contenu →</div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick access */}
      <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Accès rapide
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Toutes les pages', icon: '📄', href: '/structure/page' },
          { label: 'Menus de nav', icon: '☰', href: '/structure/navigation' },
          { label: 'Médias', icon: '🖼️', href: '/media' },
        ].map(item => (
          <a
            key={item.label}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 16px',
              background: '#f8f8f8',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f8f8f8'}
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
