import React, { useContext, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UserDisplay from './components/UserDisplay';
import jobTrackerIcon from './assets/job-tracker.png';

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
  const { user, logout } = useContext(AuthContext);

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  const raw = user?.email?.split('@')[0] ?? '';
  const username = raw.split('_')[0];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar sx={{ paddingRight: '0 !important' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-end', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h6">
                JobTracker
              </Typography>
            </Box>
            <Box sx={{ height: '32px', borderRadius: '32px', overflow: 'hidden' }}>
              <img
                src={jobTrackerIcon}
                alt="JT"
                width={32}

              />
            </Box>
          </Box>

          {user && <UserDisplay username={username} sx={{ mr: 2 }} />}

          <Button
            color="primary"
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              borderRadius: 10,
              justifyContent: 'flex-end',
              padding: "6px 12px",
            }}
          >
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
