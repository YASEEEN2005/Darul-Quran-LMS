const { prisma } = require('../config/db');

// @desc    Create an exam with questions
// @route   POST /exams
// @access  Private/Admin
const createExam = async (req, res, next) => {
  const { courseId, title, orderIndex, questions } = req.body;
  
  try {
    const exam = await prisma.exam.create({
      data: {
        courseId,
        title,
        orderIndex,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex
          }))
        }
      },
      include: { questions: true }
    });
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Exam with this orderIndex already exists in this course' });
    }
    next(error);
  }
};

// @desc    Get all exams for a course (unlocked sequentially)
// @route   GET /exams/:courseId
// @access  Private
const getExams = async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const exams = await prisma.exam.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
      include: { 
        questions: {
          select: { id: true, text: true, options: true } // Hide correctOptionIndex from users
        }
      }
    });

    if (exams.length === 0) return res.json({ success: true, count: 0, data: [] });

    if (req.user.role === 'ADMIN') {
      return res.json({ success: true, count: exams.length, data: exams });
    }

    const results = await prisma.examResult.findMany({
      where: { userId, exam: { courseId } },
      include: { exam: true }
    });

    let maxCompletedIndex = 0;
    results.forEach((r) => {
      if (r.completed && r.exam.orderIndex > maxCompletedIndex) {
        maxCompletedIndex = r.exam.orderIndex;
      }
    });

    const unlockedExams = exams.filter(e => e.orderIndex <= maxCompletedIndex + 1);
    
    res.json({ success: true, count: unlockedExams.length, data: unlockedExams });
  } catch (error) {
    next(error);
  }
};


// @desc    Submit an exam for auto-grading
// @route   POST /exams/:id/submit
// @access  Private
const submitExam = async (req, res, next) => {
  const examId = req.params.id;
  const userId = req.user.id;
  const { answers } = req.body; // Array of { questionId, selectedOptionIndex }

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true }
    });

    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    answers.forEach(ans => {
      const question = exam.questions.find(q => q.id === ans.questionId);
      if (question && question.correctOptionIndex === ans.selectedOptionIndex) {
        correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;
    
    // Simplistic rule: Score > 0 is completed (can customize later)
    const completed = true; 

    const result = await prisma.examResult.upsert({
      where: {
        userId_examId: { userId, examId }
      },
      update: { score, completed },
      create: { userId, examId, score, completed }
    });

    res.json({ success: true, score, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExam, getExams, submitExam };
