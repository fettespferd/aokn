import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
} from '@mui/material';
import { IconSelect } from './IconSelect';
import type { Tile, LifeStage } from '../../types/page';

interface TileEditorProps {
  tile: Tile | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Tile>) => void;
  lifeStages: LifeStage[];
}

export function TileEditor({ tile, open, onClose, onSave, lifeStages }: TileEditorProps) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('FileText');
  const [expandedTitle, setExpandedTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [buttonText, setButtonText] = useState('');
  const [buttonActionType, setButtonActionType] = useState<'link' | 'deeplink' | 'none'>('link');
  const [buttonTarget, setButtonTarget] = useState('');
  const [shareEnabled, setShareEnabled] = useState(false);
  const [initiallyExpanded, setInitiallyExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lifeStageIds, setLifeStageIds] = useState<string[]>([]);

  useEffect(() => {
    if (tile) {
      setTitle(tile.title);
      setIcon(tile.icon);
      setExpandedTitle(tile.expandedTitle ?? '');
      setDescription(tile.description ?? '');
      setButtonEnabled(tile.buttonEnabled);
      setButtonText(tile.buttonText ?? '');
      setButtonActionType(tile.buttonActionType ?? 'link');
      setButtonTarget(tile.buttonTarget ?? '');
      setShareEnabled(tile.shareEnabled ?? false);
      setInitiallyExpanded(tile.initiallyExpanded ?? false);
      setIsVisible(tile.isVisible);
      setLifeStageIds(tile.lifeStageIds ?? []);
    }
  }, [tile]);

  const handleSave = () => {
    if (!tile) return;
    onSave(tile.id, {
      title,
      icon,
      expandedTitle: expandedTitle || undefined,
      description: description || undefined,
      buttonEnabled,
      buttonText: buttonText || undefined,
      buttonActionType,
      buttonTarget: buttonTarget || undefined,
      shareEnabled,
      initiallyExpanded,
      isVisible,
      lifeStageIds: lifeStageIds.length > 0 ? lifeStageIds : undefined,
    });
    onClose();
  };

  if (!tile) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Kachel bearbeiten</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="small"
          />
          <IconSelect value={icon} onChange={setIcon} />
          <TextField
            label="Längerer Titel (aufgeklappt)"
            value={expandedTitle}
            onChange={(e) => setExpandedTitle(e.target.value)}
            fullWidth
            size="small"
            placeholder="z.B. Warum ist ein Rückbildungskurs sinnvoll?"
          />
          <TextField
            label="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={4}
          />
          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <FormControlLabel
              control={<Switch checked={buttonEnabled} onChange={(e) => setButtonEnabled(e.target.checked)} />}
              label="Button anzeigen"
            />
            {buttonEnabled && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Button-Text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Button-Aktion</InputLabel>
                  <Select
                    value={buttonActionType}
                    label="Button-Aktion"
                    onChange={(e) => setButtonActionType(e.target.value as 'link' | 'deeplink' | 'none')}
                  >
                    <MenuItem value="link">Link</MenuItem>
                    <MenuItem value="deeplink">Deeplink</MenuItem>
                    <MenuItem value="none">Keine</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Button-Ziel (URL oder Deeplink)"
                  value={buttonTarget}
                  onChange={(e) => setButtonTarget(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>
            )}
          </Box>
          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <FormControlLabel
              control={<Switch checked={shareEnabled} onChange={(e) => setShareEnabled(e.target.checked)} />}
              label="Share-Icon anzeigen"
            />
            <FormControlLabel
              control={<Switch checked={initiallyExpanded} onChange={(e) => setInitiallyExpanded(e.target.checked)} />}
              label="Initial aufgeklappt"
              sx={{ display: 'block', mt: 1 }}
            />
            <FormControlLabel
              control={<Switch checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />}
              label="Sichtbar in Vorschau"
              sx={{ display: 'block', mt: 1 }}
            />
          </Box>
          {lifeStages.length > 0 && (
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Lebensbereiche (leer = alle)</InputLabel>
                <Select
                  multiple
                  value={lifeStageIds}
                  label="Lebensbereiche (leer = alle)"
                  onChange={(e) => setLifeStageIds(e.target.value as string[])}
                  renderValue={(selected) =>
                    selected.length === 0 ? 'Alle Lebensbereiche' : selected.length + ' ausgewählt'
                  }
                >
                  {[...lifeStages].sort((a, b) => a.sortOrder - b.sortOrder).map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box component="p" sx={{ m: 0, mt: 1, fontSize: 12, color: 'text.secondary' }}>
                In welchen Zeiträumen die Kachel sichtbar ist. Zuordnung und Reihenfolge im Bereich unten.
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={handleSave}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
