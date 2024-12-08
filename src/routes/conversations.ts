import express from 'express';
import { ConversationController } from '../controllers/conversation.controller';

const router = express.Router();
const conversationController = new ConversationController();

router.post('/', conversationController.createConversation);
router.get('/:id', conversationController.getConversation);
router.post('/:conversationId/messages', conversationController.sendMessage);

export default router;