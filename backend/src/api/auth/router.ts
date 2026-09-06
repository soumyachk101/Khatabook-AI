import { Router } from 'express';
import { handleSignup } from './signup/route';
import { handleLogin } from './login/route';
import { handleForgotPassword } from './forgot-password/route';
import { handleSession } from './session/route';
import { handleMe } from './me/route';

const router = Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/forgot-password', handleForgotPassword);
router.get('/session', handleSession);
router.get('/me', handleMe);

export default router;
