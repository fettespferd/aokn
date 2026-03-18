import type { PageData, Tile } from '../types/page';
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

/**
 * Ergänzt fehlende lifeStageIds bei Kacheln aus älteren gespeicherten Daten.
 * Kacheln mit bekannten IDs bekommen die Zuordnung aus initialPageData.
 * Neu erstellte Kacheln (unbekannte IDs) bekommen alle Lebensphasen der aktuellen Seite.
 */
export function migratePageData(data: PageData): PageData {
  const allStageIds =
    data.lifeStages?.length > 0
      ? [...data.lifeStages].sort((a, b) => a.sortOrder - b.sortOrder).map((s) => s.id)
      : [];

  const enrichTile = (tile: Tile): Tile => {
    const hasLifeStageIds = tile.lifeStageIds && tile.lifeStageIds.length > 0;
    if (hasLifeStageIds) return tile;

    const initialIds = INITIAL_LIFE_STAGE_MAP.get(tile.id);
    const lifeStageIds = initialIds ?? (allStageIds.length > 0 ? allStageIds : []);
    return { ...tile, lifeStageIds };
  };

  return {
    ...data,
    sections: {
      helpful: data.sections.helpful.map(enrichTile),
      offers: data.sections.offers.map(enrichTile),
      wissenswertes: (data.sections.wissenswertes ?? []).map(enrichTile),
    },
  };
}
