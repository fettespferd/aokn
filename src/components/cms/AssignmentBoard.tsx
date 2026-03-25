import { useState, useCallback, useSyncExternalStore } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getIconComponent } from '../../utils/iconMap';
import { getTilesForAssignment } from '../../utils/previewTiles';
import type { Tile, SectionKey } from '../../types/page';

const SECTION_LABELS: Record<SectionKey, string> = {
  helpful: 'Aktuell für Sie hilfreich',
  offers: 'Weitere Angebote',
  wissenswertes: 'Wissenswertes',
};

const SECTION_STACK_Z: Record<SectionKey, number> = {
  helpful: 1,
  offers: 2,
  wissenswertes: 3,
};

/** Drop-Zeilen nur bei aktivem Drag – sonst pointer-events: none (verhindert, dass unsichtbare Streifen Klicks abfangen). */
function subscribeBodyDragClass(onStoreChange: () => void) {
  const obs = new MutationObserver(onStoreChange);
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  return () => obs.disconnect();
}

function getBodyDragActiveSnapshot(): boolean {
  return typeof document !== 'undefined' && document.body.classList.contains('tile-drag-active');
}

interface AssignmentBoardProps {
  pageData: import('../../types/page').PageData;
  assignmentLifeStageId: string | null;
  onAssignmentLifeStageChange: (id: string) => void;
  onReorderForLifeStage: (section: SectionKey, lifeStageId: string, orderedTileIds: string[]) => void;
  onUpdateAssignmentForLifeStage: (
    tileId: string,
    lifeStageId: string,
    assignment: { section: SectionKey; sortOrder: number }
  ) => void;
  onAddTileToSectionForLifeStage: (
    tileId: string,
    lifeStageId: string,
    section: SectionKey,
    sortOrder: number
  ) => void;
  /** Kachel vollständig aus dem Projekt entfernen (wie in „Inhalte bearbeiten“) */
  onDeleteTile: (tileId: string) => void;
}

