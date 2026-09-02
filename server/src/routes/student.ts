import { Router } from 'express';
import { dbAll, dbGet } from '../database/db';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireStudent);

router.get('/profile', async (req, res) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const student = await dbGet('SELECT id, name, team, status, score FROM students WHERE id = ?', [authReq.user?.id]);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/progress', async (req, res) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const attempts = await dbAll('SELECT challenge_id, score, status FROM attempts WHERE student_id = ?', [authReq.user?.id]);
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
