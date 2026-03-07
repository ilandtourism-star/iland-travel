const express = require('express');
const router = express.Router();
const asyncHandler = require('../lib/asyncHandler');
const db = require('../db');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { authorize, authorizeAdmin } = require('../lib/middleware');

const settingsHandlers = require('../handlers/settings');
const adminAnalyticsHandlers = require('../handlers/admin_analytics');
const newsletterHandlers = require('../handlers/newsletter');
const reviewHandlers = require('../handlers/review');

const { registrationSchema, loginSchema } = require('../lib/schemas');

// --- Auth ---

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Terlalu banyak percubaan log masuk. Sila cuba lagi selepas 15 minit.' }
});

router.post('/auth/login', loginLimiter, asyncHandler(async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
    }
    const { username, password } = validation.data;

    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);

    if (!user) return res.status(401).json({ message: 'Username atau password salah.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
        req.session.authorized = true;
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.json({ message: 'Login berjaya!', user: req.session.user });
    } else {
        res.status(401).json({ message: 'Username atau password salah.' });
    }
}));

router.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout berjaya!' });
});

router.post('/auth/register', loginLimiter, asyncHandler(async (req, res) => {
    const validation = registrationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
    }
    const { username, email, password } = validation.data;

    // Check if user exists
    const checkStmt = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?');
    const existing = checkStmt.get(username, email);
    if (existing) {
        return res.status(409).json({ message: 'Username atau email sudah digunakan.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const insertStmt = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)');
    const result = insertStmt.run(username, email, password_hash, 'user');

    if (result.changes > 0) {
        req.session.authorized = true;
        req.session.user = { id: result.lastInsertRowid, username, email, role: 'user' };
        res.status(201).json({ success: true, message: 'Pendaftaran berjaya!', user: req.session.user });
    } else {
        res.status(500).json({ success: false, message: 'Gagal mendaftar pengguna. Sila cuba lagi.' });
    }
}));

router.post('/auth/social-login', loginLimiter, asyncHandler(async (req, res) => {
    console.log('Social Login Request Received:', req.body); // DEBUG LOG
    const { provider, email: rawEmail, username } = req.body;
    const email = rawEmail?.trim().toLowerCase();
    if (!provider || !email) {
        console.log('Social Login Failed: Missing provider or email'); // DEBUG LOG
        return res.status(400).json({ message: 'Provider dan Email diperlukan.' });
    }

    // Check if user exists
    const checkStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    let user = checkStmt.get(email);

    if (!user) {
        console.log('Creating new social user:', email); // DEBUG LOG
        // Create new user for social login
        // Password random sebab user takkan guna password untuk login manual (kecuali reset)
        const randomPassword = Math.random().toString(36).slice(-8);
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(randomPassword, saltRounds);

        // Generate unique username
        let finalUsername = username || email.split('@')[0];

        // Cek jika username wujud
        let checkUser = db.prepare('SELECT 1 FROM users WHERE username = ?').get(finalUsername);
        while (checkUser) {
            // Append random 4 digit number if exists
            const suffix = Math.floor(1000 + Math.random() * 9000); // 1000-9999
            finalUsername = `${username || email.split('@')[0]}_${suffix}`;
            checkUser = db.prepare('SELECT 1 FROM users WHERE username = ?').get(finalUsername);
        }

        const insertStmt = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)');
        const result = insertStmt.run(finalUsername, email, password_hash, 'user');

        if (result.changes > 0) {
            user = { id: result.lastInsertRowid, username: finalUsername, email, role: 'user' };
        } else {
            return res.status(500).json({ success: false, message: 'Gagal mencipta akaun sosial.' });
        }
    } else {
        console.log('Existing social user found:', user.username); // DEBUG LOG
    }

    req.session.authorized = true;
    req.session.user = { id: user.id, username: user.username, role: user.role };
    console.log('Session created for:', req.session.user); // DEBUG LOG

    res.json({ message: `Login ${provider} berjaya!`, user: req.session.user });
}));

// --- Settings ---
router.get('/settings/:key([a-zA-Z0-9_]+)', asyncHandler(settingsHandlers.getSettingsApi));
router.put('/settings/:key([a-zA-Z0-9_]+)', authorizeAdmin, asyncHandler(settingsHandlers.updateSettingsApi));

// --- Admin Analytics ---
router.get('/admin/advanced-analytics', authorizeAdmin, asyncHandler(adminAnalyticsHandlers.getAdminAdvancedAnalyticsApi));

// --- Newsletter ---
router.post('/season-listener', asyncHandler(newsletterHandlers.addSeasonListenerApi));

// --- Public Reviews (Not partner specific) ---
router.post('/review', asyncHandler(reviewHandlers.addReviewApi));
router.get('/reviews/:sku([a-zA-Z0-9\\-_]+)', asyncHandler(reviewHandlers.getVacationReviewsApi));

// --- Test/Secret ---
router.get('/secret', authorize, (req, res) => {
    res.json({ message: 'Tahniah! Anda berjaya akses route rahsia ini.', secretData: 'Diskaun 50% untuk pakej Pulau Perhentian!' });
});

module.exports = router;
