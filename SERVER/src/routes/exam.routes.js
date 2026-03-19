const express = require('express');
const { createExam, getExams, submitExam } = require('../controllers/exam.controller');
const { protect } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/admin.middleware');
const { validate, examValidators } = require('../utils/validators');

const router = express.Router();

router.post('/', protect, admin, examValidators.createExam, validate, createExam);
router.get('/:courseId', protect, getExams);
router.post('/:id/submit', protect, submitExam);

module.exports = router;
