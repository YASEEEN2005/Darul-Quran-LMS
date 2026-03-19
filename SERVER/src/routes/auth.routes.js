const express = require('express');
const { googleLogin, googleCallback, googleRedirect } = require('../controllers/auth.controller');

const router = express.Router();

// GET /auth/google
router.get('/google', googleLogin);

// GET /auth/google/callback
router.get('/google/callback', googleCallback, googleRedirect);

module.exports = router;
