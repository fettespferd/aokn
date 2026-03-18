import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import type { LifeStage, LifeStageType } from '../../types/page';

interface LifeStageListProps {
  lifeStages: LifeStage[];
  onAdd: (stage: Omit<LifeStage, 'id'>) => LifeStage;
  onUpdate: (id: string, updates: Partial<LifeStage>) => void;
  onDelete: (id: string) => void;
}

export function LifeStageList({ lifeStages, onAdd, onUpdate, onDelete }: LifeStageListProps) {
  const [editing, setEditing] = useState<LifeStage | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [formLabel, setFormLabel] = useState('');
  const [formType, setFormType] = useState<LifeStageType>('months');
  const [formFrom, setFormFrom] = useState(0);
  const [formTo, setFormTo] = useState(3);

  const sorted = [...lifeStages].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSaveEdit = () => {
    if (!editing) return;
    onUpdate(editing.id, { label: formLabel, type: formType, from: formFrom, to: formTo });
    setEditing(null);
  };

  const handleAdd = () => {
    const maxOrder = sorted.length > 0 ? Math.max(...sorted.map((s) => s.sortOrder)) : -1;
    onAdd({ label: formLabel, type: formType, from: formFrom, to: formTo, sortOrder: maxOrder + 1 });
    setFormLabel('');
    setFormType('months');
    setFormFrom(0);
    setFormTo(3);
    setAddOpen(false);
  };

  const openEdit = (stage: LifeStage) => {
    setEditing(stage);
    setFormLabel(stage.label);
    setFormType(stage.type);
    setFormFrom(stage.from);
    setFormTo(stage.to);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 600 }}>
          Lebensbereiche (Kindergesundheit)
        </Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          variant="outlined"
        >
          Zeitraum hinzufügen
        </Button>
      </Box>
      <List dense disablePadding>
        {sorted.map((stage) => (
          <ListItem
            key={stage.id}
            secondaryAction={
              <>
                <IconButton size="small" onClick={() => openEdit(stage)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(stage.id)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            }
          >
            <DragIndicatorIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
            <ListItemText
              primary={stage.label}
              secondary={`${stage.type === 'months' ? 'Monate' : 'Jahre'} ${stage.from}–${stage.to}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Zeitraum bearbeiten</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Bezeichnung"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              fullWidth
              size="small"
              placeholder="z.B. 10.-12. Lebensmonat"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Typ</InputLabel>
              <Select
                value={formType}
                label="Typ"
                onChange={(e) => setFormType(e.target.value as LifeStageType)}
              >
                <MenuItem value="months">Lebensmonate</MenuItem>
                <MenuItem value="years">Lebensjahr</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Von"
                type="number"
                value={formFrom}
                onChange={(e) => setFormFrom(Number(e.target.value))}
                size="small"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Bis"
                type="number"
                value={formTo}
                onChange={(e) => setFormTo(Number(e.target.value))}
                size="small"
                inputProps={{ min: 0 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Zeitraum hinzufügen</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Bezeichnung"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              fullWidth
              size="small"
              placeholder="z.B. 10.-12. Lebensmonat"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Typ</InputLabel>
              <Select
                value={formType}
                label="Typ"
                onChange={(e) => setFormType(e.target.value as LifeStageType)}
              >
                <MenuItem value="months">Lebensmonate</MenuItem>
                <MenuItem value="years">Lebensjahr</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Von"
                type="number"
                value={formFrom}
                onChange={(e) => setFormFrom(Number(e.target.value))}
                size="small"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Bis"
                type="number"
                value={formTo}
                onChange={(e) => setFormTo(Number(e.target.value))}
                size="small"
                inputProps={{ min: 0 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!formLabel.trim()}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
