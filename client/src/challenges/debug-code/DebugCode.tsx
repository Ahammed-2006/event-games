import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEBUG_QUESTIONS } from '../../data/debugCodeData';
import ChallengeShell from '../../components/ChallengeShell';
import ResultScreen from '../ResultScreen';
import {
  Clock, Lightbulb, CheckCircle2, XCircle,
  ChevronRight, RotateCcw, Terminal
} from 'lucide-react';

const TIME_LIMIT = 360; // 6 minutes total
const LANG_COLOR: Record<string, string> = {
  python:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  javascript: 'text-yellow-300 bg-yellow-300/10 border-yellow-300/30',
  c:          'text-neon-blue  bg-neon-blue/10  border-neon-blue/30',
  sql:        'text-neon-purple bg-neon-purple/10 border-neon-purple/30',
};

/** Normalize code for comparison: trim lines, collapse whitespace */
function normalize(code: string) {
  return code.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
}

/** Slide direction variants */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center:               ({ x: 0, opacity: 1 }),
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function DebugCode() {
  const [idx, setIdx]           = useState(0);
  const [direction, setDir]     = useState(1);
  const [userCode, setUserCode] = useState(DEBUG_QUESTIONS[0].brokenCode);
  const [submitted, setSubmitted]   = useState(false);
  const [isCorrect, setIsCorrect]   = useState(false);
  const [showHint, setShowHint]     = useState(false);
  const [hintsUsed, setHintsUsed]   = useState(0);
  const [score, setScore]           = useState(0);
  const [timeLeft, setTimeLeft]     = useState(TIME_LIMIT);
  const [isPlaying, setIsPlaying]   = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults]       = useState<boolean[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer
  useEffect(() => {
    if (!isPlaying || isFinished) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setIsFinished(true); setIsPlaying(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, isFinished]);

  // Reset editor when question changes
  useEffect(() => {
    setUserCode(DEBUG_QUESTIONS[idx].brokenCode);
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    textareaRef.current?.focus();
  }, [idx]);

  const handleSubmit = () => {
    if (submitted) return;
    const q = DEBUG_QUESTIONS[idx];
    const correct = normalize(userCode) === normalize(q.correctCode);
    setIsCorrect(correct);
    setSubmitted(true);
    setResults(prev => [...prev, correct]);

    if (correct) {
      const hintPenalty = showHint ? 25 : 0;
      setScore(s => s + q.points - hintPenalty);
    }
  };

  const handleNext = () => {
    const next = idx + 1;
    if (next >= DEBUG_QUESTIONS.length) {
      setIsFinished(true);
      setIsPlaying(false);
      // Submit to backend
      import('../../services/api').then(({ api }) => {
        api.submitChallenge('debug-code', { score }).catch(console.error);
      });
    } else {
      setDir(1);
      setIdx(next);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed(h => h + 1);
  };

  const handleRestart = () => {
    setIdx(0); setDir(1); setScore(0);
    setTimeLeft(TIME_LIMIT); setIsPlaying(true);
    setIsFinished(false); setResults([]);
    setSubmitted(false); setIsCorrect(false); setShowHint(false);
  };

  if (isFinished) {
    const correct = results.filter(Boolean).length;
    return (
      <ResultScreen
        score={score}
        time={`${Math.floor((TIME_LIMIT - timeLeft) / 60)}:${((TIME_LIMIT - timeLeft) % 60).toString().padStart(2, '0')}`}
        stats={[
          { label: 'Fixed Correctly', value: `${correct}/${DEBUG_QUESTIONS.length}` },
          { label: 'Hints Used', value: String(hintsUsed) },
        ]}
        onRestart={handleRestart}
      />
    );
  }

  const q = DEBUG_QUESTIONS[idx];
  const langClass = LANG_COLOR[q.language] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isWarning = timeLeft <= 60;

  return (
    <ChallengeShell>
      <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-4">

        {/* Top bar */}
        <div className="glass-card p-3 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-neon-purple" />
            <h1 className="text-lg sm:text-xl font-bold font-mono text-white">DEBUG THE CODE</h1>
            {/* Question dots */}
            <div className="flex items-center gap-1.5 ml-2">
              {DEBUG_QUESTIONS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                  i < results.length
                    ? results[i] ? 'bg-terminal-green' : 'bg-red-500'
                    : i === idx ? 'bg-neon-purple scale-125' : 'bg-white/20'
                }`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-xl font-bold font-mono ${isWarning ? 'text-red-400 animate-pulse' : 'text-neon-blue'}`}>
              <Clock className="inline w-4 h-4 mr-1 -mt-0.5" />
              {formatTime(timeLeft)}
            </div>
            <div className="text-xl font-bold font-mono text-neon-purple">{score} pts</div>
            <button onClick={handleRestart} className="p-2 rounded-lg bg-dark-bg border border-white/10 text-gray-400 hover:text-red-400 transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding question panel */}
        <div className="relative min-h-[900px] md:min-h-[500px] lg:min-h-[550px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={idx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="md:absolute md:inset-0 w-full"
            >
              <div className="grid md:grid-cols-2 gap-4 h-full">

                {/* Left: question info */}
                <div className="space-y-4">
                  <div className="glass-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${langClass}`}>
                        {q.language.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        Question {idx + 1} / {DEBUG_QUESTIONS.length}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-mono">{q.title}</h2>
                    <p className="text-gray-400 leading-relaxed">{q.description}</p>
                    <div className="text-xs font-mono text-neon-purple">+{q.points} pts on correct fix</div>
                  </div>

                  {/* Hint */}
                  <div className="glass-card p-4">
                    {showHint ? (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 text-yellow-400">
                        <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed">{q.hint}</p>
                      </motion.div>
                    ) : (
                      <button onClick={handleHint} disabled={submitted}
                        className="flex items-center gap-2 text-sm text-yellow-400/70 hover:text-yellow-400 font-mono transition-colors disabled:opacity-30">
                        <Lightbulb className="w-4 h-4" />
                        Show Hint <span className="text-xs text-yellow-600 ml-1">(-25 pts)</span>
                      </button>
                    )}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {submitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`glass-card p-4 flex items-center justify-between ${
                          isCorrect ? 'border-terminal-green/40 bg-terminal-green/5' : 'border-red-500/40 bg-red-500/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCorrect
                            ? <CheckCircle2 className="w-6 h-6 text-terminal-green" />
                            : <XCircle     className="w-6 h-6 text-red-400" />}
                          <div>
                            <p className={`font-bold font-mono ${isCorrect ? 'text-terminal-green' : 'text-red-400'}`}>
                              {isCorrect ? `✓ CORRECT! +${q.points - (showHint ? 25 : 0)} pts` : '✗ Not quite right'}
                            </p>
                            {!isCorrect && (
                              <p className="text-gray-500 text-xs mt-0.5">Compare your code with the expected fix.</p>
                            )}
                          </div>
                        </div>
                        <button onClick={handleNext}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neon-purple/20 border border-neon-purple/40 text-neon-purple font-mono text-sm hover:bg-neon-purple/30 transition-colors">
                          {idx < DEBUG_QUESTIONS.length - 1 ? 'Next' : 'Finish'}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: code editor */}
                <div className="flex flex-col gap-3">
                  {/* Editor header */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] rounded-t-lg border border-white/10 border-b-0">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-gray-500 text-xs font-mono ml-2">
                      fix_the_bug.{q.language === 'javascript' ? 'js' : q.language === 'sql' ? 'sql' : q.language === 'c' ? 'c' : 'py'}
                    </span>
                  </div>

                  {/* Editor body with line numbers */}
                  <div className="relative flex-1 bg-[#1e1e1e] border border-white/10 rounded-b-lg overflow-hidden min-h-[280px] md:min-h-[300px]">
                    {/* Line numbers */}
                    <div className="absolute top-0 left-0 bottom-0 w-10 bg-[#1e1e1e] border-r border-white/5 flex flex-col items-end pr-2 pt-3 z-10 select-none pointer-events-none">
                      {userCode.split('\n').map((_, i) => (
                        <span key={i} className="text-gray-600 font-mono text-xs leading-[1.6rem]">{i + 1}</span>
                      ))}
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={userCode}
                      onChange={e => !submitted && setUserCode(e.target.value)}
                      readOnly={submitted}
                      spellCheck={false}
                      className="absolute inset-0 w-full h-full bg-transparent text-gray-100 font-mono text-sm leading-[1.6rem] resize-none focus:outline-none pl-12 pr-4 pt-3 pb-3 caret-neon-purple"
                      style={{ tabSize: 4 }}
                      onKeyDown={e => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const s = e.currentTarget;
                          const start = s.selectionStart;
                          const end   = s.selectionEnd;
                          const next  = userCode.substring(0, start) + '    ' + userCode.substring(end);
                          setUserCode(next);
                          requestAnimationFrame(() => {
                            s.selectionStart = s.selectionEnd = start + 4;
                          });
                        }
                      }}
                    />
                    {submitted && isCorrect && (
                      <div className="absolute inset-0 bg-terminal-green/5 pointer-events-none border border-terminal-green/30 rounded-b-lg" />
                    )}
                    {submitted && !isCorrect && (
                      <div className="absolute inset-0 bg-red-500/5 pointer-events-none border border-red-500/30 rounded-b-lg" />
                    )}
                  </div>

                  {/* Submit button */}
                  {!submitted && (
                    <button onClick={handleSubmit}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold font-mono tracking-wider hover:opacity-90 active:scale-95 transition-all">
                      SUBMIT FIX
                    </button>
                  )}

                  {/* Expected answer (shown after wrong attempt) */}
                  <AnimatePresence>
                    {submitted && !isCorrect && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="glass-card p-3 overflow-hidden">
                        <p className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Expected Fix</p>
                        <pre className="text-xs font-mono text-terminal-green whitespace-pre-wrap">{q.correctCode}</pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </ChallengeShell>
  );
}
