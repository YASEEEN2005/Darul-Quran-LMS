const passport = require('passport');

const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = passport.authenticate('google', {
  failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  session: false,
});

const googleRedirect = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_not_found`);
  }

  if (!req.user.approved) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_approved`);
  }

  // Generate token and redirect to frontend with token
  const { generateToken } = require('../utils/generateToken');
  const token = generateToken(req.user.id);
  
  res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
};

module.exports = {
  googleLogin,
  googleCallback,
  googleRedirect,
};
