export type StudentStatus = 'completed' | 'in-progress' | 'not-started' | 'banned';

export interface StudentScore {
  id: string;
  name: string;
  team: string;      // comma-separated member names
  score: number;
  wordSearch: number;
  jigsaw: number;
  jigsawTime: number;
  debugCode: number;
  status: StudentStatus;
  time: string;
  lastUpdated: number;
}

export async function fetchScores(): Promise<StudentScore[]> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/event/leaderboard`);
    const students = await res.json();
    return students.map((s: any) => ({
      id: s.id,
      name: s.name,
      team: s.team,
      score: s.score,
      wordSearch: s.wordSearch,
      jigsaw: s.jigsaw,
      jigsawTime: s.jigsawTime || 0,
      debugCode: s.debugCode,
      status: s.status,
      time: s.lastLogin || '—',
      lastUpdated: Date.now()
    }));
  } catch (error) {
    console.error('Failed to fetch scores', error);
    return [];
  }
}


