const express = require('express');
const { getSales, getFilterOptions } = require('../controllers/salesController');

const router = express.Router();

// Routes
router.get('/', getSales);
router.get('/filter-options', getFilterOptions);

module.exports = router;
