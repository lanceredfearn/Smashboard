import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#22c55e' },
    secondary: { main: '#60a5fa' }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    }
  },
  typography: {
    fontFamily: [
      'Inter','system-ui','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif'
    ].join(','),
  }
});

export default theme;
