import React, { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    try {
      return t ? jwtDecode(t) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, pass) => {
    const { data } = await api.post("/login", { email, password: pass });
    localStorage.setItem("token", data.token);
    setUser(jwtDecode(data.token));
  };

  const register = async (email, pass) => {
    const { data } = await api.post("/register", { email, password: pass });
    localStorage.setItem("token", data.token);
    setUser(jwtDecode(data.token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
