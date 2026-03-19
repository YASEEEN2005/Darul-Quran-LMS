const express = require('express');
const { getCourses, createCourse } = require('../controllers/course.controller');
const { protect } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/admin.middleware');
const { validate, courseValidators } = require('../utils/validators');

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, courseValidators.createCourse, validate, createCourse);

module.exports = router;
