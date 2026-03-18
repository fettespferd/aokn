import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { validateAndParsePageData } from '../../utils/jsonStorage';
import type { PageData } from '../../types/page';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface JsonImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: PageData) => void;
}

export function JsonImportModal({ open, onClose, onImport }: JsonImportModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const snackbar = useSnackbar();

  const handleImport = () => {
    setError(null);
    const data = validateAndParsePageData(value);
    if (data) {
      onImport(data);
      setValue('');
      onClose();
      snackbar.showSuccess('JSON erfolgreich importiert');
    } else {
      setError('Ungültiges JSON oder fehlerhafte Struktur. Bitte prüfen Sie das Format.');
    }
  };

  const handleClose = () => {
    setValue('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>JSON importieren</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          multiline
          fullWidth
          placeholder='{"pageId": "pregnancy", "pageTitle": "Schwangerschaft", "sections": {...}}'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          minRows={12}
          maxRows={20}
          sx={{
            fontFamily: 'monospace',
            fontSize: 13,
            '& .MuiInputBase-input': { fontFamily: 'monospace' },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button variant="contained" startIcon={<UploadFileIcon />} onClick={handleImport}>
          Importieren
        </Button>
      </DialogActions>
    </Dialog>
  );
}
