"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const auth_1 = require("../middleware/auth");
// Removed uuid import
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, auth_1.requireStudent);
const updateStudentScore = async (studentId) => {
    const sum = await (0, db_1.dbGet)('SELECT SUM(score) as total FROM attempts WHERE student_id = ?', [studentId]);
    const total = sum.total || 0;
    await (0, db_1.dbRun)('UPDATE students SET score = ? WHERE id = ?', [total, studentId]);
};
// Word Search Submission
router.post('/word-search/submit', async (req, res) => {
    const authReq = req;
    try {
        const { foundWords, timeLeft } = authReq.body;
        // Server-side validation: the client just sends the words found
        const targetWords = [
            "DEBUG", "BUG", "ERROR", "POINTER", "ARRAY", "OBJECT", "CLASS",
            "PYTHON", "JAVA", "SCRIPT", "API", "SERVER", "CLIENT", "DATABASE",
            "NETWORK", "ALGORITHM", "COMPILER", "RUNTIME", "MEMORY", "THREAD",
            "PROCESS", "BINARY", "STACK", "QUEUE", "RECURSION"
        ];
        let score = 0;
        let actualFound = 0;
        for (const w of foundWords) {
            if (targetWords.includes(w)) {
                score += 100;
                actualFound++;
            }
        }
        // Check if fully finished (assuming 10 words per game like frontend generation)
        if (actualFound === 10) {
            score += (timeLeft || 0) * 2;
        }
        const attemptId = Date.now().toString() + Math.floor(Math.random() * 1000);
        await (0, db_1.dbRun)('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', [attemptId, authReq.user?.id, 'word-search', score, 'completed']);
        await updateStudentScore(authReq.user?.id);
        res.json({ success: true, score });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Image Puzzle Submission
router.post('/image-puzzle/submit', async (req, res) => {
    const authReq = req;
    try {
        const { score } = authReq.body;
        const attemptId = Date.now().toString() + Math.floor(Math.random() * 1000);
        await (0, db_1.dbRun)('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', [attemptId, authReq.user?.id, 'image-puzzle', score, 'completed']);
        await updateStudentScore(authReq.user?.id);
        res.json({ success: true, score });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Jigsaw Submission
router.post('/jigsaw/submit', async (req, res) => {
    const authReq = req;
    try {
        const { score } = authReq.body;
        const attemptId = Date.now().toString() + Math.floor(Math.random() * 1000);
        await (0, db_1.dbRun)('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', [attemptId, authReq.user?.id, 'jigsaw', score, 'completed']);
        await updateStudentScore(authReq.user?.id);
        res.json({ success: true, score });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Debug Code Submission
router.post('/debug-code/submit', async (req, res) => {
    const authReq = req;
    try {
        const { score } = authReq.body;
        const attemptId = Date.now().toString() + Math.floor(Math.random() * 1000);
        await (0, db_1.dbRun)('INSERT OR REPLACE INTO attempts (id, student_id, challenge_id, score, status, completed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', [attemptId, authReq.user?.id, 'debug-code', score, 'completed']);
        await updateStudentScore(authReq.user?.id);
        res.json({ success: true, score });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
