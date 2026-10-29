// FaceTrack AI — Auth context (frontend-only mode).
//
// Uses the MOCK auth service only — no Firebase, no API, no .env required.
// Login/register/demo-login all resolve against local mock users and persist
// the session in localStorage. Real Firebase auth is paused (see
// services/firebase.js + services/authService.js, kept as future placeholders).

import { createContext, useContext, useEffect, useState } from 'react';
import * as mockAuth from '../services/mockAuthService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(mockAuth.getCurrentUser());
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const u = await mockAuth.login(credentials);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const u = await mockAuth.register(data);
    setUser(u);
    return u;
  };

  // One-click demo login for a role.
  const devLogin = (role) => {
    const u = mockAuth.loginAsRole(role);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await mockAuth.logout();
    setUser(null);
  };

  const value = {
    user,
    profile: user, // in mock mode the user object IS the profile
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    loading,
    isFirebaseConfigured: false, // backend paused — always mock
    login,
    register,
    devLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
