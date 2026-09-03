import { Router } from 'express';
import bcrypt from 'bcrypt';
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

router.post('/event/toggle-game', async (req, res) => {
  try {
    const { gameId, locked } = req.body;
    let column = '';
    if (gameId === 'word-search') column = 'word_search_locked';
    else if (gameId === 'jigsaw') column = 'jigsaw_locked';
    else if (gameId === 'debug-code') column = 'debug_code_locked';
    else return res.status(400).json({ error: 'Invalid game ID' });

    await dbRun(`UPDATE event_state SET ${column} = ?, updated_at = CURRENT_TIMESTAMP`, [locked ? 1 : 0]);
    res.json({ message: 'Game lock state updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { studentId, newPassword } = req.body;
    if (!studentId || !newPassword) return res.status(400).json({ error: 'Missing fields' });
    if (newPassword.length < 4) return res.status(400).json({ error: 'Password too short' });

    const hash = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE students SET password_hash = ? WHERE id = ?', [hash, studentId]);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
