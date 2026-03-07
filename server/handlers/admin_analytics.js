const db = require('../db');

exports.getAdminAdvancedAnalyticsApi = (req, res) => {
    // 1. Revenue by Island
    const islandStats = db.prepare(`
        SELECT 
            vacations.island,
            SUM(bookings.total_price) as totalRevenue,
            COUNT(bookings.id) as bookingCount
        FROM bookings
        JOIN vacations ON bookings.vacation_sku = vacations.sku
        WHERE bookings.status = 'confirmed'
        GROUP BY vacations.island
    `).all();

    // 2. Monthly Revenue Trend
    const monthlyStats = db.prepare(`
        SELECT 
            strftime('%Y-%m', created_at) as month,
            SUM(total_price) as revenue
        FROM bookings
        WHERE status = 'confirmed'
        GROUP BY month
        ORDER BY month ASC
        LIMIT 12
    `).all();

    // 3. Partner Leaderboard
    const partnerLeaderboard = db.prepare(`
        SELECT 
            users.username as partnerName,
            SUM(bookings.total_price) as totalGross,
            SUM(bookings.net_amount) as totalNet,
            COUNT(bookings.id) as totalBookings
        FROM bookings
        JOIN vacations ON bookings.vacation_sku = vacations.sku
        JOIN users ON vacations.owner_id = users.id
        WHERE bookings.status = 'confirmed'
        GROUP BY users.id
        ORDER BY totalGross DESC
    `).all();

    // 4. Season Listener Leads (Out-of-season intent)
    const leadCount = db.prepare('SELECT COUNT(*) as count FROM season_listeners').get().count;

    res.json({
        success: true,
        islandStats,
        monthlyStats,
        partnerLeaderboard,
        leads: leadCount
    });
};
