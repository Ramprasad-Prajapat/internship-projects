import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gamepulse_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('gamepulse_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (_e) {
        localStorage.removeItem('gamepulse_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { jwt, role, email: userEmail, id, fullName } = res.data;
      
      const userData = { id, email: userEmail, role, fullName };
      setToken(jwt);
      setUser(userData);
      
      localStorage.setItem('gamepulse_token', jwt);
      localStorage.setItem('gamepulse_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || 'Login failed',
      };
    }
  };

  const register = async (email, password, role = 'USER', fullName = '') => {
    try {
      const res = await api.post('/auth/register', { email, password, role, fullName });
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gamepulse_token');
    localStorage.removeItem('gamepulse_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isScorer = user?.role === 'SCORER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isScorer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
