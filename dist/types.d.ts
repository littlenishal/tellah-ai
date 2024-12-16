import { Session } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';
export interface User {
    id: string;
    email: string;
    role?: string;
    metadata?: Record<string, any>;
}
export interface AuthSession {
    user: User;
    session: Session | null;
}
export interface ExtendedRequest extends Request {
    user?: User;
}
export type AuthMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => Promise<void | Response>;
export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}
export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    sender_type: 'user' | 'ai';
    created_at: string;
}
export interface ErrorResponse {
    error: string;
    details?: string;
}
export interface PaginationOptions {
    page?: number;
    limit?: number;
}
export type ApiResponse<T> = T | ErrorResponse;
//# sourceMappingURL=types.d.ts.map