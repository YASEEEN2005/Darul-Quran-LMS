const { prisma } = require('../config/db');

// @desc    Get all lessons for a course (unlocked sequentially)
// @route   GET /lessons/:courseId
// @access  Private
const getLessons = async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Get all lessons for the course, ordered
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    });

    if (lessons.length === 0) {
      return res.json({ success: true, count: 0, data: [] });
    }

    // If Admin, return all lessons
    if (req.user.role === 'ADMIN') {
      return res.json({ success: true, count: lessons.length, data: lessons });
    }

    // 2. Get user's progress for this course's lessons
    const progresses = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: { courseId },
      },
      include: { lesson: true },
    });

    // 3. Determine highest completed orderIndex
    let maxCompletedIndex = 0;
    progresses.forEach((p) => {
      if (p.completed && p.lesson.orderIndex > maxCompletedIndex) {
        maxCompletedIndex = p.lesson.orderIndex;
      }
    });

    // 4. Return lessons up to maxCompletedIndex + 1 (the next unlocked one)
    // Note: Assuming orderIndex starts at 1
    const unlockedLessons = lessons.filter(
      (lesson) => lesson.orderIndex <= maxCompletedIndex + 1
    );

    res.json({ success: true, count: unlockedLessons.length, data: unlockedLessons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a lesson
// @route   POST /lessons
// @access  Private/Admin
const createLesson = async (req, res, next) => {
  const { courseId, title, videoUrl, orderIndex } = req.body;
  try {
    const lesson = await prisma.lesson.create({
      data: { courseId, title, videoUrl, orderIndex },
    });
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    // Handle unique constraint failure ([courseId, orderIndex])
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Lesson with this orderIndex already exists in this course' });
    }
    next(error);
  }
};

// @desc    Mark lesson as watched (simulate flag)
// @route   POST /lessons/:id/complete
// @access  Private
const markLessonComplete = async (req, res, next) => {
  const lessonId = req.params.id;
  const userId = req.user.id;

  try {
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: { completed: true },
      create: { userId, lessonId, completed: true },
    });
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLessons, createLesson, markLessonComplete };
