import { useState, useEffect } from 'react';
import { IMAGE_PUZZLES } from '../../data/imagePuzzleData';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import ResultScreen from '../ResultScreen';
import ChallengeShell from '../../components/ChallengeShell';
import { cn } from '../../utils/cn';

export default function ImagePuzzle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  useEffect(() => {
    if (!isPlaying || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setIsFinished(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isFinished]);

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback || !isPlaying) return;
    
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
    
    const isCorrect = optionIndex === IMAGE_PUZZLES[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 100);
    }

    setTimeout(() => {
      if (currentIndex < IMAGE_PUZZLES.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setIsFinished(true);
        setIsPlaying(false);
        // Submit to backend asynchronously
        const finalScore = isCorrect ? score + 100 : score;
        import('../../services/api').then(({ api }) => {
          api.submitChallenge('image-puzzle', { score: finalScore }).catch(console.error);
        });
      }
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setDirection(1);
    setScore(0);
    setTimeLeft(180);
    setIsPlaying(true);
    setIsFinished(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (isFinished) {
    return (
      <ResultScreen 
        score={score}
        time={`${Math.floor((180 - timeLeft) / 60)}:${((180 - timeLeft) % 60).toString().padStart(2, '0')}`}
        stats={[
          { label: "Questions Answered", value: `${currentIndex + (showFeedback ? 1 : 0)}/${IMAGE_PUZZLES.length}` },
          { label: "Accuracy", value: `${Math.round((score / (IMAGE_PUZZLES.length * 100)) * 100)}%` }
        ]}
        onRestart={handleRestart}
      />
    );
  }

  const currentPuzzle = IMAGE_PUZZLES[currentIndex];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ChallengeShell>
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col gap-8">
        
        {/* Top Bar */}
        <div className="glass-card p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-gray-400 font-mono text-sm border border-white/10 px-3 py-1 rounded-md bg-dark-bg">
              PUZZLE {currentIndex + 1} OF {IMAGE_PUZZLES.length}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-bold font-mono text-neon-blue">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-bold font-mono text-neon-purple">{score}</span>
            </div>
          </div>
        </div>

        {/* Puzzle Content — slides in from right */}
        <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0"
            >
        <div className="grid md:grid-cols-2 gap-8 h-full">
          {/* Left: Image Container */}
          <div className="glass-card p-6 flex items-center justify-center min-h-[400px] border-neon-blue/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 to-transparent pointer-events-none"></div>
            <img 
              src={currentPuzzle.image} 
              alt="Challenge" 
              className="max-w-full max-h-full object-contain rounded border border-white/10 shadow-2xl"
            />
            
            {/* Scanner line effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/50 shadow-[0_0_15px_#00f0ff] animate-[shimmer_2s_infinite]"></div>
          </div>

          {/* Right: Question & Options */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                {currentPuzzle.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentPuzzle.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentPuzzle.correctAnswer;
                
                let stateClass = "bg-dark-surface border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/30";
                
                if (showFeedback) {
                  if (isCorrect) {
                    stateClass = "bg-green-500/20 border-green-500/50 text-green-400";
                  } else if (isSelected && !isCorrect) {
                    stateClass = "bg-red-500/20 border-red-500/50 text-red-400";
                  } else {
                    stateClass = "bg-dark-surface border-white/5 text-gray-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback || !isPlaying}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between",
                      stateClass
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono font-bold w-6 text-gray-500">
                        {String.fromCharCode(65 + index)}.
                      </div>
                      <span className="font-medium text-lg">{option}</span>
                    </div>
                    
                    <AnimatePresence>
                      {showFeedback && isCorrect && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </motion.div>
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <XCircle className="w-6 h-6 text-red-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
            
            <AnimatePresence>
              {showFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-lg text-center font-bold font-mono tracking-wider",
                    selectedAnswer === currentPuzzle.correctAnswer 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  )}
                >
                  {selectedAnswer === currentPuzzle.correctAnswer 
                    ? "✓ CORRECT! +100 POINTS" 
                    : "✗ INCORRECT"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </div>
    </ChallengeShell>
  );
}
