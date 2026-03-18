import type { PageData, Tile, SectionKey } from '../types/page';

const SECTIONS: SectionKey[] = ['helpful', 'offers', 'wissenswertes'];

function isTileVisibleInLifeStage(tile: Tile, selectedLifeStageId: string | null): boolean {
  if (!selectedLifeStageId) return true;
  const ids = tile.lifeStageIds;
  if (!ids || ids.length === 0) return true;
  return ids.includes(selectedLifeStageId);
}

function getEffectiveSection(tile: Tile, selectedLifeStageId: string | null): SectionKey {
  if (!selectedLifeStageId) return tile.section;
  const override = tile.sectionByLifeStage?.[selectedLifeStageId];
  return override ?? tile.section;
}

function getEffectiveSortOrder(tile: Tile, selectedLifeStageId: string | null): number {
  if (!selectedLifeStageId) return tile.sortOrder;
  const override = tile.sortOrderByLifeStage?.[selectedLifeStageId];
  return override ?? tile.sortOrder;
}

export interface TilesBySection {
  helpful: Tile[];
  offers: Tile[];
  wissenswertes: Tile[];
}

/**
 * Ermittelt die Kacheln pro Sektion für die Vorschau.
 * Berücksichtigt lifeStageIds (Sichtbarkeit) sowie sectionByLifeStage und sortOrderByLifeStage (Position).
 */
export function getTilesForPreview(
  pageData: PageData,
  selectedLifeStageId: string | null
): TilesBySection {
  const allTiles: Tile[] = [
    ...pageData.sections.helpful,
    ...pageData.sections.offers,
    ...(pageData.sections.wissenswertes ?? []),
  ];

  const visible = allTiles.filter((t) => isTileVisibleInLifeStage(t, selectedLifeStageId));

  const bySection: TilesBySection = {
    helpful: [],
    offers: [],
    wissenswertes: [],
  };

  for (const tile of visible) {
    const section = getEffectiveSection(tile, selectedLifeStageId);
    bySection[section].push(tile);
  }

  for (const key of SECTIONS) {
    bySection[key].sort((a, b) => {
      const orderA = getEffectiveSortOrder(a, selectedLifeStageId);
      const orderB = getEffectiveSortOrder(b, selectedLifeStageId);
      return orderA - orderB;
    });
  }

  return bySection;
}

/** Für Zuordnung-Board: Tiles für einen Lebensphase-Editor (Standard = null). Bei Lebensphase nur sichtbare Tiles. */
export function getTilesForAssignment(
  pageData: PageData,
  assignmentLifeStageId: string | null
): TilesBySection {
  let allTiles: Tile[] = [
    ...pageData.sections.helpful,
    ...pageData.sections.offers,
    ...(pageData.sections.wissenswertes ?? []),
  ];
  if (assignmentLifeStageId) {
    allTiles = allTiles.filter((t) => isTileVisibleInLifeStage(t, assignmentLifeStageId));
  }

  const bySection: TilesBySection = {
    helpful: [],
    offers: [],
    wissenswertes: [],
  };

  for (const tile of allTiles) {
    const section = getEffectiveSection(tile, assignmentLifeStageId);
    bySection[section].push(tile);
  }

  for (const key of SECTIONS) {
    bySection[key].sort((a, b) => {
      const orderA = getEffectiveSortOrder(a, assignmentLifeStageId);
      const orderB = getEffectiveSortOrder(b, assignmentLifeStageId);
      return orderA - orderB;
    });
  }

  return bySection;
}
