const express = require('express');
const { getUsers, addUser, approveUser } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/admin.middleware');
const { validate, userValidators } = require('../utils/validators');

const router = express.Router();

// All user routes require Admin
router.use(protect, admin);

router.route('/')
  .get(getUsers)
  .post(userValidators.createUser, validate, addUser);

router.patch('/:id/approve', approveUser);

module.exports = router;
