import { ChevronUp } from 'lucide-react';
import { getIconComponent } from '../../utils/iconMap';
import type { Tile } from '../../types/page';

const BG_HELPFUL = '#3d4d3e';
const BG_OFFERS = '#333e3e';
const BG_WISSENSWERTES = '#2d3d4e';
const TEXT_COLOR = '#ffffff';

const TILE_HEIGHT = 140;

interface TileCardProps {
  tile: Tile;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TileCard({ tile, isExpanded, onToggle }: TileCardProps) {
  const Icon = getIconComponent(tile.icon);
  const bgColor =
    tile.section === 'helpful'
      ? BG_HELPFUL
      : tile.section === 'wissenswertes'
        ? BG_WISSENSWERTES
        : BG_OFFERS;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      style={{
        borderRadius: 18,
        backgroundColor: bgColor,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        height: TILE_HEIGHT,
        boxSizing: 'border-box',
        position: 'relative',
        cursor: 'pointer',
        minWidth: 0,
      }}
    >
      <div
        lang="de"
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: TEXT_COLOR,
          flexShrink: 0,
          textAlign: 'center',
          lineHeight: 1.3,
          overflowWrap: 'break-word',
          hyphens: 'auto',
          WebkitHyphens: 'auto',
          msHyphens: 'auto',
        }}
      >
        {tile.title}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
        }}
      >
        {isExpanded ? (
          <div style={{ flexShrink: 0 }}>
            <ChevronUp size={28} strokeWidth={2} />
          </div>
        ) : (
          <Icon size={36} color={TEXT_COLOR} strokeWidth={1.5} />
        )}
      </div>

      {!isExpanded && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `1.5px solid ${TEXT_COLOR}`,
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}
