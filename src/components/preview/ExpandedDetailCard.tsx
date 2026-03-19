import { Share2 } from 'lucide-react';
import type { Tile } from '../../types/page';

const BG_COLOR = '#152a24';
const CTA_COLOR = '#8cc63f';
const TEXT_COLOR = '#ffffff';

interface ExpandedDetailCardProps {
  tile: Tile;
  onClose: () => void;
  zoomLevel?: number;
}

export function ExpandedDetailCard({ tile, onClose: _onClose, zoomLevel = 100 }: ExpandedDetailCardProps) {
  const isZoomed = zoomLevel >= 125;
  const padding = isZoomed ? 20 : 16;
  const marginBottom = isZoomed ? 24 : 20;
  const titleFontSize = zoomLevel >= 150 ? 17 : zoomLevel >= 125 ? 16.5 : 16;
  const descFontSize = zoomLevel >= 150 ? 15 : zoomLevel >= 125 ? 14.5 : 14;
  return (
    <div
      style={{
        borderRadius: 18,
        backgroundColor: BG_COLOR,
        padding,
        margin: `0 0 ${marginBottom}px`,
        position: 'relative',
        boxSizing: 'border-box',
        maxWidth: '100%',
      }}
    >
      {tile.shareEnabled && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
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
        </div>
      )}

      {tile.expandedTitle && (
        <div
          style={{
            fontWeight: 600,
            fontSize: titleFontSize,
            color: TEXT_COLOR,
            marginBottom: 12,
            paddingRight: tile.shareEnabled ? 40 : 0,
          }}
        >
          {tile.expandedTitle}
        </div>
      )}

      {tile.description && (
        <div
          style={{
            fontSize: descFontSize,
            color: TEXT_COLOR,
            opacity: 0.9,
            lineHeight: 1.5,
            marginBottom: 16,
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {tile.description}
        </div>
      )}

      {tile.buttonEnabled && tile.buttonText && (
        <div
          style={{
            marginTop: 4,
            containerType: 'inline-size',
            width: '100%',
          }}
        >
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: CTA_COLOR,
              color: '#000',
              border: 'none',
              borderRadius: 12,
              padding: isZoomed ? '16px 24px' : '14px 20px',
              fontWeight: 600,
              fontSize: 'clamp(11px, 4cqi, 16px)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {tile.buttonText}
          </button>
        </div>
      )}
    </div>
  );
}
