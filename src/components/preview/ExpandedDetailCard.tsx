import { Share2, ChevronUp } from 'lucide-react';
import type { Tile } from '../../types/page';

const BG_COLOR = '#152a24';
const CTA_COLOR = '#8cc63f';
const TEXT_COLOR = '#ffffff';

interface ExpandedDetailCardProps {
  tile: Tile;
  onClose: () => void;
}

export function ExpandedDetailCard({ tile, onClose }: ExpandedDetailCardProps) {
  return (
    <div
      style={{
        borderRadius: 18,
        backgroundColor: BG_COLOR,
        padding: 16,
        margin: '0 16px 20px',
        position: 'relative',
        boxSizing: 'border-box',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: TEXT_COLOR,
            cursor: 'pointer',
            padding: 4,
          }}
          aria-label="Zuklappen"
        >
          <ChevronUp size={22} strokeWidth={2} />
        </button>
        {tile.shareEnabled && (
          <button
            style={{
              background: 'none',
              border: 'none',
              color: CTA_COLOR,
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Teilen"
          >
            <Share2 size={20} strokeWidth={2} />
          </button>
        )}
      </div>

      {tile.expandedTitle && (
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: TEXT_COLOR,
            marginBottom: 12,
            paddingRight: 56,
          }}
        >
          {tile.expandedTitle}
        </div>
      )}

      {tile.description && (
        <div
          style={{
            fontSize: 14,
            color: TEXT_COLOR,
            opacity: 0.9,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {tile.description}
        </div>
      )}

      {tile.buttonEnabled && tile.buttonText && (
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: CTA_COLOR,
            color: '#000',
            border: 'none',
            borderRadius: 12,
            padding: '14px 20px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          {tile.buttonText}
        </button>
      )}
    </div>
  );
}
