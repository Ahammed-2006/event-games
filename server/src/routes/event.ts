import { Router } from 'express';
import { dbGet } from '../database/db';

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

export default router;
