import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getIconComponent } from '../../utils/iconMap';
import { TileEditor } from './TileEditor';
import type { Tile, SectionKey } from '../../types/page';

interface ContentEditorPanelProps {
  tiles: Tile[];
  lifeStages: import('../../types/page').LifeStage[];
  onAddTile: (section: SectionKey) => Tile;
  onUpdateTile: (id: string, updates: Partial<Tile>) => void;
  onDeleteTile: (id: string) => void;
}

export function ContentEditorPanel({
  tiles,
  lifeStages,
  onAddTile,
  onUpdateTile,
  onDeleteTile,
}: ContentEditorPanelProps) {
  const [editingTile, setEditingTile] = useState<Tile | null>(null);

  const sorted = [...tiles].sort((a, b) => {
    const sectionOrder = { helpful: 0, offers: 1, wissenswertes: 2 };
    if (sectionOrder[a.section] !== sectionOrder[b.section]) {
      return sectionOrder[a.section] - sectionOrder[b.section];
    }
    return a.sortOrder - b.sortOrder;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Box component="h3" sx={{ m: 0, fontSize: 15, fontWeight: 600 }}>
            Inhalte bearbeiten
          </Box>
          <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 12, color: 'text.secondary' }}>
            Klick zum Bearbeiten · Ziehen in die Bereiche unten zur Zuordnung
          </Box>
        </Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            const newTile = onAddTile('helpful');
            setEditingTile(newTile);
          }}
        >
          Kachel hinzufügen
        </Button>
      </Box>
      <List dense disablePadding sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
        {sorted.map((tile) => (
          <ListItem
            key={tile.id}
            disablePadding
            secondaryAction={
              <IconButton size="small" onClick={() => onDeleteTile(tile.id)} color="error" edge="end">
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => setEditingTile(tile)}
              sx={{ py: 1.25 }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', tile.id);
                e.dataTransfer.setData('application/x-drag-source', 'content-pool');
                e.dataTransfer.effectAllowed = 'move';
                const ghost = document.createElement('div');
                ghost.textContent = tile.title || 'Ohne Titel';
                ghost.style.cssText =
                  'position:absolute;top:-9999px;padding:8px 12px;background:#152a24;border:1px solid rgba(255,255,255,0.2);border-radius:8px;font-size:13px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 12, 16);
                setTimeout(() => ghost.remove(), 0);
                document.body.classList.add('tile-drag-active');
              }}
              onDragEnd={() => document.body.classList.remove('tile-drag-active')}
              style={{ cursor: 'grab' }}
            >
              {(() => {
                const Icon = getIconComponent(tile.icon);
                return <Icon size={20} strokeWidth={2} style={{ marginRight: 12, flexShrink: 0 }} />;
              })()}
              <ListItemText
                primary={tile.title || 'Ohne Titel'}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
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
