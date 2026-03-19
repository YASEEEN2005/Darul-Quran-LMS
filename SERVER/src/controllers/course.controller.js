const { prisma } = require('../config/db');

// @desc    Get all courses (minimal data)
// @route   GET /courses
// @access  Public (or protected if specified)
const getCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { lessons: true, exams: true }
        }
      }
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a course
// @route   POST /courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const course = await prisma.course.create({
      data: { title, description }
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, createCourse };
