import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { normalizeRole } from './roles';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'authUser',
  rememberMe: 'rememberMe',
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user) || sessionStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getTokenStorage = () =>
  localStorage.getItem(STORAGE_KEYS.rememberMe) === 'true' ? localStorage : sessionStorage;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const persistSession = useCallback((data, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
    storage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
    storage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
    localStorage.setItem(STORAGE_KEYS.rememberMe, String(remember));

    other.removeItem(STORAGE_KEYS.accessToken);
    other.removeItem(STORAGE_KEYS.refreshToken);
    other.removeItem(STORAGE_KEYS.user);

    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  const clearSession = useCallback(() => {
    [localStorage, sessionStorage].forEach((s) => {
      s.removeItem(STORAGE_KEYS.accessToken);
      s.removeItem(STORAGE_KEYS.refreshToken);
      s.removeItem(STORAGE_KEYS.user);
    });
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const initAuth = useCallback(async () => {
    const storage = getTokenStorage();
    const token = storage.getItem(STORAGE_KEYS.accessToken) || localStorage.getItem(STORAGE_KEYS.accessToken);
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { user: userData } = await authService.getMe();

console.log('Backend user:', userData);

const normalized = {
  ...userData,
  role: normalizeRole(userData.role),
};

console.log('Normalized user:', normalized);
      setUser(normalized);
      setIsAuthenticated(true);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const loginAdmin = async ({ email, password, rememberMe = true }) => {
    const data = await authService.loginAdmin({ email, password });
    const userData = { ...data.user, role: normalizeRole(data.user.role) };
    persistSession({ ...data, user: userData }, rememberMe);
    return { ...data, user: userData };
  };

 const sendOtp = async ({
  email,
  mobile,
  role,
}) => {
  console.log(
    'SEND OTP:',
    {
      role,
      email,
      mobile,
    }
  );

  if (role === 'parent') {
    return authService.sendParentOtp({
      email,
    });
  }

  if (role === 'partner') {
    return authService.sendPartnerOtp({
      mobile,
    });
  }

  throw new Error(
    'Invalid role for OTP'
  );
};

  const verifyOtp = async ({
  email,
  mobile,
  otp,
  role,
  rememberMe = true,
}) => {
  let data;

  if (role === 'parent') {
    data =
      await authService.verifyParentOtp({
        email,
        otp,
      });
  } else if (
    role === 'partner'
  ) {
    data =
      await authService.verifyPartnerOtp(
        {
          mobile,
          otp,
        }
      );
  } else {
    throw new Error(
      'Invalid role for OTP'
    );
  }

  const userData = {
    ...data.user,
    role: normalizeRole(
      data.user.role
    ),
  };

  persistSession(
    {
      ...data,
      user: userData,
    },
    rememberMe
  );

  return {
    ...data,
    user: userData,
  };
};

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      const storage = getTokenStorage();
      storage.setItem(STORAGE_KEYS.user, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginAdmin,
        sendOtp,
        verifyOtp,
        logout,
        updateUser,
        clearSession,
      }}
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

export default AuthProvider;
