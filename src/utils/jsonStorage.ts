import type { PageData, Tile } from '../types/page';

const STORAGE_KEY = 'cms-pregnancy-page';

export function loadFromStorage(): PageData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (isValidPageData(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveToStorage(data: PageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
  } catch {
    // quota exceeded etc.
  }
}

function isValidTile(obj: unknown): obj is Tile {
  if (!obj || typeof obj !== 'object') return false;
  const t = obj as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.section === 'string' &&
    (t.section === 'helpful' || t.section === 'offers' || t.section === 'wissenswertes') &&
    typeof t.title === 'string' &&
    typeof t.icon === 'string' &&
    typeof t.buttonEnabled === 'boolean' &&
    typeof t.isVisible === 'boolean' &&
    typeof t.sortOrder === 'number'
  );
}

function isValidPageData(obj: unknown): obj is PageData {
  if (!obj || typeof obj !== 'object') return false;
  const p = obj as Record<string, unknown>;
  if (typeof p.pageId !== 'string' || typeof p.pageTitle !== 'string') return false;
  const sections = p.sections;
  if (!sections || typeof sections !== 'object') return false;
  const s = sections as Record<string, unknown>;
  if (!Array.isArray(s.helpful) || !Array.isArray(s.offers)) return false;
  if (p.lifeStages !== undefined && !Array.isArray(p.lifeStages)) return false;
  const wissenswertes = Array.isArray(s.wissenswertes) ? s.wissenswertes : [];
  return (
    s.helpful.every(isValidTile) &&
    s.offers.every(isValidTile) &&
    wissenswertes.every(isValidTile)
  );
}

export function validateAndParsePageData(json: string): PageData | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (isValidPageData(parsed)) {
      return {
        ...parsed,
        lifeStages: Array.isArray(parsed.lifeStages) ? parsed.lifeStages : [],
        sections: {
          helpful: parsed.sections?.helpful ?? [],
          offers: parsed.sections?.offers ?? [],
          wissenswertes: parsed.sections?.wissenswertes ?? [],
        },
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function exportToJson(data: PageData): string {
  return JSON.stringify(data, null, 2);
}
