const express = require('express');
const router = express.Router();
const asyncHandler = require('./lib/asyncHandler');
const handlers = require('./handlers/vacation');
const { authorize, authorizeAdmin, authorizePartner } = require('./lib/middleware');

// --- Rate Limiting ---
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minit
    max: 5, // maksimum 5 percubaan per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Terlalu banyak percubaan log masuk. Sila cuba lagi selepas 15 minit.'
    }
});

// --- Route Auth (Simulasi) ---

const db = require('./db');
const bcrypt = require('bcrypt');

// Login (Verify password) - Protected by rate limiter
router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Sila masukkan username dan password.' });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);

    if (!user) {
        return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
        req.session.authorized = true;
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.json({ message: 'Login berjaya!', user: req.session.user });
    } else {
        res.status(401).json({ message: 'Username atau password salah.' });
    }
}));

// Logout (Hapus session)
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout berjaya!' });
});

// Route Rahsia (Guna middleware 'authorize')
router.get('/secret', authorize, (req, res) => {
    res.json({
        message: 'Tahniah! Anda berjaya akses route rahsia ini.',
        secretData: 'Diskaun 50% untuk pakej Pulau Perhentian!'
    });
});

// --- API Endpoints ---

// Dapatkan senarai percutian
router.get('/vacations', asyncHandler(handlers.getVacationsApi));

// Dapatkan satu percutian (Endpoint tambahan)
router.get('/vacation/:sku([a-zA-Z0-9\\-_]+)', asyncHandler(handlers.getVacationBySkuApi));

// Tambah percutian baru (Admin sahaja)
router.post('/vacation', authorizeAdmin, asyncHandler(handlers.addVacationApi));

// Kemaskini percutian (Admin sahaja)
router.put('/vacation/:sku([a-zA-Z0-9\\-_]+)', authorizeAdmin, asyncHandler(handlers.updateVacationApi));

// Padam percutian berdasarkan SKU (Admin sahaja)
router.delete('/vacation/:sku([a-zA-Z0-9\\-_]+)', authorizeAdmin, asyncHandler(handlers.requestDeleteVacationApi));

// Kemaskini kapasiti percutian (Partner atau Admin)
router.put('/vacation/:sku([a-zA-Z0-9\\-_]+)/capacity', authorizePartner, asyncHandler(handlers.updateCapacityApi));

// --- Booking Endpoints ---
const bookingHandlers = require('./handlers/booking');

// Hantar Tempahan (Public)
router.post('/booking', asyncHandler(bookingHandlers.addBookingApi));

// Dapatkan Resit (Public)
router.get('/invoice/:id([a-zA-Z0-9]+)', asyncHandler(bookingHandlers.getInvoiceApi));

// Semak Ketersediaan (Public)
router.get('/availability/:sku([a-zA-Z0-9\\-_]+)/:date(\\d{4}-\\d{2}-\\d{2})', asyncHandler(bookingHandlers.checkAvailabilityApi));

// Kemaskini Ketersediaan (Partner/Admin)
router.post('/availability/:sku([a-zA-Z0-9\\-_]+)/:date(\\d{4}-\\d{2}-\\d{2})', authorizePartner, asyncHandler(bookingHandlers.updateAvailabilityApi));

// Lihat Semua Tempahan (Admin sahaja)
router.get('/bookings', authorizeAdmin, asyncHandler(bookingHandlers.getBookingsApi));

// Cari Tempahan Pelanggan (Public) - by ID or email
router.get('/booking/lookup', asyncHandler(bookingHandlers.lookupBookingApi));

// --- Partner Endpoints ---
const partnerHandlers = require('./handlers/partner');
const reviewHandlers = require('./handlers/review');

// Review Endpoints
router.post('/review', asyncHandler(reviewHandlers.addReviewApi));
router.get('/reviews/:sku([a-zA-Z0-9\\-_]+)', asyncHandler(reviewHandlers.getVacationReviewsApi));
router.get('/partner/analytics', authorizePartner, asyncHandler(partnerHandlers.getPartnerDashboardApi));
router.get('/partner/transactions', authorizePartner, asyncHandler(partnerHandlers.getPartnerTransactionsApi));

// Partner Bookings
router.get('/partner/bookings', authorizePartner, asyncHandler(partnerHandlers.getPartnerBookingsApi));

// Partner Activities
router.get('/partner/activities', authorizePartner, asyncHandler(partnerHandlers.getPartnerActivitiesApi));

// Partner Photo Upload
const uploadHandlers = require('./handlers/upload');
router.post('/partner/photo/:sku([a-zA-Z0-9\\-_]+)',
    authorizePartner,
    (req, res, next) => uploadHandlers.uploadMiddleware(req, res, (err) => {
        if (err) return next(err); // Pass upload errors to global handler
        next();
    }),
    asyncHandler(uploadHandlers.uploadPhotoApi)
);
router.get('/partner/photos', authorizePartner, asyncHandler(uploadHandlers.getPhotosApi));


// --- Settings Endpoints ---
const settingsHandlers = require('./handlers/settings');
const adminAnalyticsHandlers = require('./handlers/admin_analytics');
const newsletterHandlers = require('./handlers/newsletter');

// Admin Advanced Analytics (Admin sahaja)
router.get('/admin/advanced-analytics', authorizeAdmin, asyncHandler(adminAnalyticsHandlers.getAdminAdvancedAnalyticsApi));
router.get('/settings/:key([a-zA-Z0-9_]+)', asyncHandler(settingsHandlers.getSettingsApi));
router.put('/settings/:key([a-zA-Z0-9_]+)', authorizeAdmin, asyncHandler(settingsHandlers.updateSettingsApi));

// --- Season Listener ---
router.post('/season-listener', asyncHandler(newsletterHandlers.addSeasonListenerApi));

// Fallback untuk route lain yang mungkin ditambah di masa depan
router.get('/test', (req, res) => {
    res.send('Router module berfungsi!');
});

module.exports = router;
