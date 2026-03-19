const express = require('express');
const { getProgress } = require('../controllers/progress.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/:userId', protect, getProgress);

module.exports = router;
