import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'admin' | 'student' | null;

interface User {
  id: string;
  name: string;
  role: Role;
  teamName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
}

// Demo credentials – replace with real backend later
const DEMO_USERS = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Event Admin', role: 'admin' as Role },
  { id: '2', username: 'student1', password: 'pass123', name: 'Alice Kumar', role: 'student' as Role, teamName: 'Team Alpha' },
  { id: '3', username: 'student2', password: 'pass123', name: 'Bob Rajan', role: 'student' as Role, teamName: 'Code Warriors' },
  { id: '4', username: 'student3', password: 'pass123', name: 'Carol Nair', role: 'student' as Role, teamName: 'Debug Masters' },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('debug_arena_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, password: string) => {
    const found = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!found) return { success: false, message: 'Invalid credentials.' };
    const u: User = { id: found.id, name: found.name, role: found.role, teamName: (found as any).teamName };
    setUser(u);
    sessionStorage.setItem('debug_arena_user', JSON.stringify(u));
    return { success: true, message: 'Logged in!' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('debug_arena_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student',
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
