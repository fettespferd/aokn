import { ChevronUp } from 'lucide-react';
import { getIconComponent } from '../../utils/iconMap';
import type { Tile } from '../../types/page';

const BG_HELPFUL = '#3d4d3e';
const BG_OFFERS = '#333e3e';
const BG_WISSENSWERTES = '#2d3d4e';
const TEXT_COLOR = '#ffffff';

interface TileCardProps {
  tile: Tile;
  isExpanded: boolean;
  onToggle: () => void;
  zoomLevel?: number;
}

export function TileCard({ tile, isExpanded, onToggle, zoomLevel = 100 }: TileCardProps) {
  const Icon = getIconComponent(tile.icon);
  const isZoomed = zoomLevel >= 125;
  const minHeight = zoomLevel >= 150 ? 170 : zoomLevel >= 125 ? 150 : 140;
  const padding = isZoomed ? 18 : 14;
  const titleFontSize = zoomLevel >= 150 ? 16 : zoomLevel >= 125 ? 15.5 : 15;

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
        padding,
        display: 'flex',
        flexDirection: 'column',
        minHeight,
        height: 'auto',
        boxSizing: 'border-box',
        position: 'relative',
        cursor: 'pointer',
        minWidth: 0,
        overflow: 'hidden',
        padding,
      }}
    >
      <div
        lang="de"
        style={{
          fontWeight: 600,
          fontSize: titleFontSize,
          color: TEXT_COLOR,
          flexShrink: 1,
          minWidth: 0,
          width: '100%',
          textAlign: 'center',
          lineHeight: 1.3,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
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
          <ChevronUp size={28} strokeWidth={2} color={TEXT_COLOR} />
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
