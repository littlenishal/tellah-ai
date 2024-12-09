-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own conversations" 
  ON conversations FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access messages from their conversations" 
  ON messages FOR ALL 
  USING (
    auth.uid() = (
      SELECT user_id 
      FROM conversations 
      WHERE id = messages.conversation_id
    )
  );
