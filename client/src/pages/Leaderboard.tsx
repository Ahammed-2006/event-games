import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { useScorePolling } from '../hooks/useScorePolling';

export default function Leaderboard() {
  const { scores } = useScorePolling({ intervalMs: 5000, enabled: true });

  const rankedScores = [...scores]
    .filter(s => s.status !== 'banned')
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4 font-mono text-glow text-white">Live Leaderboard</h1>
        <p className="text-gray-400 font-mono">./fetch_rankings --sort=score</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-dark-bg/50 font-mono text-sm text-gray-400 font-bold tracking-wider">
          <div className="col-span-2 text-center">RANK</div>
          <div className="col-span-6">TEAM</div>
          <div className="col-span-4 text-right">SCORE</div>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {rankedScores.map((entry, index) => (
              <motion.div
                layout
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${
                  index === 0 ? 'bg-neon-purple/10' : ''
                }`}
              >
                <div className="col-span-2 flex justify-center">
                  {index === 0 ? (
                    <Trophy className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  ) : index === 1 ? (
                    <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" />
                  ) : index === 2 ? (
                    <Award className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                  ) : (
                    <span className="font-mono text-gray-500 font-bold text-lg">#{index + 1}</span>
                  )}
                </div>
                
                <div className="col-span-6">
                  <div className={`font-bold text-lg mb-1 ${index === 0 ? 'text-neon-purple text-glow' : 'text-gray-200'}`}>
                    {entry.name}
                  </div>
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-1.5 line-clamp-1">
                    <Users className="w-3 h-3" /> {entry.team}
                  </div>
                </div>
                
                <div className="col-span-4 flex items-center justify-end">
                  <motion.div
                    key={entry.score}
                    initial={{ color: '#00f0ff', scale: 1.1 }}
                    animate={{ color: index === 0 ? '#aa3bff' : '#00f0ff', scale: 1 }}
                    className="font-mono font-black text-2xl drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  >
                    {entry.score}
                  </motion.div>
                </div>
              </motion.div>
            ))}
            {rankedScores.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-mono">
                No teams registered yet.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
