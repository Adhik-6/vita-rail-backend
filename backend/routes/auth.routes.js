import express from 'express';
import { login, logout, forgotPassword, signup, resetPassword } from '../controllers/index.controllers.js';
import { verifyToken } from '../middlewares/index.middlewares.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', verifyToken, logout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
// authRouter.get('/verify-token', verifyToken);

export default authRouter;
