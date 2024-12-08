import { Request, Response } from 'express';
import { ConversationService } from '../services/conversation.service';

export class ConversationController {
  private conversationService: ConversationService;

  constructor() {
    this.conversationService = new ConversationService();
  }

  async createConversation(req: Request, res: Response) {
    const conversation = await this.conversationService.createConversation(req.user.id);
    res.status(201).json({
      success: true,
      data: conversation
    });
  }

  async sendMessage(req: Request, res: Response) {
    const { conversationId } = req.params;
    const { content } = req.body;

    const message = await this.conversationService.addMessage(
      conversationId,
      content,
      'user'
    );

    res.status(201).json({
      success: true,
      data: message
    });
  }

  async getConversation(req: Request, res: Response) {
    const { id } = req.params;
    const conversation = await this.conversationService.getConversation(id);

    res.json({
      success: true,
      data: conversation
    });
  }
}