import { Router } from 'express';
import { dbGet, dbAll } from '../database/db';

const router = Router();

router.get('/state', async (req, res) => {
  // Prevent all caching so clients always get fresh lock state
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const state = await dbGet('SELECT * FROM event_state ORDER BY id DESC LIMIT 1');
    res.json({ 
      event_status: state?.event_status || 'WAITING',
      word_search_locked: !!state?.word_search_locked,
      jigsaw_locked: !!state?.jigsaw_locked,
      debug_code_locked: !!state?.debug_code_locked
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const students = await dbAll('SELECT id, name, team, status, score, last_login FROM students');
    const attempts = await dbAll('SELECT student_id, challenge_id, score, time_taken FROM attempts');
    
    const result = students.map((s: any) => {
      const studentAttempts = attempts.filter((a: any) => a.student_id === s.id);
      
      const wordSearch = studentAttempts.find((a: any) => a.challenge_id === 'word-search')?.score || 0;
      const jigsawAttempt = studentAttempts.find((a: any) => a.challenge_id === 'jigsaw');
      const jigsaw = jigsawAttempt?.score || 0;
      const jigsawTime = jigsawAttempt?.time_taken || 0;
      const debugCode = studentAttempts.find((a: any) => a.challenge_id === 'debug-code')?.score || 0;

      return {
        id: s.id,
        name: s.name,
        team: s.team,
        status: s.status,
        score: wordSearch + jigsaw + debugCode,
        wordSearch,
        jigsaw,
        jigsawTime,
        debugCode,
        lastLogin: s.last_login
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
