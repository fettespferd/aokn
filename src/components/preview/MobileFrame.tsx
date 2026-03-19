import { ChevronLeft, MoreVertical } from 'lucide-react';
import { TileGrid } from './TileGrid';
import { BottomNav } from './BottomNav';
import { LifeStageSelector } from './LifeStageSelector';
import type { Tile, LifeStage } from '../../types/page';

const BG_COLOR = '#0a1a16';
const TEXT_COLOR = '#ffffff';

interface MobileFrameProps {
  pageTitle: string;
  lifeStages: LifeStage[];
  selectedLifeStageId: string | null;
  onSelectLifeStage: (id: string) => void;
  helpfulTiles: Tile[];
  offersTiles: Tile[];
  wissenswertesTiles: Tile[];
  expandedTileId: string | null;
  onToggleTile: (tileId: string) => void;
  width: number;
  height: number;
  zoomLevel?: number;
}

export function MobileFrame({
  pageTitle,
  lifeStages,
  selectedLifeStageId,
  onSelectLifeStage,
  helpfulTiles,
  offersTiles,
  wissenswertesTiles,
  expandedTileId,
  onToggleTile,
  width,
  height,
  zoomLevel = 100,
}: MobileFrameProps) {
  const handleToggle = (tileId: string) => {
    onToggleTile(expandedTileId === tileId ? '' : tileId);
  };

  const scale = zoomLevel / 100;
  const isZoomed = scale !== 1;

  const headerEl = (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        paddingTop: 48,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}
    >
      <button style={{ background: 'none', border: 'none', color: TEXT_COLOR, cursor: 'pointer', padding: 8 }} aria-label="Zurück">
        <ChevronLeft size={28} strokeWidth={2} />
      </button>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT_COLOR, margin: 0 }}>{pageTitle}</h1>
      <button style={{ background: 'none', border: 'none', color: TEXT_COLOR, cursor: 'pointer', padding: 8 }} aria-label="Menü">
        <MoreVertical size={24} strokeWidth={2} />
      </button>
    </header>
  );

  const scrollableContent = (
    <>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'auto', paddingBottom: 24 }}>
        {lifeStages.length > 0 && <LifeStageSelector lifeStages={lifeStages} selectedId={selectedLifeStageId} onSelect={onSelectLifeStage} />}
        <section style={{ paddingTop: lifeStages.length > 0 ? 0 : 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: TEXT_COLOR, opacity: 0.9, margin: '0 16px 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Aktuell für Sie hilfreich</h2>
          <TileGrid tiles={helpfulTiles} expandedTileId={expandedTileId} onToggle={handleToggle} zoomLevel={zoomLevel} />
        </section>
        <section style={{ paddingTop: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: TEXT_COLOR, opacity: 0.9, margin: '0 16px 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Weitere Angebote</h2>
          <TileGrid tiles={offersTiles} expandedTileId={expandedTileId} onToggle={handleToggle} zoomLevel={zoomLevel} />
        </section>
        <section style={{ paddingTop: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: TEXT_COLOR, opacity: 0.9, margin: '0 16px 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Wissenswertes</h2>
          <TileGrid tiles={wissenswertesTiles} expandedTileId={expandedTileId} onToggle={handleToggle} zoomLevel={zoomLevel} />
        </section>
      </div>
      <BottomNav />
    </>
  );

  return (
    <div
      style={{
        width: width,
        height: height,
        flexShrink: 0,
        borderRadius: 40,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        border: '12px solid #1a1a1a',
        backgroundColor: BG_COLOR,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {headerEl}
      {isZoomed ? (
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <div style={{ width: width * scale, minHeight: (height - 120) * scale, flexShrink: 0 }}>
            <div
              style={{
                width: width,
                minHeight: height - 120,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {scrollableContent}
            </div>
          </div>
        </div>
      ) : (
        scrollableContent
      )}
    </div>
  );
}
