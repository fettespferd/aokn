import { useState, useCallback, type FormEvent, type ReactNode } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

const AUTH_STORAGE_KEY = 'aokn-cms-auth';

const CMS_USERNAME = 'AOKN';
const CMS_PASSWORD = 'CMSIstSuper2026!';

function isSessionValid(): boolean {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setCmsSessionActive(active: boolean): void {
  try {
    if (active) sessionStorage.setItem(AUTH_STORAGE_KEY, '1');
    else sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

interface CmsLoginGateProps {
  children: ReactNode;
}

export function CmsLoginGate({ children }: CmsLoginGateProps) {
  const [authed, setAuthed] = useState(isSessionValid);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      if (username === CMS_USERNAME && password === CMS_PASSWORD) {
        setCmsSessionActive(true);
        setAuthed(true);
        setPassword('');
      } else {
        setError('Benutzername oder Passwort ist ungültig.');
      }
    },
    [username, password]
  );

  if (authed) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 440,
          width: '100%',
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h1" fontWeight={600} gutterBottom>
          Kindergesundheit-APP CMS
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          Anmeldung
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Bitte Zugangsdaten eingeben.
        </Typography>
        <Alert severity="info" sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" component="p" fontWeight={700} sx={{ mb: 0.5 }}>
            Nur auf diesem Gerät gespeichert
          </Typography>
          <Typography variant="body2" component="div" sx={{ lineHeight: 1.5 }}>
            Alle Texte, die Reihenfolge der Kacheln und sonstige Inhalte werden ausschließlich{' '}
            <strong>lokal in Ihrem Browser</strong> abgelegt. Es gibt{' '}
            <strong>keine Cloud</strong> und <strong>keine zentrale Datenbank</strong> — niemand
            synchronisiert Ihre Daten automatisch mit dem Internet.
          </Typography>
        </Alert>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Benutzername"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Passwort"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            size="small"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Anmelden
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
