import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Register from "./pages/Register";
import Login    from "./pages/Login";
import Home     from "./pages/Home";

const theme = createTheme();

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login"    element={<Login/>}/>
            <Route path="/"         element={
              <PrivateRoute><Home/></PrivateRoute>
            }/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

