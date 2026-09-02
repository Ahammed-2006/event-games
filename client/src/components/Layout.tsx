import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const adminLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  const studentLinks = [
    { name: 'Home', path: '/' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Rules', path: '/rules' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  const navLinks = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-base sm:text-xl font-bold font-mono tracking-wider shrink-0">
              <Terminal className="text-neon-purple w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-white">DEBUG_ARENA</span>
              <span className="w-1.5 h-4 bg-neon-purple animate-pulse hidden sm:inline-block" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-neon-blue',
                    location.pathname === link.path ? 'text-neon-blue' : 'text-gray-400'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 text-xs font-mono bg-dark-surface px-3 py-1 rounded-full border border-terminal-green/30 text-terminal-green">
                <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                {isAdmin ? 'ADMIN' : 'EVENT LIVE'}
              </div>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/10 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-neon-purple/10 text-neon-blue border border-neon-purple/20'
                      : 'text-gray-300 hover:bg-white/5'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 mt-3 px-3 py-2 text-xs font-mono text-terminal-green">
                <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                {isAdmin ? 'ADMIN MODE' : 'EVENT LIVE'}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-4 text-center text-gray-600 text-xs font-mono">
        &gt; debug_arena --version 1.0.0 © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
