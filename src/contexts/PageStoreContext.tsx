import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { PageData, Tile, SectionKey, LifeStage } from '../types/page';
import { initialPageData } from '../data/initialData';
import { loadFromStorage, saveToStorage } from '../utils/jsonStorage';
import { migratePageData } from '../utils/migratePageData';

function generateId(): string {
  return `tile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateLifeStageId(): string {
  return `ls-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface PageStoreValue {
  pageData: PageData;
  expandedTileId: string | null;
  /** Gewählte Lebensphase für Vorschau/Zuordnung; null nur wenn es keine Zeiträume gibt */
  selectedLifeStageId: string | null;
  setExpandedTileId: (id: string | null) => void;
  setSelectedLifeStageId: (id: string | null) => void;
  updatePageTitle: (title: string) => void;
  addTile: (section: SectionKey) => Tile;
  updateTile: (id: string, updates: Partial<Tile>) => void;
  deleteTile: (id: string) => void;
  reorderTiles: (section: SectionKey, draggedId: string, targetId: string | 'end') => void;
  moveTileToSection: (tileId: string, targetSection: SectionKey, targetIndex: number) => void;
  updateTileAssignmentForLifeStage: (
    tileId: string,
    lifeStageId: string,
    assignment: { section: SectionKey; sortOrder: number }
  ) => void;
  addTileToSectionForLifeStage: (
    tileId: string,
    lifeStageId: string,
    section: SectionKey,
    sortOrder: number
  ) => void;
  reorderTilesForLifeStage: (section: SectionKey, lifeStageId: string, orderedTileIds: string[]) => void;
  addLifeStage: (stage: Omit<LifeStage, 'id'>) => LifeStage;
  updateLifeStage: (id: string, updates: Partial<LifeStage>) => void;
  deleteLifeStage: (id: string) => void;
  reorderLifeStages: (draggedId: string, targetId: string | 'end') => void;
  setPageData: (data: PageData) => void;
}

const PageStoreContext = createContext<PageStoreValue | null>(null);

export function PageStoreProvider({ children }: { children: ReactNode }) {
  const [pageData, setPageDataState] = useState<PageData>(() => {
    const stored = loadFromStorage();
    const data = stored ?? initialPageData;
    const withDefaults = {
      ...data,
      lifeStages: data.lifeStages?.length ? data.lifeStages : initialPageData.lifeStages,
      sections: {
        helpful: data.sections?.helpful ?? [],
        offers: data.sections?.offers ?? [],
        wissenswertes: data.sections?.wissenswertes ?? [],
      },
    };
    return migratePageData(withDefaults);
  });

  const [expandedTileId, setExpandedTileId] = useState<string | null>(() => {
    const allTiles = [
      ...pageData.sections.helpful,
      ...pageData.sections.offers,
      ...(pageData.sections.wissenswertes ?? []),
    ];
    return allTiles.find((t) => t.initiallyExpanded)?.id ?? null;
  });

  /** Immer eine konkrete Lebensphase (Vorschau + Zuordnung); null nur wenn keine Zeiträume existieren */
  const [selectedLifeStageId, setSelectedLifeStageId] = useState<string | null>(() => {
    const stages = [...(pageData.lifeStages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    return stages[0]?.id ?? null;
  });

  useEffect(() => {
    const sorted = [...(pageData.lifeStages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    if (sorted.length === 0) {
      setSelectedLifeStageId(null);
      return;
    }
    setSelectedLifeStageId((cur) => (cur && sorted.some((s) => s.id === cur) ? cur : sorted[0].id));
  }, [pageData.lifeStages]);

  useEffect(() => {
    saveToStorage(pageData);
  }, [pageData]);

  const updatePageTitle = useCallback((title: string) => {
    setPageDataState((prev) => ({ ...prev, pageTitle: title }));
  }, []);

  const addTile = useCallback((section: SectionKey): Tile => {
    const newTile: Tile = {
      id: generateId(),
      section,
      title: 'Neue Kachel',
      icon: 'FileText',
      buttonEnabled: false,
      isVisible: true,
      sortOrder: 0,
    };
    setPageDataState((prev) => {
      const tiles = [...prev.sections[section]];
      const maxOrder = tiles.length > 0 ? Math.max(...tiles.map((t) => t.sortOrder)) : -1;
      const withOrder = { ...newTile, sortOrder: maxOrder + 1 };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: [...prev.sections[section], withOrder].sort((a, b) => a.sortOrder - b.sortOrder),
        },
      };
    });
    return newTile;
  }, []);

  const updateTile = useCallback((id: string, updates: Partial<Tile>) => {
    setPageDataState((prev) => {
      const updateInSection = (tiles: Tile[]) =>
        tiles.map((t) => (t.id === id ? { ...t, ...updates } : t));
      return {
        ...prev,
        sections: {
          helpful: updateInSection(prev.sections.helpful),
          offers: updateInSection(prev.sections.offers),
          wissenswertes: updateInSection(prev.sections.wissenswertes ?? []),
        },
      };
    });
  }, []);

  const deleteTile = useCallback((id: string) => {
    setPageDataState((prev) => ({
      ...prev,
      sections: {
        helpful: prev.sections.helpful.filter((t) => t.id !== id),
        offers: prev.sections.offers.filter((t) => t.id !== id),
        wissenswertes: (prev.sections.wissenswertes ?? []).filter((t) => t.id !== id),
      },
    }));
    setExpandedTileId((current) => (current === id ? null : current));
  }, []);

  const reorderTiles = useCallback((section: SectionKey, draggedId: string, targetId: string | 'end') => {
    setPageDataState((prev) => {
      const tiles = [...prev.sections[section]].sort((a, b) => a.sortOrder - b.sortOrder);
      const dragIdx = tiles.findIndex((t) => t.id === draggedId);
      const targetIdx = targetId === 'end' ? tiles.length : tiles.findIndex((t) => t.id === targetId);
      if (dragIdx < 0 || (targetId !== 'end' && targetIdx < 0)) return prev;
      const [removed] = tiles.splice(dragIdx, 1);
      const insertIdx = targetId === 'end' ? tiles.length : targetIdx > dragIdx ? targetIdx - 1 : targetIdx;
      tiles.splice(insertIdx, 0, removed);
      const withOrder = tiles.map((t, idx) => ({ ...t, sortOrder: idx }));
      return { ...prev, sections: { ...prev.sections, [section]: withOrder } };
    });
  }, []);

  const moveTileToSection = useCallback((tileId: string, targetSection: SectionKey, targetIndex: number) => {
    setPageDataState((prev) => {
      const findTile = () => {
        for (const key of ['helpful', 'offers', 'wissenswertes'] as const) {
          const tile = prev.sections[key].find((t) => t.id === tileId);
          if (tile) return { tile, key };
        }
        return null;
      };
      const found = findTile();
      if (!found) return prev;
      const { tile, key: sourceSection } = found;
      const targetTiles = [...prev.sections[targetSection]].sort((a, b) => a.sortOrder - b.sortOrder);
      const currentIdx = targetTiles.findIndex((t) => t.id === tileId);
      if (sourceSection === targetSection) {
        if (currentIdx === targetIndex) return prev;
        const reordered = targetTiles.filter((t) => t.id !== tileId);
        reordered.splice(targetIndex, 0, tile);
        const withOrder = reordered.map((t, idx) => ({ ...t, sortOrder: idx }));
        return { ...prev, sections: { ...prev.sections, [targetSection]: withOrder } };
      }
      const without = [...prev.sections[sourceSection]].filter((t) => t.id !== tileId);
      const updated = { ...tile, section: targetSection, sortOrder: targetIndex };
      targetTiles.splice(targetIndex, 0, updated);
      const withOrder = targetTiles.map((t, idx) => ({ ...t, sortOrder: idx }));
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sourceSection]: without.map((t, idx) => ({ ...t, sortOrder: idx })),
          [targetSection]: withOrder,
        },
      };
    });
  }, []);

  const updateTileAssignmentForLifeStage = useCallback(
    (tileId: string, lifeStageId: string, assignment: { section: SectionKey; sortOrder: number }) => {
      setPageDataState((prev) => {
        const updateInSection = (tiles: Tile[]) =>
          tiles.map((t) => {
            if (t.id !== tileId) return t;
            const nextBySection = { ...(t.sectionByLifeStage ?? {}), [lifeStageId]: assignment.section };
            const nextByOrder = { ...(t.sortOrderByLifeStage ?? {}), [lifeStageId]: assignment.sortOrder };
            return {
              ...t,
              sectionByLifeStage: nextBySection,
              sortOrderByLifeStage: nextByOrder,
            };
          });
        return {
          ...prev,
          sections: {
            helpful: updateInSection(prev.sections.helpful),
            offers: updateInSection(prev.sections.offers),
            wissenswertes: updateInSection(prev.sections.wissenswertes ?? []),
          },
        };
      });
    },
    []
  );

  const addTileToSectionForLifeStage = useCallback(
    (tileId: string, lifeStageId: string, section: SectionKey, sortOrder: number) => {
      setPageDataState((prev) => {
        const updateInSection = (tiles: Tile[]) =>
          tiles.map((t) => {
            if (t.id !== tileId) return t;
            const ids = t.lifeStageIds ?? [];
            const hasStage = ids.includes(lifeStageId);
            const nextIds = hasStage ? ids : [...ids, lifeStageId];
            const nextBySection = { ...(t.sectionByLifeStage ?? {}), [lifeStageId]: section };
            const nextByOrder = { ...(t.sortOrderByLifeStage ?? {}), [lifeStageId]: sortOrder };
            return {
              ...t,
              lifeStageIds: nextIds,
              sectionByLifeStage: nextBySection,
              sortOrderByLifeStage: nextByOrder,
            };
          });
        return {
          ...prev,
          sections: {
            helpful: updateInSection(prev.sections.helpful),
            offers: updateInSection(prev.sections.offers),
            wissenswertes: updateInSection(prev.sections.wissenswertes ?? []),
          },
        };
      });
    },
    []
  );

  const reorderTilesForLifeStage = useCallback(
    (_section: SectionKey, lifeStageId: string, orderedTileIds: string[]) => {
      setPageDataState((prev) => {
        const updateInSection = (tiles: Tile[]) =>
          tiles.map((t) => {
            const idx = orderedTileIds.indexOf(t.id);
            if (idx < 0) return t;
            const nextByOrder = { ...(t.sortOrderByLifeStage ?? {}), [lifeStageId]: idx };
            return { ...t, sortOrderByLifeStage: nextByOrder };
          });
        return {
          ...prev,
          sections: {
            helpful: updateInSection(prev.sections.helpful),
            offers: updateInSection(prev.sections.offers),
            wissenswertes: updateInSection(prev.sections.wissenswertes ?? []),
          },
        };
      });
    },
    []
  );

  const setPageData = useCallback((data: PageData) => {
    setPageDataState(data);
    const allTiles = [
      ...data.sections.helpful,
      ...data.sections.offers,
      ...(data.sections.wissenswertes ?? []),
    ];
    const initiallyExpanded = allTiles.find((t) => t.initiallyExpanded);
    setExpandedTileId(initiallyExpanded?.id ?? null);
    const sorted = [...(data.lifeStages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    setSelectedLifeStageId((current) => {
      if (sorted.length === 0) return null;
      if (current && sorted.some((s) => s.id === current)) return current;
      return sorted[0].id;
    });
  }, []);

  const addLifeStage = useCallback((stage: Omit<LifeStage, 'id'>): LifeStage => {
    const newStage: LifeStage = { ...stage, id: generateLifeStageId() };
    setPageDataState((prev) => ({
      ...prev,
      lifeStages: [...(prev.lifeStages ?? []), newStage].sort((a, b) => a.sortOrder - b.sortOrder),
    }));
    return newStage;
  }, []);

  const updateLifeStage = useCallback((id: string, updates: Partial<LifeStage>) => {
    setPageDataState((prev) => ({
      ...prev,
      lifeStages: (prev.lifeStages ?? []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteLifeStage = useCallback((id: string) => {
    setPageDataState((prev) => ({
      ...prev,
      lifeStages: (prev.lifeStages ?? []).filter((s) => s.id !== id),
    }));
  }, []);

  const reorderLifeStages = useCallback((draggedId: string, targetId: string | 'end') => {
    setPageDataState((prev) => {
      const stages = [...(prev.lifeStages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
      const dragIdx = stages.findIndex((s) => s.id === draggedId);
      const targetIdx = targetId === 'end' ? stages.length : stages.findIndex((s) => s.id === targetId);
      if (dragIdx < 0 || (targetId !== 'end' && targetIdx < 0)) return prev;
      const [removed] = stages.splice(dragIdx, 1);
      const insertIdx = targetId === 'end' ? stages.length : targetIdx > dragIdx ? targetIdx - 1 : targetIdx;
      stages.splice(insertIdx, 0, removed);
      const withOrder = stages.map((s, idx) => ({ ...s, sortOrder: idx }));
      return { ...prev, lifeStages: withOrder };
    });
  }, []);

  const value: PageStoreValue = {
    pageData,
    expandedTileId,
    selectedLifeStageId,
    setExpandedTileId,
    setSelectedLifeStageId,
    updatePageTitle,
    addTile,
    updateTile,
    deleteTile,
    reorderTiles,
    moveTileToSection,
    updateTileAssignmentForLifeStage,
    addTileToSectionForLifeStage,
    reorderTilesForLifeStage,
    addLifeStage,
    updateLifeStage,
    deleteLifeStage,
    reorderLifeStages,
    setPageData,
  };

  return <PageStoreContext.Provider value={value}>{children}</PageStoreContext.Provider>;
}

export function usePageStore(): PageStoreValue {
  const ctx = useContext(PageStoreContext);
  if (!ctx) throw new Error('usePageStore must be used within PageStoreProvider');
  return ctx;
}
