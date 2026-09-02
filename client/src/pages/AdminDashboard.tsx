import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useScorePolling } from '../hooks/useScorePolling';
import { type StudentScore, type StudentStatus } from '../services/scoreService';
import {
  Users, Trophy, Clock, BarChart2, Settings,
  Play, Pause, RotateCcw, CheckCircle2, LogOut,
  AlertTriangle, X, Timer, Hash, Bell, Download,
  BanIcon, UserCheck, RefreshCw, Wifi, Lock, Unlock, Key
} from 'lucide-react';
import { api } from '../services/api';


function ConfirmModal({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel?: string;
  danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card p-6 sm:p-8 w-full max-w-md border-white/20 z-10">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        <div className={`flex items-center gap-3 mb-4 ${danger ? 'text-red-400' : 'text-yellow-400'}`}>
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-xl font-bold font-mono">{title}</h3>
        </div>
        <p className="text-gray-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-sm">Cancel</button>
          <button onClick={onConfirm}
            className={`px-5 py-2 rounded-lg font-bold font-mono text-sm ${danger ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-yellow-500 hover:bg-yellow-400 text-dark-bg'}`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ResetPasswordModal({ studentName, onClose, onReset }: {
  studentName: string; onClose: () => void; onReset: (newPwd: string) => void;
}) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 4) {
      setErr('Password must be at least 4 characters');
      return;
    }
    onReset(pwd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card p-6 sm:p-8 w-full max-w-md border-white/20 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-3 mb-4 text-neon-blue">
          <Key className="w-6 h-6" />
          <h3 className="text-xl font-bold font-mono">Reset Password</h3>
        </div>
        <p className="text-gray-400 mb-6 leading-relaxed">Set a new password for team <strong>{studentName}</strong>.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="text" value={pwd} onChange={e => { setPwd(e.target.value); setErr(''); }}
              placeholder="Enter new password" required autoFocus
              className="w-full px-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all" />
          </div>
          {err && <p className="text-red-400 text-xs font-mono">{err}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-sm">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg font-bold font-mono text-sm bg-neon-blue hover:bg-neon-blue/80 text-white">
              Reset Password
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function SettingsModal({ onClose, timeLimit, setTimeLimit, announcement, setAnnouncement, onSave }: {
  onClose: () => void; timeLimit: number; setTimeLimit: (v: number) => void;
  announcement: string; setAnnouncement: (v: string) => void; onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card p-6 sm:p-8 w-full max-w-lg border-white/20 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold font-mono text-white mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-neon-purple" /> Event Settings
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-2">
              <Timer className="w-3 h-3" /> Challenge Time Limit (minutes)
            </label>
            <div className="flex items-center gap-3">
              {[3, 5, 7, 10].map(m => (
                <button key={m} onClick={() => setTimeLimit(m)}
                  className={`flex-1 py-2 rounded-lg border font-mono text-sm transition-colors ${timeLimit === m
                    ? 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple'
                    : 'bg-dark-bg border-white/10 text-gray-400 hover:border-white/30'}`}>
                  {m}m
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-2">
              <Hash className="w-3 h-3" /> Max Participants
            </label>
            <input type="number" defaultValue={100}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2.5 text-gray-200 font-mono text-sm focus:outline-none focus:border-neon-purple/50" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-2">
              <Bell className="w-3 h-3" /> Announcement Banner
            </label>
            <textarea value={announcement} onChange={e => setAnnouncement(e.target.value)} rows={3}
              placeholder="e.g. Round 2 starts in 5 minutes!"
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2.5 text-gray-200 font-mono text-sm focus:outline-none focus:border-neon-purple/50 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-sm">Cancel</button>
          <button onClick={() => { onSave(); onClose(); }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold font-mono text-sm">
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatusChip({ status }: { status: StudentStatus }) {
  const map: Record<StudentStatus, string> = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/20',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    'not-started': 'bg-gray-500/20 text-gray-400 border-gray-500/20',
    banned: 'bg-red-500/20 text-red-400 border-red-500/20',
  };
  const labels: Record<StudentStatus, string> = {
    completed: 'Completed', 'in-progress': 'In Progress', 'not-started': 'Not Started', banned: 'Banned',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs border ${map[status]}`}>{labels[status]}</span>;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [eventStatus, setEventStatus] = useState<'live' | 'paused' | 'ended'>('live');
  const [timeLimit, setTimeLimit] = useState(5);
  const [announcement, setAnnouncement] = useState('');
  const [savedAnnouncement, setSavedAnnouncement] = useState('');
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState('');
  const [gameLocks, setGameLocks] = useState({ 'word-search': false, 'jigsaw': false, 'debug-code': false });
  const [resetPwdModal, setResetPwdModal] = useState<{ id: string; name: string } | null>(null);

  // Fetch initial event state (including game locks)
  useEffect(() => {
    api.getEventState().then((s: any) => {
      if (s.event_status === 'RUNNING') setEventStatus('live');
      else if (s.event_status === 'PAUSED') setEventStatus('paused');
      else if (s.event_status === 'ENDED') setEventStatus('ended');
      setGameLocks({
        'word-search': !!s.word_search_locked,
        'jigsaw': !!s.jigsaw_locked,
        'debug-code': !!s.debug_code_locked,
      });
    }).catch(console.error);
  }, []);

  // ── Live polling ──────────────────────────────────────────────────────────
  const { scores, lastUpdated, isLoading, isLive, overrideData, refresh } = useScorePolling({
    intervalMs: 4000,
    enabled: eventStatus === 'live',
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ── Event handlers ────────────────────────────────────────────────────────
  const handlePause  = () => { 
    api.setEventState('pause').then(() => {
      setEventStatus('paused'); setConfirmModal(null); showToast('⏸ Event paused — student timers frozen.'); 
    }).catch(console.error);
  };
  const handleResume = () => { 
    api.setEventState('start').then(() => {
      setEventStatus('live'); setConfirmModal(null); showToast('▶ Event resumed — timers running.'); 
    }).catch(console.error);
  };
  const handleEnd    = () => { 
    api.setEventState('end').then(() => {
      setEventStatus('ended'); setConfirmModal(null); showToast('🏁 Event ended — scores locked.'); 
    }).catch(console.error);
  };

  const handleReset = () => {
    api.resetEvent().then(() => {
      setEventStatus('live');
      setConfirmModal(null);
      refresh();
      showToast('🔄 All scores have been reset.');
    }).catch(console.error);
  };

  const handleToggleGame = (gameId: 'word-search' | 'jigsaw' | 'debug-code') => {
    const newLocked = !gameLocks[gameId];
    api.toggleGameLock(gameId, newLocked).then(() => {
      setGameLocks(prev => ({ ...prev, [gameId]: newLocked }));
      const names: Record<string,string> = { 'word-search': 'Word Hunt', 'jigsaw': 'Jigsaw', 'debug-code': 'Debug Code' };
      showToast(newLocked ? `🔒 ${names[gameId]} locked.` : `🔓 ${names[gameId]} unlocked.`);
    }).catch(console.error);
  };

  const handleBan = (id: string) => {
    const updated = scores.map((s: StudentScore) => s.id === id ? { ...s, status: 'banned' as StudentStatus } : s);
    overrideData(updated);
    setConfirmModal(null);
    showToast('🚫 Participant removed from the event.');
  };

  const handleResetPassword = (newPwd: string) => {
    if (!resetPwdModal) return;
    api.resetTeamPassword(resetPwdModal.id, newPwd).then(() => {
      showToast(`🔑 Password reset for ${resetPwdModal.name}`);
      setResetPwdModal(null);
    }).catch((err) => {
      showToast(`❌ Error: ${err.message}`);
    });
  };

  const handleExport = () => {
    const rows = [
      ['#', 'Team', 'Members', 'Word Hunt', 'Jigsaw Pts', 'Jigsaw Time (s)', 'Debug Code', 'Total', 'Status'],
      ...[...scores].sort((a, b) => b.score - a.score)
        .map((s, i) => [i + 1, s.name, s.team, s.wordSearch, s.jigsaw, s.jigsawTime, s.debugCode, s.score, s.status])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'debug_arena_results.csv';
    a.click();
    showToast('📥 Results exported as CSV.');
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const total     = scores.length;
  const completed = scores.filter((s: StudentScore) => s.status === 'completed').length;
  const inProg    = scores.filter((s: StudentScore) => s.status === 'in-progress').length;
  const avgScore  = total ? Math.round(scores.reduce((a: number, b: StudentScore) => a + b.score, 0) / total) : 0;

  const stats = [
    { label: 'Participants', value: total,     icon: Users,        color: 'text-neon-blue' },
    { label: 'Completed',    value: completed, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'In Progress',  value: inProg,    icon: Clock,        color: 'text-yellow-400' },
    { label: 'Avg Score',    value: avgScore,  icon: BarChart2,    color: 'text-neon-purple' },
  ];

  const statusCfg = {
    live:   { dot: 'bg-terminal-green', text: 'EVENT LIVE',   color: 'text-terminal-green', border: 'border-terminal-green/30' },
    paused: { dot: 'bg-yellow-400',     text: 'EVENT PAUSED', color: 'text-yellow-400',     border: 'border-yellow-400/30' },
    ended:  { dot: 'bg-red-500',        text: 'EVENT ENDED',  color: 'text-red-400',         border: 'border-red-500/30' },
  }[eventStatus];

  return (
    <div className="space-y-5 py-4">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl glass-card border border-white/20 text-white font-mono text-sm shadow-xl whitespace-nowrap">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement banner */}
      <AnimatePresence>
        {savedAnnouncement && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-3">
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm">
              <Bell className="w-4 h-4" />
              <span className="font-bold">ANNOUNCEMENT:</span> {savedAnnouncement}
            </div>
            <button onClick={() => setSavedAnnouncement('')} className="text-yellow-400/60 hover:text-yellow-400"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">Admin Dashboard</h1>
          <p className="text-gray-500 font-mono text-sm">Logged in as: <span className="text-neon-purple">{user?.name}</span></p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live indicator with pulse on each poll */}
          <div className={`flex items-center gap-2 text-xs font-mono bg-dark-surface px-3 py-2 rounded-lg border ${statusCfg.border} ${statusCfg.color}`}>
            <div className={`w-2 h-2 rounded-full ${statusCfg.dot} ${eventStatus === 'live' ? 'animate-pulse' : ''}`} />
            {statusCfg.text}
            {isLive && eventStatus === 'live' && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="ml-1 text-terminal-green">↑</motion.span>
            )}
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs font-mono text-gray-600">
              <Wifi className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          <button onClick={refresh}
            className={`p-2 rounded-lg bg-dark-surface border border-white/10 text-gray-400 hover:text-neon-blue transition-colors ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh now">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/20 transition-colors text-xs font-mono">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-mono">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="glass-card p-4 sm:p-5">
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <motion.div key={stat.value} initial={{ scale: 1.15, color: '#00f0ff' }} animate={{ scale: 1, color: '' }}
                transition={{ duration: 0.4 }} className={`text-3xl font-black font-mono ${stat.color}`}>
                {stat.value}
              </motion.div>
              <div className="text-xs text-gray-500 mt-1 font-mono">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Event Controls */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <Settings className="w-4 h-4 text-neon-purple" /> Event Controls
        </h2>
        <div className="flex flex-wrap gap-3">
          <button disabled={eventStatus !== 'live'} onClick={() => setConfirmModal('pause')}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg font-mono text-sm hover:bg-yellow-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <Pause className="w-4 h-4" /> Pause Event
          </button>
          <button disabled={eventStatus !== 'paused'} onClick={() => setConfirmModal('resume')}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg font-mono text-sm hover:bg-green-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <Play className="w-4 h-4" /> Resume Event
          </button>
          <button disabled={eventStatus === 'ended'} onClick={() => setConfirmModal('end')}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg font-mono text-sm hover:bg-orange-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <BanIcon className="w-4 h-4" /> End Event
          </button>
          <button onClick={() => setConfirmModal('reset')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-mono text-sm hover:bg-red-500/20 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset All Scores
          </button>
          <button onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-bg border border-white/10 text-gray-300 rounded-lg font-mono text-sm hover:bg-white/5 hover:border-white/20 transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs font-mono">
          <div className={`w-2 h-2 rounded-full ${statusCfg.dot} ${eventStatus === 'live' ? 'animate-pulse' : ''}`} />
          <span className={statusCfg.color}>
            {eventStatus === 'live'   && 'Students can play · Scores update every 4 seconds'}
            {eventStatus === 'paused' && 'All student sessions are currently frozen.'}
            {eventStatus === 'ended'  && 'Event is over. Scores are locked.'}
          </span>
        </div>
      </div>

      {/* Game Lock Controls */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-400" /> Game Lock Controls
        </h2>
        <p className="text-xs text-gray-500 font-mono">Toggle individual challenges. Locked games show as locked to students.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            { id: 'word-search' as const, label: 'CSE Word Hunt', color: 'text-neon-purple', border: 'border-neon-purple/30' },
            { id: 'jigsaw' as const, label: 'OSI Jigsaw', color: 'text-yellow-400', border: 'border-yellow-400/30' },
            { id: 'debug-code' as const, label: 'Debug The Code', color: 'text-neon-blue', border: 'border-neon-blue/30' },
          ]).map(game => {
            const locked = gameLocks[game.id];
            return (
              <button
                key={game.id}
                onClick={() => handleToggleGame(game.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border font-mono text-sm transition-all duration-200 ${
                  locked
                    ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                    : `bg-dark-bg/60 ${game.border} ${game.color} hover:bg-white/5`
                }`}
              >
                <span className="font-semibold">{game.label}</span>
                <span className="flex items-center gap-1.5">
                  {locked ? (
                    <><Lock className="w-4 h-4" /> LOCKED</>
                  ) : (
                    <><Unlock className="w-4 h-4" /> OPEN</>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Participant table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Live Participant Scores
            {isLive && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-2 h-2 rounded-full bg-terminal-green animate-ping" />}
          </h2>
          <span className="text-xs text-gray-500 font-mono">{scores.length} participants</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-white/5 bg-dark-bg/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Team</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Members</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Word Hunt</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Jigsaw</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Debug Code</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[...scores].sort((a: StudentScore, b: StudentScore) => b.score - a.score)
                .map((student: StudentScore, idx: number) => (
                  <motion.tr key={student.id} layout
                    className={`transition-colors ${student.status === 'banned' ? 'opacity-40' : 'hover:bg-white/[0.03]'}`}>
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{student.team}</td>
                    <td className="px-4 py-3 text-right text-neon-blue hidden md:table-cell">{student.wordSearch}</td>
                    <td className="px-4 py-3 text-right text-yellow-400 hidden md:table-cell">
                      {student.jigsaw} {student.jigsawTime ? <span className="text-gray-500 text-xs ml-1">({student.jigsawTime}s)</span> : ''}
                    </td>
                    <td className="px-4 py-3 text-right text-neon-purple hidden md:table-cell">{student.debugCode}</td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      <motion.span key={student.score} initial={{ color: '#00f0ff' }} animate={{ color: '#ffffff' }}
                        transition={{ duration: 0.8 }}>
                        {student.score}
                      </motion.span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell"><StatusChip status={student.status} /></td>
                    <td className="px-4 py-3 text-center">
                      {student.status !== 'banned' ? (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setResetPwdModal({ id: student.id, name: student.name })} title="Reset password"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors">
                            <Key className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmModal(`ban-${student.id}`)} title="Remove participant"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <UserCheck className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-red-400">banned</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {confirmModal === 'pause'  && <ConfirmModal title="Pause Event?"   message="This will freeze all student timers." confirmLabel="Yes, Pause"  onConfirm={handlePause}  onCancel={() => setConfirmModal(null)} />}
        {confirmModal === 'resume' && <ConfirmModal title="Resume Event?"  message="All student timers will restart."      confirmLabel="Yes, Resume" onConfirm={handleResume} onCancel={() => setConfirmModal(null)} />}
        {confirmModal === 'end'    && <ConfirmModal title="End Event?"     message="Scores will be locked permanently. This cannot be undone without a full reset." confirmLabel="End Event" danger onConfirm={handleEnd} onCancel={() => setConfirmModal(null)} />}
        {confirmModal === 'reset'  && <ConfirmModal title="Reset All Scores?" message="All scores, statuses, and times will be wiped back to zero." confirmLabel="Yes, Reset" danger onConfirm={handleReset} onCancel={() => setConfirmModal(null)} />}
        {typeof confirmModal === 'string' && confirmModal.startsWith('ban-') && (
          <ConfirmModal
            title="Remove Participant?"
            message={`Ban ${scores.find((s: StudentScore) => s.id === confirmModal.replace('ban-', ''))?.name} from the event?`}
            confirmLabel="Remove" danger
            onConfirm={() => handleBan(confirmModal.replace('ban-', ''))}
            onCancel={() => setConfirmModal(null)}
          />
        )}
        {resetPwdModal && (
          <ResetPasswordModal
            studentName={resetPwdModal.name}
            onClose={() => setResetPwdModal(null)}
            onReset={handleResetPassword}
          />
        )}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} timeLimit={timeLimit} setTimeLimit={setTimeLimit}
            announcement={announcement} setAnnouncement={setAnnouncement}
            onSave={() => { setSavedAnnouncement(announcement); showToast('✅ Settings saved.'); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
