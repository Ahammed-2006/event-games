import { Router } from 'express';
import { dbGet, dbRun } from '../database/db';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';
// Removed uuid import

const router = Router();
router.use(authenticate, requireStudent);

const updateStudentScore = async (studentId: string) => {
  const sum = await dbGet('SELECT SUM(score) as total FROM attempts WHERE student_id = ?', [studentId]);
  const total = sum.total || 0;
  await dbRun('UPDATE students SET score = ? WHERE id = ?', [total, studentId]);
};

// Word Search Submission
router.post('/word-search/submit', async (req, res) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { foundWords, timeLeft } = authReq.body;
    // Server-side validation: the client just sends the words found
    const targetWords = [
      "ALGORITHM", "GRAPH", "TREE", "POINTER", "ARRAY", "OBJECT", "CLASS", 
      "VARIABLE", "FUNCTION", "LOOP", "LOGIC", "HEURISTIC", "TURING", "AUTOMATA", 
      "COMPILER", "BOOLEAN", "MATRIX", "VECTOR", "STACK", "QUEUE", "RECURSION", 
      "HASHING", "SORTING", "SEARCHING", "PARSING"
    ];

    let score = 0;
    let actualFound = 0;
    for (const w of foundWords) {
      if (targetWords.includes(w)) {
        score += 2;  // 2 pts per word, 10 words = 20 max
        actualFound++;
      }
    }

    const attemptId = Date.now().toString() + Math.floor(Math.random()*1000);
    await dbRun('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
      [attemptId, authReq.user?.id, 'word-search', score, 'completed']);

    await updateStudentScore(authReq.user?.id as string);
    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Jigsaw Submission
router.post('/jigsaw/submit', async (req, res) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { score, timeTaken } = authReq.body;
    const attemptId = Date.now().toString() + Math.floor(Math.random()*1000);
    await dbRun('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at, time_taken) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)', 
      [attemptId, authReq.user?.id, 'jigsaw', score, 'completed', timeTaken || 0]);
      
    await updateStudentScore(authReq.user?.id as string);
    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug Code Submission
router.post('/debug-code/submit', async (req, res) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { score } = authReq.body;
    const attemptId = Date.now().toString() + Math.floor(Math.random()*1000);
    await dbRun('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
      [attemptId, authReq.user?.id, 'debug-code', score, 'completed']);
      
    await updateStudentScore(authReq.user?.id as string);
    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
