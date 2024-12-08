import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import conversationRoutes from './routes/conversations';
import messageRoutes from './routes/messages';
import userRoutes from './routes/users';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', authenticateToken, conversationRoutes);
app.use('/api/conversations/:conversationId/messages', authenticateToken, messageRoutes);
app.use('/api/user', authenticateToken, userRoutes);

// Error handling
app.use(errorHandler);