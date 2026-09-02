import { Router } from 'express';
import { dbAll, dbGet, dbRun } from '../database/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/students', async (req, res) => {
  try {
    const students = await dbAll('SELECT id, name, team, status, score, last_login FROM students');
    const attempts = await dbAll('SELECT student_id, challenge_id, score, time_taken FROM attempts');
    
    const result = students.map((s: any) => {
      const studentAttempts = attempts.filter((a: any) => a.student_id === s.id);
      
      const wordSearch = studentAttempts.find((a: any) => a.challenge_id === 'word-search')?.score || 0;
      const imagePuzzle = studentAttempts.find((a: any) => a.challenge_id === 'image-puzzle')?.score || 0;
      const jigsawAttempt = studentAttempts.find((a: any) => a.challenge_id === 'jigsaw');
      const jigsaw = jigsawAttempt?.score || 0;
      const jigsawTime = jigsawAttempt?.time_taken || 0;
      const debugCode = studentAttempts.find((a: any) => a.challenge_id === 'debug-code')?.score || 0;

      return {
        id: s.id,
        name: s.name,
        team: s.team,
        status: s.status,
        score: s.score,
        wordSearch,
        imagePuzzle,
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

router.post('/event/reset', async (req, res) => {
  try {
    await dbRun('DELETE FROM attempts');
    await dbRun("UPDATE students SET score = 0, status = 'not-started'");
    res.json({ message: 'Event reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset event' });
  }
});

export default router;
