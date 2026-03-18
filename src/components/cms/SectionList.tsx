import { useState, useCallback, useEffect } from 'react';
import { List, Box } from '@mui/material';
import { TileListItem } from './TileListItem';
import { TileEditor } from './TileEditor';
import type { Tile, SectionKey } from '../../types/page';

interface SectionListProps {
  section: SectionKey;
  tiles: Tile[];
  lifeStages: import('../../types/page').LifeStage[];
  selectedLifeStageId: string | null;
  onAddTile: (section: SectionKey) => Tile;
  onUpdateTile: (id: string, updates: Partial<Tile>) => void;
  onDeleteTile: (id: string) => void;
  onReorderTiles: (section: SectionKey, draggedId: string, targetId: string | 'end') => void;
}

export function SectionList({
  section,
  tiles,
  lifeStages,
  selectedLifeStageId,
  onAddTile,
  onUpdateTile,
  onDeleteTile,
  onReorderTiles,
}: SectionListProps) {
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [dragOverId, setDragOverId] = useState<string | 'end' | null>(null);

  const sortedTiles = [...tiles].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDragStart = useCallback(
    (e: React.DragEvent, tileId: string) => {
      document.body.classList.add('tile-drag-active');
      e.dataTransfer.setData('text/plain', tileId);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string | 'end') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(targetId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string | 'end') => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId && draggedId !== targetId) {
        onReorderTiles(section, draggedId, targetId);
      }
      setDragOverId(null);
      document.body.classList.remove('tile-drag-active');
    },
    [section, onReorderTiles]
  );

  useEffect(() => {
    const onDragEnd = () => document.body.classList.remove('tile-drag-active');
    document.addEventListener('dragend', onDragEnd);
    return () => document.removeEventListener('dragend', onDragEnd);
  }, []);

  const sectionTitle =
    section === 'helpful'
      ? 'Aktuell für Sie hilfreich'
      : section === 'wissenswertes'
        ? 'Wissenswertes'
        : 'Weitere Angebote';

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 600 }}>
          {sectionTitle}
        </Box>
        <Box
          component="button"
          onClick={() => {
            const newTile = onAddTile(section);
            setEditingTile(newTile);
          }}
          sx={{
            px: 2,
            py: 1,
            fontSize: 14,
            fontWeight: 500,
            color: 'primary.main',
            bgcolor: 'action.hover',
            border: 'none',
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.selected' },
          }}
        >
          Kachel hinzufügen
        </Box>
      </Box>
      <List dense disablePadding>
        {sortedTiles.map((tile) => (
          <Box key={tile.id}>
            <Box
              className={`tile-drop-zone${dragOverId === tile.id ? ' is-drop-target' : ''}`}
              sx={{
                height: 6,
                minHeight: 6,
                mx: 1,
                borderRadius: 1,
                bgcolor: dragOverId === tile.id ? 'primary.main' : 'grey.500',
                flexShrink: 0,
              }}
              onDragOver={(e) => handleDragOver(e, tile.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tile.id)}
            />
            <TileListItem
              tile={tile}
              lifeStages={lifeStages}
              selectedLifeStageId={selectedLifeStageId}
              onEdit={() => setEditingTile(tile)}
              onDelete={() => onDeleteTile(tile.id)}
              onDragStart={(e) => handleDragStart(e, tile.id)}
            />
          </Box>
        ))}
        <Box
          className={`tile-drop-zone${dragOverId === 'end' ? ' is-drop-target' : ''}`}
          sx={{
            height: 6,
            minHeight: 6,
            mx: 1,
            borderRadius: 1,
            bgcolor: dragOverId === 'end' ? 'primary.main' : 'grey.500',
          }}
          onDragOver={(e) => handleDragOver(e, 'end')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'end')}
        />
      </List>
      <TileEditor
        tile={editingTile}
        open={!!editingTile}
        onClose={() => setEditingTile(null)}
        onSave={onUpdateTile}
        lifeStages={lifeStages}
      />
    </Box>
  );
}
