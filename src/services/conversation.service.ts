import { prisma } from '../utils/prisma';
import { Conversation, Message, ConversationContext } from '../types';
import { AIService } from './ai.service';

export class ConversationService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async createConversation(userId: string): Promise<Conversation> {
    return prisma.conversation.create({
      data: {
        userId,
        title: 'New Conversation',
        messages: []
      }
    });
  }

  async getConversation(id: string): Promise<Conversation> {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: true }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  async addMessage(
    conversationId: string,
    content: string,
    role: 'user' | 'assistant'
  ): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role,
        status: 'sent'
      }
    });

    if (role === 'user') {
      const conversation = await this.getConversation(conversationId);
      const aiResponse = await this.aiService.generateResponse(
        [...conversation.messages, message],
        conversation.context
      );

      await this.addMessage(conversationId, aiResponse, 'assistant');
    }

    return message;
  }
}