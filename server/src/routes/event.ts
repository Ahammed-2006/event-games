import { Router } from 'express';
import { dbGet } from '../database/db';

const router = Router();

router.get('/state', async (req, res) => {
  try {
    const state = await dbGet('SELECT * FROM event_state ORDER BY id DESC LIMIT 1');
    res.json({ event_status: state?.event_status || 'WAITING' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
