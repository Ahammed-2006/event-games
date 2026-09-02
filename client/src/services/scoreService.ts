import { api } from './api';

export type StudentStatus = 'completed' | 'in-progress' | 'not-started' | 'banned';

export interface StudentScore {
  id: string;
  name: string;
  team: string;      // comma-separated member names
  score: number;
  wordSearch: number;
  imagePuzzle: number;
  jigsaw: number;
  jigsawTime: number;
  debugCode: number;
  status: StudentStatus;
  time: string;
  lastUpdated: number;
}

export async function fetchScores(): Promise<StudentScore[]> {
  try {
    const students = await api.getAdminStudents();
    return students.map((s: any) => ({
      id: s.id,
      name: s.name,
      team: s.team,
      score: s.score,
      wordSearch: s.wordSearch,
      imagePuzzle: s.imagePuzzle,
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


