const express = require('express');
const router = express.Router();

const vacationRoutes = require('./vacation.routes');
const bookingRoutes = require('./booking.routes');
const partnerRoutes = require('./partner.routes');
const factRoutes = require('./fact.routes');
const userRoutes = require('./user.routes');

// --- Mounting Modules ---

// 1. Vacation Routes
// /api/v1/vacations -> Get List
// /api/v1/vacation  -> Get/Update/Delete One
router.use('/vacations', vacationRoutes); // Serves '/' (list)
router.use('/vacation', vacationRoutes);  // Serves '/:sku' (details)

// 2. Booking Routes
// /api/v1/booking -> Create/Lookup/Invoice
// /api/v1/bookings -> Admin List
router.use('/booking', bookingRoutes);
router.use('/bookings', bookingRoutes);

// 3. Partner Routes
// /api/v1/partner/...
router.use('/partner', partnerRoutes);

// 4. Ocean Fact Routes
// /api/v1/ocean-fact/...
router.use('/ocean-fact', factRoutes);

// 5. User/General Routes (Auth, Settings, Newsletter)
// Mounted at root of /api/v1 so they keep their paths (e.g. /auth/login)
router.use('/', userRoutes);

module.exports = router;
