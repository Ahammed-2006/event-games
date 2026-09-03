import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import { Search, Grid3X3, Terminal, Clock, Star, ArrowRight, LogOut, User, Trophy, CheckCircle, Lock } from 'lucide-react';
import { api } from '../services/api';

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const [eventState, setEventState] = useState<any>(null);

  useEffect(() => {
    api.getProgress().then(setProgress).catch(console.error);
    api.getProfile().then(p => setScore(p.score)).catch(console.error);

    // Poll event state every 5s so admin lock/unlock reflects in real-time
    const syncState = () => api.getEventState().then(setEventState).catch(console.error);
    syncState();
    const interval = setInterval(syncState, 5000);
    return () => clearInterval(interval);
  }, []);

  const challenges = [
    {
      id: 'word-search',
      title: 'CSE WORD HUNT',
      description: 'Find hidden Computer Science and Debugging terms scattered across the grid.',
      icon: Search,
      difficulty: 'Medium',
      time: '5 min',
      category: 'CSE + Debugging',
      path: '/challenges/word-search',
      color: 'text-neon-purple',
      glowColor: 'rgba(170,59,255,0.35)',
      borderHover: 'hover:border-neon-purple/50',
      bgHover: 'hover:bg-neon-purple/5',
      points: 20,
    },
    {
      id: 'jigsaw',
      title: 'OSI MODEL JIGSAW',
      description: 'Reconstruct a CSE architecture diagram piece by piece before time runs out.',
      icon: Grid3X3,
      difficulty: 'Hard',
      time: '4 min',
      category: 'CSE Concepts',
      path: '/challenges/jigsaw',
      color: 'text-yellow-400',
      glowColor: 'rgba(250,204,21,0.3)',
      borderHover: 'hover:border-yellow-400/50',
      bgHover: 'hover:bg-yellow-400/5',
      points: 400,
    },
    {
      id: 'debug-code',
      title: 'DEBUG THE CODE',
      description: 'Fix 6 buggy code snippets. 5 points each, −2 if hint used.',
      icon: Terminal,
      difficulty: 'Hard',
      time: '6 min',
      category: 'Coding',
      path: '/challenges/debug-code',
      color: 'text-neon-blue',
      glowColor: 'rgba(0,240,255,0.3)',
      borderHover: 'hover:border-neon-blue/50',
      bgHover: 'hover:bg-neon-blue/5',
      points: 30,
    }
  ];

  const isLocked = (id: string) => {
    if (!eventState) return false;
    if (eventState.event_status !== 'RUNNING') return true;
    if (id === 'word-search' && eventState.word_search_locked) return true;
    if (id === 'jigsaw' && eventState.jigsaw_locked) return true;
    if (id === 'debug-code' && eventState.debug_code_locked) return true;
    return false;
  };

  return (
    <div className="space-y-8 py-4">

      {/* Welcome bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-neon-purple font-bold font-mono text-xl">
              {user?.name?.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-terminal-green border-2 border-dark-bg" />
          </div>
          <div className="flex flex-col">
            <p className="text-white font-bold text-lg">{user?.name}</p>
            <p className="text-gray-500 font-mono text-sm flex items-center gap-2">
              <User className="w-3 h-3" /> {user?.members?.join(', ') || 'No Members'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-xs text-gray-500 font-mono">TOTAL SCORE</p>
            <p className="text-xl font-bold font-mono text-neon-purple text-glow">{score}</p>
          </div>
          <Link to="/leaderboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/20 transition-colors text-sm font-mono">
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-mono">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-black text-white font-mono mb-2"
        >
          Choose Your Challenge
        </motion.h1>
        <p className="text-gray-500 text-sm">Complete all three to maximise your score!</p>
      </div>

      {/* Challenge cards with 3D tilt */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          const isCompleted = progress.some(p => p.challenge_id === challenge.id && p.status === 'completed');
          const locked = isLocked(challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <TiltCard intensity={10}>
                <Link to={challenge.path} className={`group block h-full ${(isCompleted || locked) ? 'pointer-events-none opacity-50' : ''}`}>
                  <div
                    className={`glass-card p-6 h-full flex flex-col border border-white/10 ${isCompleted ? 'border-terminal-green/50 bg-terminal-green/5' : challenge.borderHover} ${isCompleted ? '' : challenge.bgHover} transition-all duration-300 rounded-xl`}
                    style={{
                      boxShadow: `0 4px 30px rgba(0,0,0,0.2)`,
                    }}
                    onMouseEnter={e => {
                      if (!isCompleted) (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${challenge.glowColor}`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 30px rgba(0,0,0,0.2)`;
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-3 rounded-xl bg-dark-bg/60 border border-white/5 ${isCompleted ? 'text-terminal-green' : challenge.color}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-terminal-green/20 border border-terminal-green/40 text-terminal-green">
                            <CheckCircle className="w-3 h-3" /> COMPLETED
                          </div>
                        ) : locked ? (
                          <div className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400">
                            <Lock className="w-3 h-3" /> LOCKED
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-dark-bg/60 border border-white/10 text-gray-400">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {challenge.difficulty}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Title + desc */}
                    <h2 className={`text-xl font-bold mb-2 font-mono ${isCompleted ? 'text-terminal-green' : challenge.color}`}>{challenge.title}</h2>
                    <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{challenge.description}</p>

                    {/* Footer */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {challenge.time}
                        </div>
                        <div className={`font-bold ${isCompleted ? 'text-terminal-green' : challenge.color}`}>
                          {isCompleted ? `${progress.find(p => p.challenge_id === challenge.id)?.score} pts earned` : `+${challenge.points} pts`}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className={`font-bold text-sm tracking-wider ${isCompleted ? 'text-terminal-green' : challenge.color}`}>
                          {isCompleted ? 'FINISHED' : 'PLAY NOW'}
                        </span>
                        {!isCompleted && <ArrowRight className={`w-4 h-4 ${challenge.color} group-hover:translate-x-2 transition-transform duration-200`} />}
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
