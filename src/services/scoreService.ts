export type StudentStatus = 'completed' | 'in-progress' | 'not-started' | 'banned';

export interface StudentScore {
  id: string;
  name: string;
  team: string;
  score: number;
  wordSearch: number;
  imagePuzzle: number;
  jigsaw: number;
  status: StudentStatus;
  time: string;
  lastUpdated: number; // epoch ms
}

// ── Initial / baseline data ─────────────────────────────────────────────────
const BASELINE: StudentScore[] = [
  { id: '2', name: 'Alice Kumar',   team: 'Team Alpha',    score: 1850, wordSearch: 950, imagePuzzle: 700, jigsaw: 200, status: 'completed',   time: '08:45', lastUpdated: Date.now() },
  { id: '3', name: 'Bob Rajan',     team: 'Code Warriors', score: 1720, wordSearch: 870, imagePuzzle: 650, jigsaw: 200, status: 'completed',   time: '09:12', lastUpdated: Date.now() },
  { id: '4', name: 'Carol Nair',    team: 'Debug Masters', score: 1650, wordSearch: 850, imagePuzzle: 500, jigsaw: 300, status: 'in-progress', time: '—',     lastUpdated: Date.now() },
  { id: '5', name: 'Dev Sharma',    team: 'Runtime Error', score: 1540, wordSearch: 740, imagePuzzle: 600, jigsaw: 200, status: 'completed',   time: '10:15', lastUpdated: Date.now() },
  { id: '6', name: 'Eva Pillai',    team: 'Bit Squad',     score:  980, wordSearch: 680, imagePuzzle: 300, jigsaw:   0, status: 'in-progress', time: '—',     lastUpdated: Date.now() },
  { id: '7', name: 'Frank Thomas',  team: 'Null Pointers', score:    0, wordSearch:   0, imagePuzzle:   0, jigsaw:   0, status: 'not-started', time: '—',     lastUpdated: Date.now() },
  { id: '8', name: 'Grace Iyer',    team: 'Async Squad',   score:  420, wordSearch: 420, imagePuzzle:   0, jigsaw:   0, status: 'in-progress', time: '—',     lastUpdated: Date.now() },
  { id: '9', name: 'Harish Menon',  team: 'Stack Overflow',score:  320, wordSearch: 200, imagePuzzle: 120, jigsaw:   0, status: 'in-progress', time: '—',     lastUpdated: Date.now() },
];

let _currentData: StudentScore[] = BASELINE.map(s => ({ ...s }));

// ── Simulate server-side score progression ──────────────────────────────────
function simulateTick(data: StudentScore[]): StudentScore[] {
  return data.map(s => {
    if (s.status === 'completed' || s.status === 'banned') return s;
    if (s.status === 'not-started' && Math.random() < 0.15) {
      // 15% chance a not-started student begins
      return { ...s, status: 'in-progress', lastUpdated: Date.now() };
    }
    if (s.status === 'in-progress') {
      const delta = Math.random() < 0.6 ? Math.floor(Math.random() * 120) : 0;
      if (delta === 0) return s;
      const newWs  = Math.min(s.wordSearch  + (Math.random() < 0.4 ? delta : 0), 1500);
      const newIp  = Math.min(s.imagePuzzle + (Math.random() < 0.35 ? Math.floor(delta * 0.6) : 0), 500);
      const newJig = Math.min(s.jigsaw      + (Math.random() < 0.25 ? Math.floor(delta * 0.4) : 0), 400);
      const newScore = newWs + newIp + newJig;

      // ~8% chance to finish each poll
      const finished = Math.random() < 0.08;
      if (finished) {
        const mins = Math.floor(Math.random() * 12) + 3;
        const secs = Math.floor(Math.random() * 60);
        return { ...s, status: 'completed', score: newScore, wordSearch: newWs, imagePuzzle: newIp, jigsaw: newJig, time: `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`, lastUpdated: Date.now() };
      }
      return { ...s, score: newScore, wordSearch: newWs, imagePuzzle: newIp, jigsaw: newJig, lastUpdated: Date.now() };
    }
    return s;
  });
}

/**
 * Fetch current scores.
 * In production: replace with  fetch('/api/scores')  or a WebSocket message.
 */
export async function fetchScores(): Promise<StudentScore[]> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
  _currentData = simulateTick(_currentData);
  return _currentData.map(s => ({ ...s }));
}

/**
 * Overwrite data externally (e.g. after admin reset/ban).
 */
export function overrideScores(data: StudentScore[]) {
  _currentData = data.map(s => ({ ...s }));
}

export { BASELINE };
