const express = require('express');
const router = express.Router();
const asyncHandler = require('../lib/asyncHandler');
const handlers = require('../handlers/vacation');
const { authorizeAdmin, authorizePartner } = require('../lib/middleware');

// Public: Get List
router.get('/', asyncHandler(handlers.getVacationsApi));

// Public: Get One by SKU
router.get('/:sku([a-zA-Z0-9\\-_]+)', asyncHandler(handlers.getVacationBySkuApi));

// Admin: Add
router.post('/', authorizeAdmin, asyncHandler(handlers.addVacationApi));

// Admin: Update
router.put('/:sku([a-zA-Z0-9\\-_]+)', authorizeAdmin, asyncHandler(handlers.updateVacationApi));

// Admin: Delete
router.delete('/:sku([a-zA-Z0-9\\-_]+)', authorizeAdmin, asyncHandler(handlers.requestDeleteVacationApi));

// Partner/Admin: Update Capacity
router.put('/:sku([a-zA-Z0-9\\-_]+)/capacity', authorizePartner, asyncHandler(handlers.updateCapacityApi));

module.exports = router;
