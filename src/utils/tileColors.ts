import type { Tile } from '../types/page';
import {
  DEFAULT_TILE_COLOR_PRESET_ID,
  TILE_COLOR_PRESETS,
  type TileColorPresetId,
} from '../constants/tileColorPresets';

/** Hintergrundfarbe für die Kachel-Vorschau (einheitlich grün, optional pro Kachel überschreibbar). */
export function resolveTileBackgroundColor(tile: Tile): string {
  const id = (tile.tileColorPreset ?? DEFAULT_TILE_COLOR_PRESET_ID) as TileColorPresetId;
  const preset = TILE_COLOR_PRESETS.find((p) => p.id === id);
  return preset?.color ?? TILE_COLOR_PRESETS[0].color;
}
