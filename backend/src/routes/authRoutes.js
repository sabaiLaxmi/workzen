const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe, logoutUser, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

const loginAttempts = new Map();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.firstAttempt > WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }
}, WINDOW_MS).unref();

const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const email = req.body.email || 'unknown';
  const key = `${ip}_${email}`;

  const now = Date.now();
  if (loginAttempts.has(key)) {
    const attempt = loginAttempts.get(key);
    if (now - attempt.firstAttempt < WINDOW_MS) {
      attempt.count += 1;
      if (attempt.count > MAX_ATTEMPTS) {
        return res.status(429).json({ message: 'Too many login attempts, please try again later' });
      }
    } else {
      loginAttempts.set(key, { count: 1, firstAttempt: now });
    }
  } else {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
  }
  next();
};

router.post(
  '/login',
  loginRateLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validate,
  loginUser
);

router.post('/logout', logoutUser);

router.get('/me', protect, getMe);

router.put(
  '/update-profile',
  protect,
  [
    body('name', 'Name is required').optional().not().isEmpty(),
    body('email', 'Please include a valid email').optional().isEmail(),
  ],
  validate,
  updateProfile
);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword', 'Current password is required').exists(),
    body('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  changePassword
);

module.exports = router;
