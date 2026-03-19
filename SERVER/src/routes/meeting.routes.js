const express = require('express');
const { getMeetings, createMeeting } = require('../controllers/meeting.controller');
const { protect } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/admin.middleware');
const { validate, meetingValidators } = require('../utils/validators');

const router = express.Router();

router.get('/', protect, getMeetings);
router.post('/', protect, admin, meetingValidators.createMeeting, validate, createMeeting);

module.exports = router;
