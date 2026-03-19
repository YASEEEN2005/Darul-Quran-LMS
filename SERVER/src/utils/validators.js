const { validationResult, check } = require('express-validator');

// Middleware to catch and format validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const userValidators = {
  createUser: [
    check('email', 'Please include a valid email').isEmail(),
    check('name', 'Name is required').not().isEmpty(),
  ],
};

const courseValidators = {
  createCourse: [
    check('title', 'Title is required').not().isEmpty(),
  ],
};

const lessonValidators = {
  createLesson: [
    check('courseId', 'Course ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('videoUrl', 'Video URL must be valid').isURL(),
    check('orderIndex', 'Order index must be a number').isNumeric(),
  ],
};

const examValidators = {
  createExam: [
    check('courseId', 'Course ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('orderIndex', 'Order index must be a number').isNumeric(),
    check('questions', 'Questions array is required').isArray(),
    check('questions.*.text', 'Question text is required').not().isEmpty(),
    check('questions.*.options', 'Options must be an array of at least 2').isArray({ min: 2 }),
    check('questions.*.correctOptionIndex', 'Valid correct option index required').isNumeric(),
  ]
}

const meetingValidators = {
  createMeeting: [
    check('title', 'Title is required').not().isEmpty(),
    check('meetLink', 'Google Meet Link is required').isURL(),
    check('date', 'Valid date is required').isISO8601(),
  ]
}

module.exports = {
  validate,
  userValidators,
  courseValidators,
  lessonValidators,
  examValidators,
  meetingValidators
};
