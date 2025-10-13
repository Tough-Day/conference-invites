import { Router } from 'express';
import passport from '../config/passport.js';

const router = Router();

/**
 * GET /auth/google
 * Initiate Google OAuth flow
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * GET /auth/google/callback
 * Google OAuth callback URL
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  (req, res) => {
    // Explicitly save session before redirecting
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_error`);
      }
      res.redirect(process.env.FRONTEND_URL || 'https://forms.tough.day');
    });
  }
);

/**
 * GET /auth/logout
 * Logout current user
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout failed',
        message: err.message,
      });
    }
    res.redirect(`${process.env.FRONTEND_URL}/login` || 'https://forms.tough.day/login');
  });
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'You are not logged in',
  });
});

export default router;
