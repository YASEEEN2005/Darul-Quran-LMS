const express = require('express');
const { getLessons, createLesson, markLessonComplete } = require('../controllers/lesson.controller');
const { protect } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/admin.middleware');
const { validate, lessonValidators } = require('../utils/validators');

const router = express.Router();

router.get('/:courseId', protect, getLessons);
router.post('/', protect, admin, lessonValidators.createLesson, validate, createLesson);
router.post('/:id/complete', protect, markLessonComplete);

module.exports = router;
