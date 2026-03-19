const { prisma } = require('../config/db');

// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, approved: true, createdAt: true },
    });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Whitelist a user for login
// @route   POST /users
// @access  Private/Admin
const addUser = async (req, res, next) => {
  const { email, name, role = 'STUDENT', approved = true } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: { email, name, role, approved },
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a specific user
// @route   PATCH /users/:id/approve
// @access  Private/Admin
const approveUser = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { approved: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, addUser, approveUser };
