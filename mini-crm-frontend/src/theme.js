import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e3a5f' },
    secondary: { main: '#3d7ea6' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { overflowX: 'hidden' },
        body: { overflowX: 'hidden', margin: 0 },
        '#root': { minHeight: '100vh' },
      },
    },
    MuiDialog: {
      defaultProps: { fullWidth: true },
    },
  },
});

export default theme;
