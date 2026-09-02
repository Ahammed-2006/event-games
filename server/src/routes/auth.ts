import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun } from '../database/db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Helper to generate token
const generateToken = (payload: any) => jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

router.post('/student/register', async (req, res) => {
  try {
    const { studentId, name, team, password } = req.body;
    if (!studentId || !name || !team || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingId = await dbGet('SELECT id FROM students WHERE id = ?', [studentId]);
    if (existingId) {
      return res.status(400).json({ error: 'Student/Team ID already registered' });
    }
    const existingName = await dbGet('SELECT id FROM students WHERE name = ? COLLATE NOCASE', [name]);
    if (existingName) {
      return res.status(400).json({ error: 'Team name already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    await dbRun(
      'INSERT INTO students (id, name, team, password_hash) VALUES (?, ?, ?, ?)',
      [studentId, name, team, hash]
    );

    const token = generateToken({ id: studentId, role: 'student', name, team });
    res.json({ token, student: { id: studentId, name, team } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/student/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ error: 'Team name and password are required' });
    }

    // `studentId` from the client is actually the Team Name (`name` column) for teams
    const student = await dbGet('SELECT * FROM students WHERE id = ? OR name = ? COLLATE NOCASE', [studentId, studentId]);
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await dbRun('UPDATE students SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [student.id]);

    const token = generateToken({ id: student.id, role: 'student', name: student.name, team: student.team });
    res.json({ token, student: { id: student.id, name: student.name, team: student.team, score: student.score } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Simple static admin check
    if (username === 'admin' && password === ADMIN_PASSWORD) {
      const token = generateToken({ id: 'admin', role: 'admin' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
