const db = require('../db');

// Get Partner Dashboard Stats
exports.getPartnerDashboardApi = (req, res) => {
    const userId = req.session.user && req.session.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get total activities owned by partner
    const activityCount = db.prepare('SELECT COUNT(*) as count FROM vacations WHERE owner_id = ?').get(userId).count;

    // Get total bookings & revenue for partner's activities
    const bookingStats = db.prepare(`
        SELECT 
            COUNT(*) as totalBookings,
            SUM(CASE WHEN bookings.status = 'confirmed' THEN 1 ELSE 0 END) as confirmedBookings,
            SUM(CASE WHEN bookings.status = 'pending' THEN 1 ELSE 0 END) as pendingBookings,
            SUM(CASE WHEN bookings.status = 'confirmed' THEN net_amount ELSE 0 END) as totalRevenue
        FROM bookings
        JOIN vacations ON bookings.vacation_sku = vacations.sku
        WHERE vacations.owner_id = ?
    `).get(userId);

    // Get leads (Season Listeners) for partner's activities
    const leadCount = db.prepare(`
        SELECT COUNT(*) as count 
        FROM season_listeners 
        JOIN vacations ON season_listeners.vacation_sku = vacations.sku
        WHERE vacations.owner_id = ?
    `).get(userId).count;

    res.json({
        activities: activityCount,
        bookings: bookingStats.totalBookings || 0,
        confirmed: bookingStats.confirmedBookings || 0,
        pending: bookingStats.pendingBookings || 0,
        revenue: bookingStats.totalRevenue || 0,
        leads: leadCount || 0
    });
};

// Get Partner Bookings
exports.getPartnerBookingsApi = (req, res) => {
    const userId = req.session.user && req.session.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const bookings = db.prepare(`
        SELECT bookings.*, vacations.name as activityName
        FROM bookings
        JOIN vacations ON bookings.vacation_sku = vacations.sku
        WHERE vacations.owner_id = ?
        ORDER BY bookings.created_at DESC
    `).all(userId);

    res.json(bookings);
};

// Get Partner Activities
exports.getPartnerActivitiesApi = (req, res) => {
    const userId = req.session.user && req.session.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const activities = db.prepare('SELECT * FROM vacations WHERE owner_id = ?').all(userId);
    res.json(activities);
};

// Get Partner Transactions (Real bookings with price)
exports.getPartnerTransactionsApi = (req, res) => {
    const userId = req.session.user && req.session.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const transactions = db.prepare(`
        SELECT 
            bookings.id, 
            bookings.created_at as date,
            'Booking' as type,
            'Tempahan #' || bookings.id || ' - ' || bookings.firstName as description,
            bookings.total_price as amount,
            bookings.commission_amount as commission,
            bookings.net_amount as net_amount,
            bookings.status
        FROM bookings
        JOIN vacations ON bookings.vacation_sku = vacations.sku
        WHERE vacations.owner_id = ?
        ORDER BY bookings.created_at DESC
    `).all(userId);

    res.json(transactions);
};