export function AssignmentBoard({
  pageData,
  assignmentLifeStageId,
  onAssignmentLifeStageChange,
  onReorderForLifeStage,
  onUpdateAssignmentForLifeStage,
  onAddTileToSectionForLifeStage,
  onDeleteTile,
}: AssignmentBoardProps) {
  const [dragOver, setDragOver] = useState<{ section: SectionKey; index: number } | null>(null);
  const [draggedTile, setDraggedTile] = useState<{ tile: Tile; section: SectionKey } | null>(null);
  const dragActiveOnBody = useSyncExternalStore(subscribeBodyDragClass, getBodyDragActiveSnapshot, () => false);

  const lifeStages = pageData.lifeStages ?? [];
  const sortedStages = [...lifeStages].sort((a, b) => a.sortOrder - b.sortOrder);
  const activeStageId = assignmentLifeStageId ?? sortedStages[0]?.id ?? null;

  const tilesBySection = getTilesForAssignment(pageData, activeStageId);

  const handleDragStart = useCallback((e: React.DragEvent, tile: Tile, section: SectionKey) => {
    setDraggedTile({ tile, section });
    e.dataTransfer.setData('text/plain', tile.id);
    e.dataTransfer.setData('application/x-drag-source', 'assignment-board');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.currentTarget as HTMLElement, 20, 20);
    document.body.classList.add('tile-drag-active');
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTile(null);
    setDragOver(null);
    document.body.classList.remove('tile-drag-active');
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, section: SectionKey, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOver({ section, index });
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSection: SectionKey, targetIndex: number) => {
      e.preventDefault();
      const tileId = e.dataTransfer.getData('text/plain');
      const dragSource = e.dataTransfer.getData('application/x-drag-source');
      if (!tileId || !activeStageId) return;

      const fromPool = dragSource === 'content-pool';

      if (fromPool) {
        onAddTileToSectionForLifeStage(tileId, activeStageId, targetSection, targetIndex);
      } else if (draggedTile) {
        const sourceSection = draggedTile.section;

        if (sourceSection === targetSection) {
          const tiles = tilesBySection[targetSection];
          const fromIdx = tiles.findIndex((t) => t.id === tileId);
          if (fromIdx < 0) return;
          const reordered = [...tiles];
          const [removed] = reordered.splice(fromIdx, 1);
          reordered.splice(targetIndex, 0, removed);
          onReorderForLifeStage(targetSection, activeStageId, reordered.map((t) => t.id));
        } else {
          onUpdateAssignmentForLifeStage(tileId, activeStageId, {
            section: targetSection,
            sortOrder: targetIndex,
          });
        }
      }

      handleDragEnd();
    },
    [
      draggedTile,
      activeStageId,
      tilesBySection,
      onReorderForLifeStage,
      onUpdateAssignmentForLifeStage,
      onAddTileToSectionForLifeStage,
      handleDragEnd,
    ]
  );

  if (sortedStages.length === 0) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Legen Sie unter „Lebensphasen“ mindestens einen Zeitraum an, um Kacheln zuzuordnen.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Zuordnung für Zeitraum</InputLabel>
          <Select
            value={activeStageId ?? ''}
            label="Zuordnung für Zeitraum"
            onChange={(e) => onAssignmentLifeStageChange(e.target.value)}
          >
            {sortedStages.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ziehe Kacheln zwischen den Bereichen oder zum Sortieren. Mit dem Papierkorb-Symbol entfernst du die
          Kachel vollständig.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(['helpful', 'offers', 'wissenswertes'] as const).map((sectionKey) => (
          <Box
            key={sectionKey}
            sx={{
              position: 'relative',
              zIndex: SECTION_STACK_Z[sectionKey],
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: 'action.hover',
              minHeight: 80,
              p: 1,
            }}
          >
            <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 1, px: 0.5 }}>
              {SECTION_LABELS[sectionKey]}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {tilesBySection[sectionKey].map((tile, idx) => (
                <Box key={tile.id}>
                  <Box
                    sx={{
                      minHeight: 28,
                      my: 0.5,
                      borderRadius: 1,
                      bgcolor: dragOver?.section === sectionKey && dragOver?.index === idx ? 'primary.main' : 'transparent',
                      opacity: dragOver?.section === sectionKey && dragOver?.index === idx ? 0.35 : 0,
                      transition: 'opacity 0.15s',
                      // Unsichtbare Streifen würden sonst trotz opacity: 0 Klicks abfangen; bei Drag wieder aktiv
                      pointerEvents:
                        dragActiveOnBody || (dragOver?.section === sectionKey && dragOver?.index === idx)
                          ? 'auto'
                          : 'none',
                    }}
                    onDragOver={(e) => handleDragOver(e, sectionKey, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, sectionKey, idx)}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 1,
                      bgcolor: draggedTile?.tile.id === tile.id ? 'action.selected' : 'background.paper',
                      opacity: draggedTile?.tile.id === tile.id ? 0.6 : 1,
                      pr: 5,
                      minHeight: 44,
                    }}
                  >
                    <Box
                      draggable
                      onDragStart={(e) => handleDragStart(e, tile, sectionKey)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 1,
                        pl: 1.5,
                        pr: 0,
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                      }}
                    >
                      {(() => {
                        const Icon = getIconComponent(tile.icon);
                        return <Icon size={18} strokeWidth={2} />;
                      })()}
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1, minWidth: 0 }}>
                        {tile.title || 'Ohne Titel'}
                      </Typography>
                    </Box>
                    <IconButton
                      type="button"
                      size="small"
                      aria-label="Kachel löschen"
                      draggable={false}
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTile(tile.id);
                      }}
                      sx={{
                        position: 'absolute',
                        right: 2,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        color: 'text.secondary',
                        pointerEvents: 'auto',
                        '&:hover': { color: 'error.main', bgcolor: 'action.hover' },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Box
                sx={{
                  minHeight: 56,
                  borderRadius: 1,
                  border: dragOver?.section === sectionKey && dragOver?.index === tilesBySection[sectionKey].length
                    ? '2px dashed'
                    : '1px dashed',
                  borderColor: dragOver?.section === sectionKey && dragOver?.index === tilesBySection[sectionKey].length
                    ? 'primary.main'
                    : 'divider',
                  bgcolor:
                    dragOver?.section === sectionKey && dragOver?.index === tilesBySection[sectionKey].length
                      ? 'action.selected'
                      : 'transparent',
                  pointerEvents: dragActiveOnBody ? 'auto' : 'none',
                }}
                onDragOver={(e) => handleDragOver(e, sectionKey, tilesBySection[sectionKey].length)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, sectionKey, tilesBySection[sectionKey].length)}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
