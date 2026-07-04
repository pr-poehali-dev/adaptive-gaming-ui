import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { API } from '@/lib/api';

const TOKEN_KEY = 'facet-auth-token';

export interface AuthUser {
  user_id: number;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  googleClientId: string;
  loginWithCredential: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [googleClientId, setGoogleClientId] = useState('');

  useEffect(() => {
    fetch(`${API.authGoogle}?config=1`)
      .then((r) => r.json())
      .then((data) => setGoogleClientId(data.clientId || ''))
      .catch(() => setGoogleClientId(''));
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(API.authGoogle, {
      headers: { 'X-Authorization': `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('unauthorized');
        return r.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        setUser(null);
        setToken(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch { /* noop */ }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const loginWithCredential = useCallback(async (credential: string) => {
    const res = await fetch(API.authGoogle, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setToken(data.token);
    setUser({ user_id: data.user_id, email: data.email, name: data.name });
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
    } catch { /* noop */ }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch { /* noop */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, googleClientId, loginWithCredential, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
