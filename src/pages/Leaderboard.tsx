import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, team: "Team Alpha", score: 1850, time: "08:45" },
    { rank: 2, team: "Code Warriors", score: 1720, time: "09:12" },
    { rank: 3, team: "Debug Masters", score: 1650, time: "09:50" },
    { rank: 4, team: "Runtime Error", score: 1540, time: "10:15" },
    { rank: 5, team: "Bit Squad", score: 1480, time: "11:05" },
    { rank: 6, team: "Syntax Sorcerers", score: 1420, time: "11:30" },
    { rank: 7, team: "Null Pointers", score: 1350, time: "12:10" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-mono text-glow text-white">Live Leaderboard</h1>
        <p className="text-gray-400 font-mono">./fetch_rankings --sort=score</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-dark-bg/50 font-mono text-sm text-gray-400 font-bold tracking-wider">
          <div className="col-span-2 text-center">RANK</div>
          <div className="col-span-6">TEAM NAME</div>
          <div className="col-span-2 text-right">TIME</div>
          <div className="col-span-2 text-right">SCORE</div>
        </div>

        <div className="divide-y divide-white/5">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.team}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${
                index === 0 ? 'bg-neon-purple/10' : ''
              }`}
            >
              <div className="col-span-2 flex justify-center">
                {entry.rank === 1 ? (
                  <Trophy className="w-6 h-6 text-yellow-400" />
                ) : entry.rank === 2 ? (
                  <Medal className="w-6 h-6 text-gray-400" />
                ) : entry.rank === 3 ? (
                  <Award className="w-6 h-6 text-orange-400" />
                ) : (
                  <span className="font-mono text-gray-500 font-bold text-lg">#{entry.rank}</span>
                )}
              </div>
              
              <div className="col-span-6">
                <span className={`font-bold text-lg ${index === 0 ? 'text-neon-purple text-glow' : 'text-gray-200'}`}>
                  {entry.team}
                </span>
              </div>
              
              <div className="col-span-2 text-right font-mono text-gray-400">
                {entry.time}
              </div>
              
              <div className="col-span-2 text-right font-mono font-bold text-neon-blue">
                {entry.score}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
