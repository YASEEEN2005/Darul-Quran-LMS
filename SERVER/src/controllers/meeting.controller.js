const { prisma } = require('../config/db');

// @desc    Get all meetings
// @route   GET /meetings
// @access  Private (Admin & Student)
const getMeetings = async (req, res, next) => {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { date: 'asc' }
    });
    res.json({ success: true, count: meetings.length, data: meetings });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a meeting link
// @route   POST /meetings
// @access  Private/Admin
const createMeeting = async (req, res, next) => {
  const { title, meetLink, date } = req.body;
  try {
    const meeting = await prisma.meeting.create({
      data: { title, meetLink, date: new Date(date) }
    });
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMeetings, createMeeting };
