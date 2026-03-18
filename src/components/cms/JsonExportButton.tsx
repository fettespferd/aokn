import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { exportToJson } from '../../utils/jsonStorage';
import type { PageData } from '../../types/page';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface JsonExportButtonProps {
  pageData: PageData;
}

export function JsonExportButton({ pageData }: JsonExportButtonProps) {
  const [open, setOpen] = useState(false);
  const snackbar = useSnackbar();
  const json = exportToJson(pageData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      snackbar.showSuccess('JSON in Zwischenablage kopiert');
    } catch {
      snackbar.showError('Kopieren fehlgeschlagen');
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={() => setOpen(true)}
        size="small"
      >
        JSON exportieren
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>JSON exportieren</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            value={json}
            InputProps={{ readOnly: true }}
            minRows={16}
            maxRows={24}
            sx={{
              fontFamily: 'monospace',
              fontSize: 13,
              '& .MuiInputBase-input': { fontFamily: 'monospace' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Schließen</Button>
          <Button variant="contained" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
            Kopieren
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
