import { useLayoutEffect, useRef } from 'react';
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
import {
  DEFAULT_TILE_COLOR_PRESET_ID,
  TILE_COLOR_PRESETS,
  type TileColorPresetId,
} from '../../constants/tileColorPresets';
import type { Tile, LifeStage } from '../../types/page';

interface TileEditorProps {
  tile: Tile | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Tile>) => void;
  lifeStages: LifeStage[];
}

/** Felder, die der Editor steuert — für Abbrechen-Rücksetzen */
function patchFromTile(t: Tile): Partial<Tile> {
  return {
    title: t.title,
    icon: t.icon,
    tileColorPreset: t.tileColorPreset,
    expandedTitle: t.expandedTitle,
    description: t.description,
    buttonEnabled: t.buttonEnabled,
    buttonText: t.buttonText,
    buttonActionType: t.buttonActionType,
    buttonTarget: t.buttonTarget,
    shareEnabled: t.shareEnabled,
    initiallyExpanded: t.initiallyExpanded,
    isVisible: t.isVisible,
    lifeStageIds: t.lifeStageIds,
  };
}

export function TileEditor({ tile, open, onClose, onSave, lifeStages }: TileEditorProps) {
  const snapshotRef = useRef<Tile | null>(null);

  useLayoutEffect(() => {
    if (open && tile) {
      snapshotRef.current = structuredClone(tile);
    }
  }, [open, tile?.id]);

  const handleCancel = () => {
    if (tile && snapshotRef.current) {
      onSave(tile.id, patchFromTile(snapshotRef.current));
    }
    onClose();
  };

  const handleDone = () => {
    onClose();
  };

  if (!tile) return null;

  const update = (updates: Partial<Tile>) => {
    onSave(tile.id, updates);
  };

  return (
    <Dialog open={open} onClose={handleDone} maxWidth="sm" fullWidth>
      <DialogTitle>Kachel bearbeiten</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Titel"
            value={tile.title}
            onChange={(e) => update({ title: e.target.value })}
            fullWidth
            size="small"
          />
          <IconSelect value={tile.icon} onChange={(icon) => update({ icon })} />
          <FormControl fullWidth size="small">
            <InputLabel>Kachelfarbe (Vorschau)</InputLabel>
            <Select
              value={tile.tileColorPreset ?? DEFAULT_TILE_COLOR_PRESET_ID}
              label="Kachelfarbe (Vorschau)"
              onChange={(e) => {
                const v = e.target.value as TileColorPresetId;
                update({
                  tileColorPreset: v === DEFAULT_TILE_COLOR_PRESET_ID ? undefined : v,
                });
              }}
              renderValue={(selected) => {
                const preset = TILE_COLOR_PRESETS.find((p) => p.id === selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: 1,
                        bgcolor: preset?.color ?? '#3d4d3e',
                        border: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    />
                    {preset?.label ?? selected}
                  </Box>
                );
              }}
            >
              {TILE_COLOR_PRESETS.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: 1,
                        bgcolor: p.color,
                        border: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    />
                    {p.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box component="p" sx={{ m: 0, fontSize: 12, color: 'text.secondary' }}>
            Ohne Auswahl gilt einheitlich das AOK-Grün; andere Töne nur bei Bedarf pro Kachel.
          </Box>
          <TextField
            label="Längerer Titel (aufgeklappt)"
            value={tile.expandedTitle ?? ''}
            onChange={(e) => update({ expandedTitle: e.target.value || undefined })}
            fullWidth
            size="small"
            placeholder="z.B. Warum ist ein Rückbildungskurs sinnvoll?"
          />
          <TextField
            label="Beschreibung"
            value={tile.description ?? ''}
            onChange={(e) => update({ description: e.target.value || undefined })}
            fullWidth
            size="small"
            multiline
            rows={4}
          />
          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={tile.buttonEnabled}
                  onChange={(e) => update({ buttonEnabled: e.target.checked })}
                />
              }
              label="Button anzeigen"
            />
            {tile.buttonEnabled && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Button-Text"
                  value={tile.buttonText ?? ''}
                  onChange={(e) => update({ buttonText: e.target.value || undefined })}
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Button-Aktion</InputLabel>
                  <Select
                    value={tile.buttonActionType ?? 'link'}
                    label="Button-Aktion"
                    onChange={(e) =>
                      update({ buttonActionType: e.target.value as 'link' | 'deeplink' | 'none' })
                    }
                  >
                    <MenuItem value="link">Link</MenuItem>
                    <MenuItem value="deeplink">Deeplink</MenuItem>
                    <MenuItem value="none">Keine</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Button-Ziel (URL oder Deeplink)"
                  value={tile.buttonTarget ?? ''}
                  onChange={(e) => update({ buttonTarget: e.target.value || undefined })}
                  fullWidth
                  size="small"
                />
              </Stack>
            )}
          </Box>
          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={tile.shareEnabled ?? false}
                  onChange={(e) => update({ shareEnabled: e.target.checked })}
                />
              }
              label="Share-Icon anzeigen"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={tile.initiallyExpanded ?? false}
                  onChange={(e) => update({ initiallyExpanded: e.target.checked })}
                />
              }
              label="Initial aufgeklappt"
              sx={{ display: 'block', mt: 1 }}
            />
            <FormControlLabel
              control={
                <Switch checked={tile.isVisible} onChange={(e) => update({ isVisible: e.target.checked })} />
              }
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
                  value={tile.lifeStageIds ?? []}
                  label="Lebensbereiche (leer = alle)"
                  onChange={(e) => {
                    const next = e.target.value as string[];
                    update({ lifeStageIds: next.length > 0 ? next : undefined });
                  }}
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
        <Button onClick={handleCancel}>Abbrechen</Button>
        <Button variant="contained" onClick={handleDone}>
          Fertig
        </Button>
      </DialogActions>
    </Dialog>
  );
}
