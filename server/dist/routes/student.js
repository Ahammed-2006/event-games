"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, auth_1.requireStudent);
router.get('/profile', async (req, res) => {
    const authReq = req;
    try {
        const student = await (0, db_1.dbGet)('SELECT id, name, team, status, score FROM students WHERE id = ?', [authReq.user?.id]);
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/progress', async (req, res) => {
    const authReq = req;
    try {
        const attempts = await (0, db_1.dbAll)('SELECT challenge_id, score, status FROM attempts WHERE student_id = ?', [authReq.user?.id]);
        res.json(attempts);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
