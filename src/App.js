import React, { useContext, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { AuthProvider, AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

import {
  CustomThemeProvider,
  CustomThemeContext
} from './components/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';

import { lightTheme, darkTheme } from './components/CreateTheme';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout() {
  const { mode } = useContext(CustomThemeContext);
  const { logout } = useContext(AuthContext);

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            JobTrackr
          </Typography>

          <Button
            color="primary"
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              textTransform: 'none',
              mr: 1
            }}
          >
            Logout
          </Button>

          <ThemeToggleButton />
        </Toolbar>
      </AppBar>

      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home mode={mode} />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </CustomThemeProvider>
  );
}
