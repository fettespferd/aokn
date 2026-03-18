import { useState, useCallback } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { getIconComponent } from '../../utils/iconMap';
import { getTilesForAssignment } from '../../utils/previewTiles';
import type { Tile, SectionKey } from '../../types/page';

const SECTION_LABELS: Record<SectionKey, string> = {
  helpful: 'Aktuell für Sie hilfreich',
  offers: 'Weitere Angebote',
  wissenswertes: 'Wissenswertes',
};

interface AssignmentBoardProps {
  pageData: import('../../types/page').PageData;
  assignmentLifeStageId: string | null;
  onAssignmentLifeStageChange: (id: string | null) => void;
  onMoveTile: (tileId: string, targetSection: SectionKey, targetIndex: number) => void;
  onReorderInSection: (section: SectionKey, draggedId: string, targetId: string | 'end') => void;
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
}

export function AssignmentBoard({
  pageData,
  assignmentLifeStageId,
  onAssignmentLifeStageChange,
  onMoveTile,
  onReorderInSection,
  onReorderForLifeStage,
  onUpdateAssignmentForLifeStage,
  onAddTileToSectionForLifeStage,
}: AssignmentBoardProps) {
  const [dragOver, setDragOver] = useState<{ section: SectionKey; index: number } | null>(null);
  const [draggedTile, setDraggedTile] = useState<{ tile: Tile; section: SectionKey } | null>(null);

  const tilesBySection = getTilesForAssignment(pageData, assignmentLifeStageId);
  const lifeStages = pageData.lifeStages ?? [];
  const sortedStages = [...lifeStages].sort((a, b) => a.sortOrder - b.sortOrder);

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
      if (!tileId) return;

      const fromPool = dragSource === 'content-pool';

      if (fromPool) {
        if (assignmentLifeStageId) {
          onAddTileToSectionForLifeStage(tileId, assignmentLifeStageId, targetSection, targetIndex);
        } else {
          onMoveTile(tileId, targetSection, targetIndex);
        }
      } else if (draggedTile) {
        const sourceSection = draggedTile.section;

        if (assignmentLifeStageId) {
          if (sourceSection === targetSection) {
            const tiles = tilesBySection[targetSection];
            const fromIdx = tiles.findIndex((t) => t.id === tileId);
            if (fromIdx < 0) return;
            const reordered = [...tiles];
            const [removed] = reordered.splice(fromIdx, 1);
            reordered.splice(targetIndex, 0, removed);
            onReorderForLifeStage(targetSection, assignmentLifeStageId, reordered.map((t) => t.id));
          } else {
            onUpdateAssignmentForLifeStage(tileId, assignmentLifeStageId, {
              section: targetSection,
              sortOrder: targetIndex,
            });
          }
        } else {
          if (sourceSection === targetSection) {
            const tiles = tilesBySection[targetSection];
            const targetTile = tiles[targetIndex];
            onReorderInSection(
              targetSection,
              tileId,
              targetTile ? targetTile.id : 'end'
            );
          } else {
            onMoveTile(tileId, targetSection, targetIndex);
          }
        }
      }

      handleDragEnd();
    },
    [
      draggedTile,
      assignmentLifeStageId,
      tilesBySection,
      onMoveTile,
      onReorderInSection,
      onReorderForLifeStage,
      onUpdateAssignmentForLifeStage,
      onAddTileToSectionForLifeStage,
      handleDragEnd,
    ]
  );

  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Zuordnung für Zeitraum</InputLabel>
          <Select
            value={assignmentLifeStageId ?? '__standard__'}
            label="Zuordnung für Zeitraum"
            onChange={(e) => {
              const v = e.target.value;
              onAssignmentLifeStageChange(v === '__standard__' ? null : v);
            }}
          >
            <MenuItem value="__standard__">Standard (alle)</MenuItem>
            {sortedStages.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ziehe Kacheln zwischen den Bereichen oder zum Sortieren
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(['helpful', 'offers', 'wissenswertes'] as const).map((sectionKey) => (
          <Box
            key={sectionKey}
            sx={{
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
                    }}
                    onDragOver={(e) => handleDragOver(e, sectionKey, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, sectionKey, idx)}
                  />
                  <Box
                    draggable
                    onDragStart={(e) => handleDragStart(e, tile, sectionKey)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1,
                      px: 1.5,
                      borderRadius: 1,
                      bgcolor: draggedTile?.tile.id === tile.id ? 'action.selected' : 'background.paper',
                      cursor: 'grab',
                      opacity: draggedTile?.tile.id === tile.id ? 0.6 : 1,
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    {(() => {
                      const Icon = getIconComponent(tile.icon);
                      return <Icon size={18} strokeWidth={2} />;
                    })()}
                    <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1 }}>
                      {tile.title || 'Ohne Titel'}
                    </Typography>
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
