"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const router = (0, express_1.Router)();
router.get('/state', async (req, res) => {
    try {
        const state = await (0, db_1.dbGet)('SELECT * FROM event_state ORDER BY id DESC LIMIT 1');
        res.json({ event_status: state?.event_status || 'WAITING' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
