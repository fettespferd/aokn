import { ListItem, ListItemButton, ListItemText, IconButton, Box, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { getIconComponent } from '../../utils/iconMap';
import type { Tile, LifeStage } from '../../types/page';

interface TileListItemProps {
  tile: Tile;
  lifeStages: LifeStage[];
  selectedLifeStageId: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

function getLifeStageLabel(tile: Tile, lifeStages: LifeStage[]): string {
  const ids = tile.lifeStageIds;
  if (!ids || ids.length === 0) return 'Alle Zeiträume';
  const sorted = [...lifeStages].sort((a, b) => a.sortOrder - b.sortOrder);
  const labels = ids
    .map((id) => sorted.find((s) => s.id === id)?.label)
    .filter(Boolean) as string[];
  if (labels.length <= 2) return labels.join(', ');
  return `${labels.length} Zeiträume`;
}

function isVisibleInSelectedStage(tile: Tile, selectedLifeStageId: string | null): boolean {
  if (!selectedLifeStageId) return true;
  const ids = tile.lifeStageIds;
  if (!ids || ids.length === 0) return true;
  return ids.includes(selectedLifeStageId);
}

export function TileListItem({
  tile,
  lifeStages,
  selectedLifeStageId,
  onEdit,
  onDelete,
  onDragStart,
}: TileListItemProps) {
  const Icon = getIconComponent(tile.icon);
  const label = getLifeStageLabel(tile, lifeStages);
  const visibleInPreview = isVisibleInSelectedStage(tile, selectedLifeStageId);

  return (
    <ListItem
      disablePadding
      sx={{
        alignItems: 'center',
        opacity: tile.isVisible ? 1 : 0.5,
      }}
    >
      <Box
        draggable
        onDragStart={onDragStart}
        sx={{
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0.5,
          borderRadius: 1,
          mr: 1,
          color: 'primary.main',
          bgcolor: 'action.hover',
          '&:hover': { bgcolor: 'action.selected' },
          '&:active': { cursor: 'grabbing' },
        }}
        title="Ziehen zum Sortieren"
      >
        <DragIndicatorIcon sx={{ fontSize: 22 }} />
      </Box>
      <ListItemButton onClick={onEdit} sx={{ py: 1.5, gap: 1.5, flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon size={20} strokeWidth={2} style={{ flexShrink: 0 }} />
          <ListItemText
            primary={tile.title}
            secondary={!tile.isVisible ? 'Ausgeblendet' : undefined}
            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
          <Chip
            label={label}
            size="small"
            variant={visibleInPreview ? 'filled' : 'outlined'}
            color={visibleInPreview ? 'success' : 'default'}
            sx={{ fontSize: 11, height: 22 }}
          />
        </Box>
      </ListItemButton>
      <IconButton size="small" onClick={onDelete} color="error" title="Löschen">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItem>
  );
}
