import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Lock, User, AlertCircle, Eye, EyeOff,
  Users, Plus, ShieldCheck, ChevronRight, UserPlus
} from 'lucide-react';

type Tab = 'team-login' | 'team-register' | 'admin';

export default function LoginPage() {
  const { login, registerTeam } = useAuth();
  const [tab, setTab] = useState<Tab>('team-register');

  // Shared state
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Team login
  const [loginTeam, setLoginTeam] = useState('');
  const [loginPwd,  setLoginPwd]  = useState('');

  // Team registration
  const [teamName, setTeamName]   = useState('');
  const [members, setMembers]     = useState(['', '', '']);
  const [regPwd,  setRegPwd]      = useState('');
  const [regPwd2, setRegPwd2]     = useState('');

  // Admin
  const [adminUser, setAdminUser] = useState('');
  const [adminPwd,  setAdminPwd]  = useState('');

  const reset = () => { setError(''); setLoading(false); };

  const handleTeamLogin = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = await login(loginTeam, loginPwd);
    if (!res.success) setError(res.message);
    setLoading(false);
  };

  const handleTeamRegister = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    if (regPwd !== regPwd2) { setError('Passwords do not match.'); return; }
    const filledMembers = members.filter(m => m.trim());
    if (filledMembers.length < 1) { setError('Enter at least one member name.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = await registerTeam(teamName, members, regPwd);
    if (!res.success) setError(res.message);
    setLoading(false);
  };

  const handleAdmin = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = await login(adminUser, adminPwd);
    if (!res.success) setError(res.message);
    setLoading(false);
  };

  const updateMember = (i: number, val: string) =>
    setMembers(prev => { const n = [...prev]; n[i] = val; return n; });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* BG glows */}
      <div className="absolute w-96 h-96 bg-neon-purple/10 rounded-full blur-[80px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-neon-blue/10   rounded-full blur-[80px] bottom-0 right-0  pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-surface border border-neon-purple/30 mb-4 shadow-[0_0_30px_rgba(170,59,255,0.2)]">
            <Terminal className="w-8 h-8 text-neon-purple" />
          </div>
          <h1 className="text-3xl font-black text-white font-mono tracking-tight">DEBUG_ARENA</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">CSE Technical Event Platform</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-4 p-1 glass-card rounded-xl border border-white/10">
          <button
            onClick={() => { setTab('team-register'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              tab === 'team-register'
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Register Team
          </button>
          <button
            onClick={() => { setTab('team-login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              tab === 'team-login'
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/40'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" /> Team Login
          </button>
          <button
            onClick={() => { setTab('admin'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              tab === 'admin'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        </div>

        {/* ── Panel ── */}
        <div className="glass-card p-6 sm:p-8 border-white/10 min-h-[350px]">
          <AnimatePresence mode="wait">

            {/* ── TEAM REGISTER ── */}
            {tab === 'team-register' && (
              <motion.form key="register"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}
                onSubmit={handleTeamRegister} className="space-y-4"
              >
                <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-neon-purple" />
                  Register Your Team
                </h2>

                {/* Team Name */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Team Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)}
                      placeholder="e.g. Debug Masters" required
                      className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all" />
                  </div>
                </div>

                {/* Member Names */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">
                    Team Members <span className="text-gray-600 normal-case">(max 3)</span>
                  </label>
                  <div className="space-y-2">
                    {members.map((m, i) => (
                      <div key={i} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-neon-purple font-mono text-xs font-bold">
                          {i + 1}
                        </div>
                        <input
                          type="text"
                          value={m}
                          onChange={e => updateMember(i, e.target.value)}
                          placeholder={i === 0 ? 'Member 1 (required)' : `Member ${i + 1} (optional)`}
                          required={i === 0}
                          className="w-full pl-10 pr-4 py-2.5 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-purple/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showPwd ? 'text' : 'password'} value={regPwd}
                        onChange={e => setRegPwd(e.target.value)} placeholder="••••••" required minLength={4}
                        className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-purple/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showPwd ? 'text' : 'password'} value={regPwd2}
                        onChange={e => setRegPwd2(e.target.value)} placeholder="••••••" required
                        className="w-full pl-10 pr-10 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-purple/50 transition-all" />
                      <button type="button" onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && <ErrorBox msg={error} />}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold font-mono tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <Spinner /> : <><Plus className="w-4 h-4" /> REGISTER TEAM</>}
                </button>

                <p className="text-center text-xs text-gray-600 font-mono">
                  Already registered?{' '}
                  <button type="button" onClick={() => { setTab('team-login'); setError(''); }}
                    className="text-neon-blue hover:underline">Team Login →</button>
                </p>
              </motion.form>
            )}

            {/* ── TEAM LOGIN ── */}
            {tab === 'team-login' && (
              <motion.form key="team-login"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}
                onSubmit={handleTeamLogin} className="space-y-5"
              >
                <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-neon-blue" /> Team Login
                </h2>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Team Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={loginTeam} onChange={e => setLoginTeam(e.target.value)}
                      placeholder="Enter your registered team name" required
                      className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type={showPwd ? 'text' : 'password'} value={loginPwd}
                      onChange={e => setLoginPwd(e.target.value)} placeholder="••••••••" required
                      className="w-full pl-10 pr-10 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all" />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && <ErrorBox msg={error} />}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold font-mono tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <Spinner /> : <><ChevronRight className="w-4 h-4" /> ENTER ARENA</>}
                </button>

                <p className="text-center text-xs text-gray-600 font-mono">
                  New team?{' '}
                  <button type="button" onClick={() => { setTab('team-register'); setError(''); }}
                    className="text-neon-purple hover:underline">Register here →</button>
                </p>
              </motion.form>
            )}

            {/* ── ADMIN ── */}
            {tab === 'admin' && (
              <motion.form key="admin"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}
                onSubmit={handleAdmin} className="space-y-5"
              >
                <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-400" /> Admin Access
                </h2>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={adminUser} onChange={e => setAdminUser(e.target.value)}
                      placeholder="admin" required
                      className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-red-500/40 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type={showPwd ? 'text' : 'password'} value={adminPwd}
                      onChange={e => setAdminPwd(e.target.value)} placeholder="••••••••" required
                      className="w-full pl-10 pr-10 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-red-500/40 transition-all" />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && <ErrorBox msg={error} />}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-bold font-mono tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <Spinner /> : <><ShieldCheck className="w-4 h-4" /> ADMIN LOGIN</>}
                </button>

                <div className="p-3 bg-dark-bg/80 rounded-lg border border-white/5 text-xs font-mono text-gray-500">
                  <span className="text-gray-400 font-bold">Default:</span> admin / admin123
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {msg}
    </motion.div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}
