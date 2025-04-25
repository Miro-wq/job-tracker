import { createTheme, lighten } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#161616',
      card: '#2a2a2e',
    },

  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          '--Paper-overlay': 'none !important',
          backgroundColor: '#2a2a2e',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#7676d0',
          '&:hover': {
            backgroundColor: lighten('#7676d0', 0.2),
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8fafc',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#0f1729',
          '&:hover': {
            backgroundColor: lighten('#0f1729', 0.2),
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#050b16'
        },
      },
    },
  },
});

export default darkTheme;