import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bug, Terminal, Cpu, Play, Info } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[100px] -top-40 -left-40"></div>
        <div className="absolute w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[80px] bottom-0 right-0"></div>
        
        {/* Binary/Code pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] font-mono text-[8px] leading-tight select-none overflow-hidden whitespace-pre" aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}>
              {Array.from({ length: 20 }).map(() => Math.random().toString(2).substr(2, 20)).join(' ')}
            </div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon-purple/30 text-neon-purple text-sm font-mono mb-8">
          <Terminal className="w-4 h-4" />
          <span>./debug_arena --init</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
          DEBUG <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">ARENA</span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-medium text-gray-300 mb-8 font-mono">
          CSE Debugging & Technical Challenge
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          "Find the bugs. Solve the puzzles. Think like a programmer."
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/challenges"
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-lg w-full sm:w-auto flex items-center justify-center gap-3 transition-all neon-border-purple hover:bg-neon-purple/10"
          >
            <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Play className="w-5 h-5 text-neon-purple group-hover:text-white transition-colors" />
            <span className="font-bold text-white tracking-wider">START EVENT</span>
          </Link>
          
          <Link 
            to="/rules"
            className="px-8 py-4 glass-card hover:bg-white/5 transition-all rounded-lg w-full sm:w-auto flex items-center justify-center gap-3 text-gray-300 hover:text-white border-white/10"
          >
            <Info className="w-5 h-5" />
            <span className="font-medium tracking-wider">HOW TO PLAY</span>
          </Link>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 text-gray-500/50"
      >
        <Bug className="w-8 h-8" />
        <Terminal className="w-8 h-8" />
        <Cpu className="w-8 h-8" />
      </motion.div>
    </div>
  );
}
