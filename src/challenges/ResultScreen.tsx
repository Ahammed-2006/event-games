import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Target, RotateCcw, List } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  time: string;
  stats: {
    label: string;
    value: string;
  }[];
  onRestart: () => void;
}

export default function ResultScreen({ score, time, stats, onRestart }: ResultScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-12"
    >
      <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden border-neon-purple/50">
        {/* Confetti / Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-neon-purple/20 blur-[50px]"></div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-white font-mono tracking-tight text-glow">
            CHALLENGE COMPLETE!
          </h1>
          <p className="text-neon-blue font-mono text-xl mb-8">System diagnostic successful</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-bg/60 rounded-xl p-6 mb-8 border border-white/10"
        >
          <div className="text-gray-400 text-sm font-mono mb-2 uppercase tracking-widest">Final Score</div>
          <div className="text-6xl font-black text-neon-purple text-glow mb-8">{score}</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/5">
              <Clock className="w-5 h-5 text-gray-400 mb-2" />
              <div className="text-2xl font-mono text-white">{time}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Time Elapsed</div>
            </div>
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-lg bg-white/5">
                <Target className="w-5 h-5 text-gray-400 mb-2" />
                <div className="text-2xl font-mono text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-white font-medium tracking-wide"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART
          </button>
          <Link 
            to="/leaderboard"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neon-purple hover:bg-neon-purple/80 transition-colors flex items-center justify-center gap-2 text-white font-medium tracking-wide"
          >
            <List className="w-4 h-4" />
            VIEW LEADERBOARD
          </Link>
          <Link 
            to="/challenges"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neon-blue hover:bg-neon-blue/80 transition-colors flex items-center justify-center gap-2 text-dark-bg font-bold tracking-wide"
          >
            <Target className="w-4 h-4" />
            MORE CHALLENGES
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
