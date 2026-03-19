const { prisma } = require('../config/db');

// @desc    Get progress for a user (lessons and exams)
// @route   GET /progress/:userId
// @access  Private (Self or Admin)
const getProgress = async (req, res, next) => {
  const { userId } = req.params;

  // Authorization check
  if (req.user.id !== userId && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized to view this progress' });
  }

  try {
    // Total count query
    const totalLessons = await prisma.lesson.count();
    const totalExams = await prisma.exam.count();

    // Completed count query
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, completed: true }
    });
    const completedExams = await prisma.examResult.count({
      where: { userId, completed: true }
    });

    const totalItems = totalLessons + totalExams;
    const completedItems = completedLessons + completedExams;
    
    let completionPercentage = 0;
    if (totalItems > 0) {
      completionPercentage = (completedItems / totalItems) * 100;
    }

    res.json({
      success: true,
      data: {
        completionPercentage: completionPercentage.toFixed(2),
        completedLessons,
        totalLessons,
        completedExams,
        totalExams
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress };
