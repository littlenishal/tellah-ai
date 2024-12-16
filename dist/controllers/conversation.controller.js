"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationById = exports.getConversations = exports.createConversation = void 0;
const supabase_1 = require("../config/supabase");
const createConversation = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;
        console.log('Creating conversation:', {
            userId,
            title,
            userObject: req.user
        });
        const { data, error } = await supabase_1.supabase
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
    }
    catch (error) {
        console.error('Full conversation creation error:', error);
        res.status(500).json({
            error: 'Failed to create conversation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createConversation = createConversation;
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching conversations for user:', {
            userId,
            userObject: req.user,
            userEmail: req.user?.email
        });
        const { data, error } = await supabase_1.supabase
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
    }
    catch (error) {
        console.error('Full conversation fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch conversations',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getConversations = getConversations;
const getConversationById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { data: conversation, error: convError } = await supabase_1.supabase
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
        const { data: messages, error: msgError } = await supabase_1.supabase
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
    }
    catch (error) {
        console.error('Full conversation fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch conversation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getConversationById = getConversationById;
