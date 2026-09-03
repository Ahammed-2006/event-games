"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const router = (0, express_1.Router)();
router.get('/state', async (req, res) => {
    // Prevent all caching so clients always get fresh lock state
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const state = await (0, db_1.dbGet)('SELECT * FROM event_state ORDER BY id DESC LIMIT 1');
        res.json({
            event_status: state?.event_status || 'WAITING',
            word_search_locked: !!state?.word_search_locked,
            jigsaw_locked: !!state?.jigsaw_locked,
            debug_code_locked: !!state?.debug_code_locked
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
