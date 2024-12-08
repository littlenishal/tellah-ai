import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, Conversation } from '../types';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: 'tunedModels/copilottrainingdata-8z1ecjw50xh8' });
  }

  async generateResponse(
    messages: Message[],
    context?: ConversationContext
  ): Promise<string> {
    const chat = this.model.startChat({
      history: messages.map(m => ({
        role: m.role,
        parts: m.content
      }))
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return result.response.text();
  }
}