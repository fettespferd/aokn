/**
 * Vordefinierte Kachel-Hintergrundfarben.
 * Standard ist ein einheitliches AOK-Grün; weitere Töne optional pro Kachel wählbar.
 */
export type TileColorPresetId =
  | 'standard'
  | 'moss'
  | 'deepForest'
  | 'sageGreen'
  | 'pine'
  | 'slateAccent';

export const DEFAULT_TILE_COLOR_PRESET_ID: TileColorPresetId = 'standard';

export const TILE_COLOR_PRESETS: ReadonlyArray<{
  id: TileColorPresetId;
  label: string;
  color: string;
}> = [
  { id: 'standard', label: 'Standard (AOK-Grün)', color: '#3d4d3e' },
  { id: 'moss', label: 'Moosgrün', color: '#3a4f3c' },
  { id: 'deepForest', label: 'Tiefgrün', color: '#2d3d2f' },
  { id: 'sageGreen', label: 'Salbeigrün', color: '#3e4d40' },
  { id: 'pine', label: 'Kieferngrün', color: '#334d3a' },
  { id: 'slateAccent', label: 'Schiefer (Akzent)', color: '#2d3d4e' },
];
