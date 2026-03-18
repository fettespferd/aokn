import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import type { LifeStage } from '../../types/page';

const ACCENT_COLOR = '#8cc63f';
const TEXT_DARK = '#0a1a16';

interface LifeStageSelectorProps {
  lifeStages: LifeStage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LifeStageSelector({ lifeStages, selectedId, onSelect }: LifeStageSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sorted = [...lifeStages].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentIndex = sorted.findIndex((s) => s.id === selectedId);
  const current = selectedId ? sorted.find((s) => s.id === selectedId) : null;

  const handlePrev = () => {
    if (currentIndex > 0) onSelect(sorted[currentIndex - 1].id);
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < sorted.length - 1) onSelect(sorted[currentIndex + 1].id);
  };

  if (sorted.length === 0) return null;

  return (
    <div style={{ position: 'relative', margin: '16px 16px 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            backgroundColor: ACCENT_COLOR,
            border: 'none',
            cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex <= 0 ? 0.5 : 1,
          }}
          aria-label="Vorheriger Zeitraum"
        >
          <ChevronLeft size={24} color={TEXT_DARK} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setDropdownOpen((o) => !o)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            backgroundColor: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            color: TEXT_DARK,
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <span>{current?.label ?? 'Zeitraum wählen'}</span>
          <ChevronDown
            size={20}
            color={TEXT_DARK}
            strokeWidth={2.5}
            style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex < 0 || currentIndex >= sorted.length - 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            backgroundColor: ACCENT_COLOR,
            border: 'none',
            cursor: currentIndex >= sorted.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentIndex >= sorted.length - 1 ? 0.5 : 1,
          }}
          aria-label="Nächster Zeitraum"
        >
          <ChevronRight size={24} color={TEXT_DARK} strokeWidth={2.5} />
        </button>
      </div>

      {dropdownOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10,
            }}
            onClick={() => setDropdownOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 4,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              zIndex: 11,
              maxHeight: 280,
              overflow: 'auto',
            }}
          >
            {sorted.map((stage) => (
              <button
                key={stage.id}
                onClick={() => {
                  onSelect(stage.id);
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  background: stage.id === selectedId ? 'rgba(140,198,63,0.2)' : 'transparent',
                  color: TEXT_DARK,
                  fontWeight: stage.id === selectedId ? 700 : 500,
                  fontSize: 15,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
