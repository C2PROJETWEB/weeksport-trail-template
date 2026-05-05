export function StudioLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
      <img
        src="/logo-weeksport.png"
        alt="WEEK&SPORT"
        style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
      />
      <span style={{
        color: '#FFD93B',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif',
        opacity: 0.9
      }}>
        Admin
      </span>
    </div>
  )
}
