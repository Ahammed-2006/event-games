"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../database/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, auth_1.requireAdmin);
router.get('/students', async (req, res) => {
    try {
        const students = await (0, db_1.dbAll)('SELECT id, name, team, status, score, last_login FROM students');
        const attempts = await (0, db_1.dbAll)('SELECT student_id, challenge_id, score, time_taken FROM attempts');
        const result = students.map((s) => {
            const studentAttempts = attempts.filter((a) => a.student_id === s.id);
            const wordSearch = studentAttempts.find((a) => a.challenge_id === 'word-search')?.score || 0;
            const jigsawAttempt = studentAttempts.find((a) => a.challenge_id === 'jigsaw');
            const jigsaw = jigsawAttempt?.score || 0;
            const jigsawTime = jigsawAttempt?.time_taken || 0;
            const debugCode = studentAttempts.find((a) => a.challenge_id === 'debug-code')?.score || 0;
            return {
                id: s.id,
                name: s.name,
                team: s.team,
                status: s.status,
                score: s.score,
                wordSearch,
                jigsaw,
                jigsawTime,
                debugCode,
                lastLogin: s.last_login
            };
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/event/start', async (req, res) => {
    await (0, db_1.dbRun)('UPDATE event_state SET event_status = ?, updated_at = CURRENT_TIMESTAMP', ['RUNNING']);
    res.json({ message: 'Event started' });
});
router.post('/event/pause', async (req, res) => {
    await (0, db_1.dbRun)('UPDATE event_state SET event_status = ?, updated_at = CURRENT_TIMESTAMP', ['PAUSED']);
    res.json({ message: 'Event paused' });
});
router.post('/event/end', async (req, res) => {
    await (0, db_1.dbRun)('UPDATE event_state SET event_status = ?, updated_at = CURRENT_TIMESTAMP', ['ENDED']);
    res.json({ message: 'Event ended' });
});
router.post('/event/reset', async (req, res) => {
    try {
        await (0, db_1.dbRun)('DELETE FROM attempts');
        await (0, db_1.dbRun)("UPDATE students SET score = 0, status = 'not-started'");
        res.json({ message: 'Event reset successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to reset event' });
    }
});
router.post('/event/toggle-game', async (req, res) => {
    try {
        const { gameId, locked } = req.body;
        let column = '';
        if (gameId === 'word-search')
            column = 'word_search_locked';
        else if (gameId === 'jigsaw')
            column = 'jigsaw_locked';
        else if (gameId === 'debug-code')
            column = 'debug_code_locked';
        else
            return res.status(400).json({ error: 'Invalid game ID' });
        await (0, db_1.dbRun)(`UPDATE event_state SET ${column} = ?, updated_at = CURRENT_TIMESTAMP`, [locked ? 1 : 0]);
        res.json({ message: 'Game lock state updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/reset-password', async (req, res) => {
    try {
        const { studentId, newPassword } = req.body;
        if (!studentId || !newPassword)
            return res.status(400).json({ error: 'Missing fields' });
        if (newPassword.length < 4)
            return res.status(400).json({ error: 'Password too short' });
        const hash = await bcrypt_1.default.hash(newPassword, 10);
        await (0, db_1.dbRun)('UPDATE students SET password_hash = ? WHERE id = ?', [hash, studentId]);
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
