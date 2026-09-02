import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCcw, Shuffle, CheckCircle } from 'lucide-react';
import ResultScreen from '../ResultScreen';
import ChallengeShell from '../../components/ChallengeShell';

const GRID_COLS = 4;
const GRID_ROWS = 4;
const TOTAL_PIECES = GRID_COLS * GRID_ROWS;
const JIGSAW_IMAGE = '/jigsaw-osi.png';
const TIME_LIMIT = 240; // 4 minutes

interface Piece {
  id: number;           // correct index (0 = top-left)
  currentPos: number;   // current slot index
  solved: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function JigsawPuzzle() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [moves, setMoves] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initPieces = useCallback(() => {
    const ids = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
    const shuffled = shuffle(ids);
    setPieces(shuffled.map((id, pos) => ({ id, currentPos: pos, solved: id === pos })));
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
    setIsPlaying(true);
    setIsFinished(false);
    setMoves(0);
  }, []);

  useEffect(() => { initPieces(); }, [initPieces]);

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

  const handleClick = (slotIndex: number) => {
    if (!isPlaying || isFinished) return;
    if (selected === null) {
      setSelected(slotIndex);
    } else {
      if (selected === slotIndex) { setSelected(null); return; }
      // Swap pieces in the two selected slots
      setPieces(prev => {
        const next = [...prev];
        // Find pieces currently at these slot positions
        const idxA = next.findIndex(p => p.currentPos === selected);
        const idxB = next.findIndex(p => p.currentPos === slotIndex);
        if (idxA === -1 || idxB === -1) return prev;
        next[idxA] = { ...next[idxA], currentPos: slotIndex, solved: next[idxA].id === slotIndex };
        next[idxB] = { ...next[idxB], currentPos: selected, solved: next[idxB].id === selected };
        return next;
      });
      setMoves(m => m + 1);
      setSelected(null);
    }
  };

  // Check completion
  useEffect(() => {
    if (pieces.length && pieces.every(p => p.solved)) {
      setTimeout(() => { 
        setIsFinished(true); 
        setIsPlaying(false); 
        // Submit to backend
        const solvedCount = pieces.filter(p => p.solved).length;
        const score = Math.round((solvedCount / TOTAL_PIECES) * 300) + Math.round((timeLeft / TIME_LIMIT) * 100);
        import('../../services/api').then(({ api }) => {
          api.submitChallenge('jigsaw', { 
            score, 
            timeTaken: TIME_LIMIT - timeLeft 
          }).catch(console.error);
        });
      }, 400);
    }
  }, [pieces]);

  if (isFinished) {
    const solvedCount = pieces.filter(p => p.solved).length;
    const score = Math.round((solvedCount / TOTAL_PIECES) * 300) + Math.round((timeLeft / TIME_LIMIT) * 100);
    return (
      <ResultScreen
        score={score}
        time={`${Math.floor((TIME_LIMIT - timeLeft) / 60)}:${((TIME_LIMIT - timeLeft) % 60).toString().padStart(2, '0')}`}
        stats={[
          { label: 'Pieces Placed', value: `${solvedCount}/${TOTAL_PIECES}` },
          { label: 'Total Moves', value: String(moves) },
        ]}
        onRestart={initPieces}
      />
    );
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isWarning = timeLeft <= 30;

  // Piece at a given slot
  const pieceAt = (slot: number) => pieces.find(p => p.currentPos === slot);

  return (
    <ChallengeShell>
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-4">
      {/* Stats bar */}
      <div className="glass-card p-3 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-white">CSE JIGSAW PUZZLE</h2>
          <p className="text-gray-500 text-xs font-mono">OSI Network Model · Click two pieces to swap</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-xl sm:text-2xl font-bold font-mono ${isWarning ? 'text-red-400 animate-pulse' : 'text-neon-blue'}`}>
              <Clock className="inline w-4 h-4 mr-1 -mt-0.5" />{formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500 font-mono">TIME</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-neon-purple">{moves}</div>
            <div className="text-xs text-gray-500 font-mono">MOVES</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-yellow-400">
              {pieces.filter(p => p.solved).length}/{TOTAL_PIECES}
            </div>
            <div className="text-xs text-gray-500 font-mono">PLACED</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={initPieces}
              title="Restart"
              className="p-2 rounded-lg bg-dark-bg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPieces(p => { const n = [...p]; const ids = shuffle(n.map(x => x.id)); return n.map((_, i) => ({ id: ids[i], currentPos: i, solved: ids[i] === i })); })}
              title="Shuffle"
              className="p-2 rounded-lg bg-dark-bg border border-white/10 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Puzzle grid */}
        <div
          ref={containerRef}
          className="glass-card p-3 sm:p-4 flex-1 flex items-center justify-center border border-white/10"
        >
          <div
            className="relative select-none"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gap: '3px',
              width: '100%',
              maxWidth: '480px',
              aspectRatio: '1',
            }}
          >
            {/* Hidden image to verify load */}
            <img
              src={JIGSAW_IMAGE}
              alt="preload"
              className="hidden"
              onLoad={() => setImageLoaded(true)}
            />

            {Array.from({ length: TOTAL_PIECES }, (_, slotIdx) => {
              const piece = pieceAt(slotIdx);
              const isSelected = selected === slotIdx;
              const row = piece ? Math.floor(piece.id / GRID_COLS) : 0;
              const col = piece ? piece.id % GRID_COLS : 0;

              return (
                <div
                  key={slotIdx}
                  onClick={() => handleClick(slotIdx)}
                  className={`
                    relative overflow-hidden cursor-pointer transition-all duration-200 rounded-sm
                    ${isSelected ? 'ring-2 ring-neon-blue shadow-[0_0_12px_#00f0ff] scale-95 z-10' : ''}
                    ${piece?.solved ? 'ring-1 ring-terminal-green/50' : ''}
                  `}
                  style={{ aspectRatio: '1' }}
                >
                  {piece && imageLoaded ? (
                    <div
                      style={{
                        width: `${GRID_COLS * 100}%`,
                        height: `${GRID_ROWS * 100}%`,
                        backgroundImage: `url(${JIGSAW_IMAGE})`,
                        backgroundSize: '100% 100%',
                        transform: `translate(-${col * (100 / GRID_COLS)}%, -${row * (100 / GRID_ROWS)}%)`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-bg animate-pulse" />
                  )}

                  {/* Solved check */}
                  <AnimatePresence>
                    {piece?.solved && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="w-4 h-4 rounded-full bg-terminal-green/80 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-dark-bg" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reference image */}
        <div className="lg:w-56 flex flex-col gap-4">
          <div className="glass-card p-3 sm:p-4">
            <p className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Reference Image</p>
            <img
              src={JIGSAW_IMAGE}
              alt="Reference"
              className="w-full rounded-md opacity-80 hover:opacity-100 transition-opacity border border-white/10"
            />
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-widest">Scoring</p>
            <div className="space-y-2 text-xs font-mono text-gray-400">
              <div className="flex justify-between"><span>Correct piece</span><span className="text-neon-purple">+18.75 pts</span></div>
              <div className="flex justify-between"><span>Time bonus</span><span className="text-neon-blue">up to 100</span></div>
              <div className="flex justify-between"><span>Full solve</span><span className="text-yellow-400">300 pts max</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ChallengeShell>
  );
}
