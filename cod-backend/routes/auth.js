import express from 'express';
import { signup, login } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));


export default router;

