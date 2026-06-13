import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../constants/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { user: userData } = await authService.getMe();
      setUser(userData);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccess = (requiredRoles = []) => {
    if (!requiredRoles.length) return true;
    if (user?.role === ROLES.SUPER_ADMIN) return true;
    return hasRole(...requiredRoles);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout, hasRole, canAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
