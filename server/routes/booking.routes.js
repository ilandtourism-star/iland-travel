const express = require('express');
const router = express.Router();
const asyncHandler = require('../lib/asyncHandler');
const bookingHandlers = require('../handlers/booking');
const { authorizeAdmin, authorizePartner } = require('../lib/middleware');

// Public: Create Booking
router.post('/', asyncHandler(bookingHandlers.addBookingApi));

// Public: Get Invoice
router.get('/invoice/:id([a-zA-Z0-9]+)', asyncHandler(bookingHandlers.getInvoiceApi));

// Public: Availability
router.get('/availability/:sku([a-zA-Z0-9\\-_]+)/:date(\\d{4}-\\d{2}-\\d{2})', asyncHandler(bookingHandlers.checkAvailabilityApi));

// Public: Lookup
router.get('/lookup', asyncHandler(bookingHandlers.lookupBookingApi));

// Partner/Admin: Update Availability
router.post('/availability/:sku([a-zA-Z0-9\\-_]+)/:date(\\d{4}-\\d{2}-\\d{2})', authorizePartner, asyncHandler(bookingHandlers.updateAvailabilityApi));

// Admin: List All
router.get('/list', authorizeAdmin, asyncHandler(bookingHandlers.getBookingsApi));

module.exports = router;
