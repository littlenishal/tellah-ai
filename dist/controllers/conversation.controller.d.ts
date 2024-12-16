import { Response } from 'express';
import { ExtendedRequest, Conversation, Message, ApiResponse } from '../types';
export declare const createConversation: (req: ExtendedRequest, res: Response<ApiResponse<Conversation>>) => Promise<Response<ApiResponse<Conversation>, Record<string, any>> | undefined>;
export declare const getConversations: (req: ExtendedRequest, res: Response<ApiResponse<Conversation[]>>) => Promise<Response<ApiResponse<Conversation[]>, Record<string, any>> | undefined>;
export declare const getConversationById: (req: ExtendedRequest, res: Response<ApiResponse<Conversation & {
    messages: Message[];
}>>) => Promise<Response<ApiResponse<Conversation & {
    messages: Message[];
}>, Record<string, any>> | undefined>;
//# sourceMappingURL=conversation.controller.d.ts.map