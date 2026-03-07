const express = require('express');
const router = express.Router();
const asyncHandler = require('../lib/asyncHandler');
const oceanFactHandlers = require('../handlers/ocean_fact');

// GET /api/v1/ocean-fact/random
router.get('/random', asyncHandler(oceanFactHandlers.getRandomOceanFactApi));

module.exports = router;
