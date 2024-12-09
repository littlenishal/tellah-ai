import express from 'express';
import { createConversation, getConversations, getConversationById } from '../controllers/conversation.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createConversation);
router.get('/', authenticateToken, getConversations);
router.get('/:id', authenticateToken, getConversationById);

export default router;