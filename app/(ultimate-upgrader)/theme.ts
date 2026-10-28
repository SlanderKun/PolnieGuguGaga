import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#38bdf8' },
    secondary: { main: '#22c55e' },
    warning: { main: '#ffd84d' },
    background: { default: '#0b0e14', paper: '#121828' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, Arial, sans-serif',
    h4: { fontWeight: 900, letterSpacing: '-0.02em' },
    h6: { fontWeight: 800 },
    button: { fontWeight: 800, textTransform: 'none' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default theme;
