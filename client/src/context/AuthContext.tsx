import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../services/api';

export type Role = 'admin' | 'team' | null;

export interface Team {
  id: string;
  teamName: string;
  members: string[];
  registeredAt?: number;
}

interface User {
  id: string;
  name: string;
  role: Role;
  members?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerTeam: (teamName: string, members: string[], password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAdmin: boolean;
  isTeam: boolean;
}

const SESSION_KEY = 'debug_arena_user';
const TOKEN_KEY = 'token';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const persist = (u: User, token: string) => {
    setUser(u);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    sessionStorage.setItem(TOKEN_KEY, token);
  };

  const registerTeam = async (teamName: string, members: string[], password: string) => {
    try {
      const trimmedName = teamName.trim();
      if (!trimmedName) return { success: false, message: 'Team name is required.' };
      if (members.filter(m => m.trim()).length === 0)
        return { success: false, message: 'At least one member name is required.' };
      if (password.length < 4)
        return { success: false, message: 'Password must be at least 4 characters.' };

      const studentId = `team_${Date.now()}`;
      const res = await api.registerStudent({
        studentId,
        name: trimmedName,
        team: members.filter(Boolean).join(', '),
        password
      });

      const u: User = { id: res.student.id, name: res.student.name, role: 'team', members: res.student.team.split(', ') };
      persist(u, res.token);
      return { success: true, message: 'Team registered!' };
    } catch (err: any) {
      let msg = err?.message || 'Registration failed';
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      if (msg === 'Failed to fetch') msg = 'Cannot reach server. Check network / API URL.';
      return { success: false, message: msg };
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      if (identifier.trim() === 'admin') {
        const res = await api.loginAdmin({ username: identifier.trim(), password });
        const u: User = { id: 'admin', name: 'Event Admin', role: 'admin' };
        persist(u, res.token);
        return { success: true, message: 'Welcome, Admin!' };
      } else {
        const res = await api.loginStudent({ studentId: identifier.trim(), password });
        const u: User = { id: res.student.id, name: res.student.name, role: 'team', members: res.student.team.split(', ') };
        persist(u, res.token);
        return { success: true, message: `Welcome, ${res.student.name}!` };
      }
    } catch (err: any) {
      let msg = err?.message || 'Login failed';
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      if (msg === 'Failed to fetch') msg = 'Cannot reach server. Check network / API URL.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user, login, registerTeam, logout,
      isAdmin: user?.role === 'admin',
      isTeam:  user?.role === 'team',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
