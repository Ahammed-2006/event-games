import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Image as ImageIcon, Clock, Star, ArrowRight } from 'lucide-react';

export default function Challenges() {
  const challenges = [
    {
      id: 'word-search',
      title: 'CSE WORD HUNT',
      description: 'Find hidden Computer Science and Debugging terms in the grid.',
      icon: Search,
      difficulty: 'Medium',
      time: '5 minutes',
      category: 'CSE + Debugging',
      path: '/challenges/word-search',
      color: 'text-neon-purple',
      borderColor: 'group-hover:border-neon-purple/50',
      bgHover: 'group-hover:bg-neon-purple/5'
    },
    {
      id: 'image-puzzle',
      title: 'CSE IMAGE PUZZLE',
      description: 'Identify the hidden Computer Science concept from the image.',
      icon: ImageIcon,
      difficulty: 'Medium',
      time: '3 minutes',
      category: 'CSE',
      path: '/challenges/image-puzzle',
      color: 'text-neon-blue',
      borderColor: 'group-hover:border-neon-blue/50',
      bgHover: 'group-hover:bg-neon-blue/5'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono text-glow text-white">Choose Your Challenge</h1>
        <p className="text-gray-400">Select a puzzle to begin your debugging journey.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Link to={challenge.path} className={`group block h-full`}>
                <div className={`glass-card p-8 h-full flex flex-col transition-all duration-300 ${challenge.borderColor} ${challenge.bgHover} hover:-translate-y-2 hover:shadow-2xl`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-dark-bg/50 border border-white/5 ${challenge.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-dark-bg/50 border border-white/10 text-gray-400">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {challenge.difficulty}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 font-mono text-white group-hover:text-glow transition-all">
                    {challenge.title}
                  </h2>
                  <p className="text-gray-400 mb-8 flex-grow">
                    {challenge.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-gray-500 font-mono">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {challenge.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        {challenge.category}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className={`font-bold tracking-wider ${challenge.color}`}>PLAY NOW</span>
                      <ArrowRight className={`w-5 h-5 ${challenge.color} transform group-hover:translate-x-2 transition-transform`} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
