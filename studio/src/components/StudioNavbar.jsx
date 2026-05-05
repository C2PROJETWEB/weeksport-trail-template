import { StudioLogo } from './StudioLogo'

export function StudioNavbar(props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: '100%',
      background: '#0a0a0a',
      borderBottom: '2px solid #FFD93B'
    }}>
      <StudioLogo />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {props.renderDefault(props)}
      </div>
    </div>
  )
}
