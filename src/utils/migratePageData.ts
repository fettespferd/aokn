import type { PageData, Tile, SectionKey } from '../types/page';
import { initialPageData } from '../data/initialData';

function getAllTilesFromData(data: PageData): Tile[] {
  return [
    ...data.sections.helpful,
    ...data.sections.offers,
    ...(data.sections.wissenswertes ?? []),
  ];
}

function buildInitialLifeStageMap(): Map<string, string[] | undefined> {
  const map = new Map<string, string[] | undefined>();
  for (const tile of getAllTilesFromData(initialPageData)) {
    map.set(tile.id, tile.lifeStageIds);
  }
  return map;
}

const INITIAL_LIFE_STAGE_MAP = buildInitialLifeStageMap();

const INITIAL_TILE_MAP = new Map<string, Tile>();
for (const tile of getAllTilesFromData(initialPageData)) {
  INITIAL_TILE_MAP.set(tile.id, tile);
}

/**
 * Ergänzt fehlende Kacheln aus initialPageData (z.B. Stillen, Wochenbett für Demo 0.–3. Lebensmonat)
 * und aktualisiert lifeStageIds bei bekannten Kacheln (z.B. Erste-Hilfe für ls-0-3).
 */
function mergeMissingTiles(
  section: SectionKey,
  storedTiles: Tile[],
  allStageIds: string[]
): Tile[] {
  const storedIds = new Set(storedTiles.map((t) => t.id));
  const initialTiles = initialPageData.sections[section] ?? [];
  const missing: Tile[] = [];
  for (const t of initialTiles) {
    if (!storedIds.has(t.id)) {
      missing.push(t);
      storedIds.add(t.id);
    }
  }
  if (missing.length === 0) return storedTiles;
  const merged = [...storedTiles, ...missing].sort((a, b) => a.sortOrder - b.sortOrder);
  return merged;
}

/**
 * Ergänzt fehlende lifeStageIds bei Kacheln aus älteren gespeicherten Daten.
 * Kacheln mit bekannten IDs bekommen die Zuordnung aus initialPageData.
 * Neu erstellte Kacheln (unbekannte IDs) bekommen alle Lebensphasen der aktuellen Seite.
 * Fehlende Demo-Kacheln (Stillen, Wochenbett etc.) werden aus initialPageData ergänzt.
 */
export function migratePageData(data: PageData): PageData {
  const allStageIds =
    data.lifeStages?.length > 0
      ? [...data.lifeStages].sort((a, b) => a.sortOrder - b.sortOrder).map((s) => s.id)
      : [];

  const enrichTile = (tile: Tile): Tile => {
    const initialTile = INITIAL_TILE_MAP.get(tile.id);
    let result = tile;
    if (initialTile) {
      result = {
        ...tile,
        lifeStageIds: initialTile.lifeStageIds ?? tile.lifeStageIds,
        expandedTitle: initialTile.expandedTitle !== undefined ? initialTile.expandedTitle : tile.expandedTitle,
        description: initialTile.description !== undefined ? initialTile.description : tile.description,
        buttonText: initialTile.buttonText !== undefined ? initialTile.buttonText : tile.buttonText,
      };
    } else {
      const hasLifeStageIds = tile.lifeStageIds && tile.lifeStageIds.length > 0;
      if (!hasLifeStageIds) {
        const initialIds = INITIAL_LIFE_STAGE_MAP.get(tile.id);
        result = { ...tile, lifeStageIds: initialIds ?? (allStageIds.length > 0 ? allStageIds : []) };
      }
    }
    return result;
  };

  const sections = {
    helpful: mergeMissingTiles('helpful', data.sections.helpful.map(enrichTile), allStageIds),
    offers: mergeMissingTiles('offers', data.sections.offers.map(enrichTile), allStageIds),
    wissenswertes: mergeMissingTiles(
      'wissenswertes',
      (data.sections.wissenswertes ?? []).map(enrichTile),
      allStageIds
    ),
  };

  return { ...data, sections };
}
