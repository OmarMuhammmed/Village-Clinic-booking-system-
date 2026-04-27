import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'clinic_auth';
const CREDENTIALS = { username: 'admin', password: 'admin123' };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore corrupt data */ }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    if (username !== CREDENTIALS.username || password !== CREDENTIALS.password) {
      throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    const session = { username, displayName: 'المسؤول', loginTime: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
