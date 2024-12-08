export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  metadata?: {
    errorMessage?: string;
    retryCount?: number;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
  context?: ConversationContext;
}

export interface ConversationContext {
  topic?: string;
  regulatoryContext?: string[];
  productType?: string;
  previousReferences?: string[];
}