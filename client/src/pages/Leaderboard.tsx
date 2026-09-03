import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Users, ChevronLeft, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScorePolling } from '../hooks/useScorePolling';

export default function Leaderboard() {
  const { scores } = useScorePolling({ intervalMs: 3000, enabled: true });

  const rankedScores = [...scores]
    .filter(s => s.status !== 'banned')
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col font-mono relative overflow-hidden">
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-dark-bg to-dark-bg opacity-40 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold tracking-widest text-sm">EXIT TO DASHBOARD</span>
        </Link>
        <div className="flex items-center gap-2 text-2xl font-black tracking-widest">
          <Terminal className="text-neon-purple w-8 h-8" />
          <span className="text-white">DEBUG_ARENA</span>
          <span className="w-2 h-6 bg-neon-purple animate-pulse" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pb-12 flex flex-col relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue animate-pulse drop-shadow-[0_0_15px_rgba(170,59,255,0.5)]">
            LIVE LEADERBOARD
          </h1>
          <p className="text-gray-400 text-lg">TOP TEAMS RANKING • AUTOMATIC REAL-TIME REFRESH</p>
        </div>

        <div className="flex-1 glass-card overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col bg-dark-surface/80 backdrop-blur-xl">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 p-5 sm:p-6 border-b border-white/10 bg-black/40 text-gray-400 font-bold tracking-widest text-sm sm:text-base">
            <div className="col-span-2 text-center">RANK</div>
            <div className="col-span-7">TEAM IDENTIFIER</div>
            <div className="col-span-3 text-right">TOTAL SCORE</div>
          </div>

          {/* List container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {rankedScores.map((entry, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <motion.div
                    layout
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`grid grid-cols-12 gap-4 p-5 items-center rounded-xl transition-all duration-300 border ${
                      isTop1 ? 'bg-gradient-to-r from-neon-purple/20 to-transparent border-neon-purple/50 shadow-[0_0_15px_rgba(170,59,255,0.3)]' :
                      isTop2 ? 'bg-gradient-to-r from-white/10 to-transparent border-white/20' :
                      isTop3 ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20' :
                      'bg-dark-bg/50 border-white/5 hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="col-span-2 flex justify-center items-center">
                      {isTop1 ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 rounded-full" />
                          <Trophy className="w-10 h-10 text-yellow-400 relative z-10" />
                        </div>
                      ) : isTop2 ? (
                        <Medal className="w-9 h-9 text-gray-300" />
                      ) : isTop3 ? (
                        <Award className="w-8 h-8 text-orange-400" />
                      ) : (
                        <span className="font-black text-2xl text-gray-600">#{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="col-span-7 flex flex-col justify-center">
                      <div className={`font-black text-2xl sm:text-3xl tracking-wide uppercase truncate ${
                        isTop1 ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-200'
                      }`}>
                        {entry.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 truncate">
                        <Users className="w-4 h-4 text-neon-blue" />
                        <span className="tracking-widest">{entry.team}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3 flex items-center justify-end">
                      <motion.div
                        key={entry.score}
                        initial={{ scale: 1.5, color: '#aa3bff' }}
                        animate={{ scale: 1, color: isTop1 ? '#00f0ff' : '#ffffff' }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className={`font-black text-4xl sm:text-5xl ${
                          isTop1 ? 'drop-shadow-[0_0_15px_rgba(0,240,255,0.6)] text-neon-blue' : 'text-white'
                        }`}
                      >
                        {entry.score}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
              
              {rankedScores.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <Terminal className="w-16 h-16 text-gray-600 mb-4 animate-pulse" />
                  <p className="text-2xl text-gray-500 font-bold tracking-widest">AWAITING CONTESTANTS...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
