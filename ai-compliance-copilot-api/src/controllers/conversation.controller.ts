import { Response } from 'express';
import { supabase } from '../config/supabase';
import { ExtendedRequest, Conversation, Message, ApiResponse } from '../types';

export const createConversation = async (
  req: ExtendedRequest, 
  res: Response<ApiResponse<Conversation>>
) => {
  try {
    const { title } = req.body;
    const userId = req.user!.id;

    console.log('Creating conversation:', { 
      userId, 
      title, 
      userObject: req.user 
    });

    const { data, error } = await supabase
      .from('conversations')
      .insert([{ 
        user_id: userId, 
        title 
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ 
        error: 'Failed to create conversation',
        details: error.message 
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Full conversation creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getConversations = async (
  req: ExtendedRequest, 
  res: Response<ApiResponse<Conversation[]>>
) => {
  try {
    const userId = req.user!.id;

    console.log('Fetching conversations for user:', {
      userId,
      userObject: req.user,
      userEmail: req.user?.email
    });

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    console.log('Supabase query result:', {
      data,
      error,
      queryUserId: userId
    });

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch conversations',
        details: error.message 
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Full conversation fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getConversationById = async (
  req: ExtendedRequest, 
  res: Response<ApiResponse<Conversation & { messages: Message[] }>>
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (convError) {
      console.error('Supabase conversation lookup error:', convError);
      return res.status(404).json({ 
        error: 'Conversation not found', 
        details: convError.message 
      });
    }

    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (msgError) {
      console.error('Supabase message lookup error:', msgError);
      return res.status(500).json({ 
        error: 'Failed to fetch conversation messages',
        details: msgError.message 
      });
    }

    res.json({ ...conversation, messages });
  } catch (error) {
    console.error('Full conversation fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};