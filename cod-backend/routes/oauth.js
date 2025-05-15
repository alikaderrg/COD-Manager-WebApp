import express from 'express';
import passport from '../auth/passport.js';
import { oauthSuccess, oauthFailure } from '../controllers/oauthController.js';

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/oauth/failure' }),
  oauthSuccess
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/api/oauth/failure' }),
  oauthSuccess
);

router.get('/failure', oauthFailure);

export default router;
