import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { CmsPanel } from './components/cms/CmsPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
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
    fontFamily: '"Source Sans 3", "Inter", system-ui, sans-serif',
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
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6" component="span" fontWeight={600}>
                Schwangerschafts-App CMS
              </Typography>
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
      </SnackbarProvider>
    </ThemeProvider>
  );
}
