import { Home, FileEdit, HeartHandshake, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Startseite', Icon: Home, active: true },
  { id: 'requests', label: 'Anfragen', Icon: FileEdit, active: false },
  { id: 'offers', label: 'Angebote', Icon: HeartHandshake, active: false },
  { id: 'settings', label: 'Einstellungen', Icon: Settings, active: false },
];

const BG_COLOR = '#0a1a16';
const ACTIVE_COLOR = '#8cc63f';
const INACTIVE_COLOR = '#ffffff';

export function BottomNav() {
  return (
    <nav
      style={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 8px',
        backgroundColor: BG_COLOR,
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {NAV_ITEMS.map(({ id, label, Icon, active }) => (
        <div
          key={id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: active ? ACTIVE_COLOR : INACTIVE_COLOR,
            opacity: active ? 1 : 0.7,
          }}
        >
          <Icon size={24} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
        </div>
      ))}
    </nav>
  );
}
