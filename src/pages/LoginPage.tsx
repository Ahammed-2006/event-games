import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Terminal, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate auth delay
    const result = login(username.trim(), password);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute w-96 h-96 bg-neon-purple/10 rounded-full blur-[80px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-neon-blue/10 rounded-full blur-[80px] bottom-0 right-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-surface border border-neon-purple/30 mb-4 shadow-[0_0_30px_rgba(170,59,255,0.2)]">
            <Terminal className="w-8 h-8 text-neon-purple" />
          </div>
          <h1 className="text-3xl font-black text-white font-mono tracking-tight">DEBUG_ARENA</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">CSE Technical Event Platform</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 font-mono">&gt; authenticate --user</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin or student1"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold font-mono tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : '> LOGIN'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-dark-bg/80 rounded-lg border border-white/5 text-xs font-mono text-gray-500 space-y-1">
            <p className="text-gray-400 font-bold mb-2">Demo Credentials:</p>
            <p><span className="text-neon-purple">admin</span> / admin123  → Admin Dashboard</p>
            <p><span className="text-neon-blue">student1</span> / pass123  → Student Portal</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
