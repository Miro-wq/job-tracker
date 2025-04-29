import { createTheme, lighten } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0c0c0c',
      card: '#191919',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          '--Paper-overlay': 'none !important',
          backgroundColor: '#191919',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#9460ff',
          '&:hover': {
            backgroundColor: lighten('#9460ff', 0.2),
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
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#9460ff',
          height: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#9460ff',
            fontWeight: 500,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "&:hover .MuiInputLabel-root": {
            color: "#9460ff",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9460ff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9460ff"
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // color: "#9460ff",
          "&.Mui-focused": {
            color: "#9460ff",       // label când e focusat
          },
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