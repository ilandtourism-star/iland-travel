const db = require('../db');
const { skuSchema } = require('../lib/schemas');

// Add a new review
exports.addReviewApi = (req, res) => {
    const { vacation_sku, booking_id, user_name, rating, comment } = req.body;

    if (!vacation_sku || !user_name || !rating) {
        return res.status(400).json({ success: false, message: 'Maklumat tidak lengkap (SKU, Nama, Rating).' });
    }

    const id = Math.random().toString(36).substr(2, 9);
    db.prepare(`
        INSERT INTO reviews (id, vacation_sku, booking_id, user_name, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, vacation_sku, booking_id, user_name, rating, comment);

    res.status(201).json({ success: true, message: 'Ulasan anda telah berjaya dihantar!' });
};

// Get reviews for a specific vacation
exports.getVacationReviewsApi = (req, res) => {
    const { sku } = req.params;

    const validation = skuSchema.safeParse(sku);
    if (!validation.success) return res.status(400).json({ success: false, message: validation.error.errors[0].message });

    const reviews = db.prepare('SELECT * FROM reviews WHERE vacation_sku = ? ORDER BY created_at DESC').all(sku);

    // Calculate average rating
    const stats = db.prepare('SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE vacation_sku = ?').get(sku);

    res.json({
        success: true,
        reviews,
        avgRating: stats.avgRating || 0,
        count: stats.count || 0
    });
};
