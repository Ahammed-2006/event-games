import { Router } from 'express';
import { dbAll, dbGet, dbRun } from '../database/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/students', async (req, res) => {
  try {
    const students = await dbAll('SELECT id, name, team, status, score, last_login FROM students');
    
    // For each student, get challenge completion status
    const result = await Promise.all(students.map(async (s: any) => {
      const attempts = await dbAll('SELECT challenge_id, score, status FROM attempts WHERE student_id = ?', [s.id]);
      
      const wordSearch = attempts.find(a => a.challenge_id === 'word-search')?.score || 0;
      const imagePuzzle = attempts.find(a => a.challenge_id === 'image-puzzle')?.score || 0;
      const jigsaw = attempts.find(a => a.challenge_id === 'jigsaw')?.score || 0;
      const debugCode = attempts.find(a => a.challenge_id === 'debug-code')?.score || 0;

      return {
        id: s.id,
        name: s.name,
        team: s.team,
        status: s.status,
        score: s.score,
        wordSearch,
        imagePuzzle,
        jigsaw,
        debugCode,
        lastLogin: s.last_login
      };
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/event/start', async (req, res) => {
  await dbRun('UPDATE event_state SET event_status = ?, updated_at = CURRENT_TIMESTAMP', ['RUNNING']);
  res.json({ message: 'Event started' });
});

router.post('/event/pause', async (req, res) => {
  await dbRun('UPDATE event_state SET event_status = ?, updated_at = CURRENT_TIMESTAMP', ['PAUSED']);
  res.json({ message: 'Event paused' });
});

router.post('/event/end', async (req, res) => {
  await dbRun('UPDATE event_state SET event_status = ?, updated_at = CURRENT_TIMESTAMP', ['ENDED']);
  res.json({ message: 'Event ended' });
});

export default router;
