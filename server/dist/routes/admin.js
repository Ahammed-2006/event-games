"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, auth_1.requireAdmin);
router.get('/students', async (req, res) => {
    try {
        const students = await (0, db_1.dbAll)('SELECT id, name, team, status, score, last_login FROM students');
        // For each student, get challenge completion status
        const result = await Promise.all(students.map(async (s) => {
            const attempts = await (0, db_1.dbAll)('SELECT challenge_id, score, status FROM attempts WHERE student_id = ?', [s.id]);
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
exports.default = router;
