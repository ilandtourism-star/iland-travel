const express = require('express');
const router = express.Router();
const asyncHandler = require('../lib/asyncHandler');
const partnerHandlers = require('../handlers/partner');
const reviewHandlers = require('../handlers/review');
const uploadHandlers = require('../handlers/upload');
const { authorizePartner } = require('../lib/middleware');

// Analytics & Dashboard
router.get('/analytics', authorizePartner, asyncHandler(partnerHandlers.getPartnerDashboardApi));
router.get('/transactions', authorizePartner, asyncHandler(partnerHandlers.getPartnerTransactionsApi));
router.get('/bookings', authorizePartner, asyncHandler(partnerHandlers.getPartnerBookingsApi));
router.get('/activities', authorizePartner, asyncHandler(partnerHandlers.getPartnerActivitiesApi));

// Photos
router.post('/photo/:sku([a-zA-Z0-9\\-_]+)',
    authorizePartner,
    (req, res, next) => uploadHandlers.uploadMiddleware(req, res, (err) => {
        if (err) return next(err);
        next();
    }),
    asyncHandler(uploadHandlers.uploadPhotoApi)
);
router.get('/photos', authorizePartner, asyncHandler(uploadHandlers.getPhotosApi));

module.exports = router;
