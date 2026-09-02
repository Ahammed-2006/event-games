import { motion } from 'framer-motion';
import { Shield, Clock, Zap, Target, Trophy } from 'lucide-react';

export default function Rules() {
  const rules = [
    {
      icon: Clock,
      title: "Time is of the Essence",
      description: "Each participant must complete the puzzle within the given time limit. The timer starts as soon as you begin the challenge."
    },
    {
      icon: Shield,
      title: "Solo Mission",
      description: "No external assistance, internet searches, or teamwork is allowed during the challenge."
    },
    {
      icon: Target,
      title: "Accuracy Matters",
      description: "Correct answers increase your score. Incorrect guesses in certain challenges may result in point deductions."
    },
    {
      icon: Zap,
      title: "Speed Bonus",
      description: "Faster completion times will reward you with bonus points added to your final score."
    },
    {
      icon: Trophy,
      title: "Ranking",
      description: "The final leaderboard determines the ranking. In case of a tie, the participant with the fastest overall time wins."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-mono text-glow text-white">Event Rules</h1>
        <p className="text-gray-400 font-mono">./read_manual --strict</p>
      </div>

      <div className="space-y-6">
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 flex gap-6 items-start hover:border-neon-purple/30 transition-colors group"
            >
              <div className="p-4 rounded-lg bg-dark-bg/50 border border-white/5 text-neon-purple group-hover:text-neon-blue transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white font-mono">{index + 1}. {rule.title}</h3>
                <p className="text-gray-400 leading-relaxed">{rule.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
