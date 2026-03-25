import type { TileColorPresetId } from '../constants/tileColorPresets';

export type SectionKey = 'helpful' | 'offers' | 'wissenswertes';

export type LifeStageType = 'months' | 'years';

export type { TileColorPresetId };

export interface LifeStage {
  id: string;
  label: string;
  type: LifeStageType;
  from: number;
  to: number;
  sortOrder: number;
}

export interface Tile {
  id: string;
  section: SectionKey;
  title: string;
  icon: string;
  expandedTitle?: string;
  description?: string;
  buttonEnabled: boolean;
  buttonText?: string;
  buttonActionType?: 'link' | 'deeplink' | 'none';
  buttonTarget?: string;
  shareEnabled?: boolean;
  initiallyExpanded?: boolean;
  isVisible: boolean;
  sortOrder: number;
  /** Hintergrundfarbe in der Vorschau; ohne Eintrag = Standard (AOK-Grün). */
  tileColorPreset?: TileColorPresetId;
  /** Leer = für alle Lebensbereiche sichtbar. Sonst nur wenn selectedLifeStageId in der Liste. */
  lifeStageIds?: string[];
  /** Optionale Sektion pro Lebensphase – sonst wird section verwendet. */
  sectionByLifeStage?: Record<string, SectionKey>;
  /** Optionale Reihenfolge pro Lebensphase – sonst wird sortOrder verwendet. */
  sortOrderByLifeStage?: Record<string, number>;
}

export interface PageData {
  pageId: string;
  pageTitle: string;
  lifeStages: LifeStage[];
  sections: {
    helpful: Tile[];
    offers: Tile[];
    wissenswertes: Tile[];
  };
}
