import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  Button,
} from '@mui/material';
import { CmsPanel } from './components/cms/CmsPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { CmsLoginGate, setCmsSessionActive } from './components/auth/CmsLoginGate';
import { PageStoreProvider } from './contexts/PageStoreContext';
import { SnackbarProvider } from './contexts/SnackbarContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8cc63f' },
    secondary: { main: '#1e3a32' },
    background: { default: '#0d1f1a', paper: '#152a24' },
    text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.7)' },
  },
  typography: {
    fontFamily: '"AOK Buenos Aires Text", "Source Sans 3", "Inter", system-ui, sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

export default function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CmsLoginGate>
        <PageStoreProvider>
          <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar sx={{ gap: 2 }}>
              <Typography variant="h6" component="span" fontWeight={600} sx={{ flex: 1 }}>
                Kindergesundheit-APP CMS
              </Typography>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setCmsSessionActive(false);
                  window.location.reload();
                }}
              >
                Abmelden
              </Button>
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: isMobile ? 'none' : '0 0 420px',
                minWidth: isMobile ? undefined : 380,
                maxWidth: isMobile ? undefined : 420,
                p: 3,
                overflow: 'auto',
                borderRight: isMobile ? 'none' : '1px solid',
                borderColor: 'divider',
              }}
            >
              <CmsPanel />
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: isMobile ? 2 : 3,
              }}
            >
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
        </PageStoreProvider>
        </CmsLoginGate>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
