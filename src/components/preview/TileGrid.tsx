import { Fragment } from 'react';
import { TileCard } from './TileCard';
import { ExpandedDetailCard } from './ExpandedDetailCard';
import type { Tile } from '../../types/page';

interface TileGridProps {
  tiles: Tile[];
  expandedTileId: string | null;
  onToggle: (tileId: string) => void;
  zoomLevel?: number;
}

export function TileGrid({ tiles, expandedTileId, onToggle, zoomLevel = 100 }: TileGridProps) {
  // Reihenfolge kommt von getTilesForPreview (inkl. Lebensphase) — nicht erneut nach tile.sortOrder sortieren
  const visibleTiles = tiles.filter((t) => t.isVisible);
  const expandedTile = visibleTiles.find((t) => t.id === expandedTileId);
  const singleColumn = zoomLevel >= 150;
  const isZoomed = zoomLevel >= 125;
  const colsPerRow = singleColumn ? 1 : 2;

  const rows: Tile[][] = [];
  for (let i = 0; i < visibleTiles.length; i += colsPerRow) {
    rows.push(visibleTiles.slice(i, i + colsPerRow));
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: singleColumn ? '1fr' : 'minmax(140px, 1fr) minmax(140px, 1fr)',
        gridAutoRows: singleColumn ? 'minmax(180px, auto)' : 'minmax(140px, auto)',
        gap: isZoomed ? 20 : 12,
        padding: '0 12px 16px',
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {rows.map((rowTiles, rowIndex) => (
        <Fragment key={rowIndex}>
          {rowTiles.map((tile) => (
            <div key={tile.id} style={{ minWidth: 0 }}>
              <TileCard
                tile={tile}
                isExpanded={expandedTileId === tile.id}
                onToggle={() => onToggle(tile.id)}
                zoomLevel={zoomLevel}
              />
            </div>
          ))}
          {expandedTile &&
            rowTiles.some((t) => t.id === expandedTileId) &&
            (expandedTile.expandedTitle || expandedTile.description || expandedTile.buttonEnabled) && (
              <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
                <ExpandedDetailCard tile={expandedTile} onClose={() => onToggle(expandedTile.id)} zoomLevel={zoomLevel} />
              </div>
            )}
        </Fragment>
      ))}
    </div>
  );
}
