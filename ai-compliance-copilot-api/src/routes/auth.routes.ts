import express from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const authRoutes = express.Router();

const { signUp: signup, signIn: signin, signOut: signout, getCurrentUser } = authController;

// Public routes
authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);

// Protected routes (require authentication)
authRoutes.post('/signout', signout);
authRoutes.get('/me', authenticateToken, getCurrentUser);

export default authRoutes;