import { TileCard } from './TileCard';
import { ExpandedDetailCard } from './ExpandedDetailCard';
import type { Tile } from '../../types/page';

interface TileGridProps {
  tiles: Tile[];
  expandedTileId: string | null;
  onToggle: (tileId: string) => void;
}

export function TileGrid({ tiles, expandedTileId, onToggle }: TileGridProps) {
  const visibleTiles = tiles.filter((t) => t.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  const expandedTile = visibleTiles.find((t) => t.id === expandedTileId);

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gridAutoRows: '140px',
          gap: 16,
          padding: '0 16px 16px',
          minWidth: 0,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {visibleTiles.map((tile) => (
          <div key={tile.id} style={{ minWidth: 0 }}>
            <TileCard
              tile={tile}
              isExpanded={expandedTileId === tile.id}
              onToggle={() => onToggle(tile.id)}
            />
          </div>
        ))}
      </div>

      {expandedTile && (expandedTile.expandedTitle || expandedTile.description || expandedTile.buttonEnabled) && (
        <ExpandedDetailCard tile={expandedTile} onClose={() => onToggle(expandedTile.id)} />
      )}
    </>
  );
}
