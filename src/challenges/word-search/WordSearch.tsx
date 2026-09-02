import { useState, useEffect, useCallback } from 'react';
import { generateWordSearch, type GridPosition } from '../../data/wordSearchData';
import { Play, Pause, RotateCcw, Clock, Target, CheckCircle2 } from 'lucide-react';
import ResultScreen from '../ResultScreen';
import ChallengeShell from '../../components/ChallengeShell';
import { cn } from '../../utils/cn';

export default function WordSearch() {
  const [gameState, setGameState] = useState<{
    grid: string[][];
    words: string[];
    foundWords: string[];
    selectedCells: GridPosition[];
    isDragging: boolean;
    score: number;
    timeLeft: number;
    isPlaying: boolean;
    isFinished: boolean;
  } | null>(null);

  const initGame = useCallback(() => {
    const { grid, selectedWords } = generateWordSearch();
    setGameState({
      grid,
      words: selectedWords,
      foundWords: [],
      selectedCells: [],
      isDragging: false,
      score: 0,
      timeLeft: 300, // 5 minutes
      isPlaying: true,
      isFinished: false
    });
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (!gameState || !gameState.isPlaying || gameState.isFinished) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.timeLeft <= 0) {
          clearInterval(timer);
          return { ...prev!, isFinished: true, isPlaying: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState?.isPlaying, gameState?.isFinished]);

  const handlePointerDown = (row: number, col: number) => {
    if (!gameState || !gameState.isPlaying || gameState.isFinished) return;
    setGameState(prev => ({
      ...prev!,
      isDragging: true,
      selectedCells: [{ row, col }]
    }));
  };

  const handlePointerEnter = (row: number, col: number) => {
    if (!gameState || !gameState.isDragging || !gameState.isPlaying) return;
    
    // Allow straight lines only (horizontal, vertical, diagonal)
    const startCell = gameState.selectedCells[0];
    const dr = row - startCell.row;
    const dc = col - startCell.col;
    
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const newSelected: GridPosition[] = [];
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;
      
      for (let i = 0; i <= steps; i++) {
        newSelected.push({
          row: startCell.row + i * stepR,
          col: startCell.col + i * stepC
        });
      }
      setGameState(prev => ({ ...prev!, selectedCells: newSelected }));
    }
  };

  const handlePointerUp = () => {
    if (!gameState || !gameState.isDragging) return;

    const selectedWord = gameState.selectedCells
      .map(cell => gameState.grid[cell.row][cell.col])
      .join('');
    
    const reversedSelectedWord = selectedWord.split('').reverse().join('');
    
    let newFoundWords = [...gameState.foundWords];
    let newScore = gameState.score;
    
    // Check if the selected word matches any target word
    const matchedWord = gameState.words.find(w => 
      !newFoundWords.includes(w) && (w === selectedWord || w === reversedSelectedWord)
    );

    if (matchedWord) {
      newFoundWords.push(matchedWord);
      newScore += 100; // 100 points per word
    } else if (gameState.selectedCells.length > 1) {
      newScore = Math.max(0, newScore - 10); // Penalty for wrong guess
    }

    const isFinished = newFoundWords.length === gameState.words.length;
    if (isFinished) {
      newScore += gameState.timeLeft * 2; // Time bonus
    }

    setGameState(prev => ({
      ...prev!,
      isDragging: false,
      selectedCells: [],
      foundWords: newFoundWords,
      score: newScore,
      isFinished: prev!.isFinished || isFinished,
      isPlaying: prev!.isPlaying && !isFinished
    }));
  };

  if (!gameState) return <div className="text-center text-neon-blue">LOADING SYSTEM...</div>;

  if (gameState.isFinished) {
    return (
      <ResultScreen 
        score={gameState.score}
        time={`${Math.floor((300 - gameState.timeLeft) / 60)}:${((300 - gameState.timeLeft) % 60).toString().padStart(2, '0')}`}
        stats={[
          { label: "Words Found", value: `${gameState.foundWords.length}/${gameState.words.length}` },
          { label: "Time Bonus", value: `+${gameState.timeLeft * 2}` }
        ]}
        onRestart={initGame}
      />
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCellSelected = (r: number, c: number) => 
    gameState.selectedCells.some(cell => cell.row === r && cell.col === c);

  return (
    <ChallengeShell>
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Game Info & Words */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="glass-card p-6 border-neon-purple/30">
            <h2 className="text-2xl font-bold font-mono text-white mb-6 text-glow">CSE WORD HUNT</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-bg p-4 rounded-lg border border-white/5 text-center">
                <div className="text-gray-400 text-xs font-mono mb-1">TIME LEFT</div>
                <div className="text-2xl font-bold text-neon-blue font-mono flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  {formatTime(gameState.timeLeft)}
                </div>
              </div>
              <div className="bg-dark-bg p-4 rounded-lg border border-white/5 text-center">
                <div className="text-gray-400 text-xs font-mono mb-1">SCORE</div>
                <div className="text-2xl font-bold text-neon-purple font-mono flex items-center justify-center gap-2">
                  <Target className="w-5 h-5" />
                  {gameState.score}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setGameState(prev => ({ ...prev!, isPlaying: !prev!.isPlaying }))}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors"
              >
                {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {gameState.isPlaying ? 'PAUSE' : 'RESUME'}
              </button>
              <button 
                onClick={initGame}
                className="px-4 py-3 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="glass-card p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-300 font-mono">TARGET WORDS</h3>
              <div className="text-sm font-mono text-neon-blue">{gameState.foundWords.length}/{gameState.words.length}</div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {gameState.words.map(word => {
                const isFound = gameState.foundWords.includes(word);
                return (
                  <div 
                    key={word}
                    className={cn(
                      "px-3 py-1.5 rounded text-sm font-mono transition-all duration-500 flex items-center gap-2",
                      isFound 
                        ? "bg-neon-purple/20 text-white border border-neon-purple/50" 
                        : "bg-dark-bg text-gray-500 border border-white/5"
                    )}
                  >
                    {isFound && <CheckCircle2 className="w-3 h-3 text-neon-purple" />}
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Grid */}
        <div className="lg:w-2/3">
          <div className="glass-card p-4 sm:p-8 flex items-center justify-center relative select-none">
            {!gameState.isPlaying && !gameState.isFinished && (
              <div className="absolute inset-0 z-10 bg-dark-surface/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-3xl font-bold font-mono text-white text-glow">GAME PAUSED</div>
              </div>
            )}
            
            <div 
              className="grid gap-1 sm:gap-1.5 touch-none"
              style={{ gridTemplateColumns: `repeat(${gameState.grid.length}, minmax(0, 1fr))` }}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {gameState.grid.map((row, r) => (
                row.map((char, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={cn(
                      "w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-mono font-bold rounded cursor-pointer transition-colors",
                      isCellSelected(r, c)
                        ? "bg-neon-blue/80 text-dark-bg shadow-[0_0_10px_#00f0ff]"
                        : "bg-dark-bg border border-white/5 text-gray-300 hover:bg-white/10"
                    )}
                    onPointerDown={() => handlePointerDown(r, c)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                  >
                    {char}
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
    </ChallengeShell>
  );
}
