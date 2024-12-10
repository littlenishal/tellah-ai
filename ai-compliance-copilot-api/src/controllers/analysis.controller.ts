import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { model, visionModel } from '../config/gemini';

export const analyzeText = async (req: Request, res: Response) => {
  try {
    console.log('Analyze Text Request:', {
      body: req.body,
      query: req.query,
      params: req.params
    });

    const { text, conversation_id } = req.body;
    
    if (!text) {
      console.error('Missing text content');
      return res.status(400).json({ 
        error: 'Missing text content', 
        details: 'Text content is required in the request body' 
      });
    }

    // Gemini analysis
    let result;
    try {
      console.log('Gemini Model Used:', model.model);
      
      result = await model.generateContent(`
        You are a financial document compliance expert. Analyze the following text for potential regulatory risks.

        Strictly return a JSON response with this exact structure:
        {
          "risk_level": "low|medium|high",
          "key_risks": [
            "specific risk description 1",
            "specific risk description 2"
          ],
          "remediation_steps": [
            "specific remediation step 1",
            "specific remediation step 2"
          ]
        }

        If you cannot identify risks, return:
        {
          "risk_level": "low",
          "key_risks": [],
          "remediation_steps": []
        }

        Text to analyze:
        ${text}
      `);
    } catch (geminiError) {
      console.error('Detailed Gemini API call error:', {
        error: geminiError,
        errorType: typeof geminiError,
        errorName: geminiError instanceof Error ? geminiError.name : 'Unknown',
        errorMessage: geminiError instanceof Error ? geminiError.message : JSON.stringify(geminiError),
        errorStack: geminiError instanceof Error ? geminiError.stack : 'No stack trace',
        modelUsed: model.model
      });
      return res.status(500).json({ 
        error: 'Failed to analyze text with AI', 
        details: geminiError instanceof Error 
          ? geminiError.message 
          : JSON.stringify(geminiError)
      });
    }

    // Process Gemini response
    let responseText: string = '';
    try {
      // Attempt to extract text from response
      const candidates = result.response.candidates;
      
      if (!candidates || candidates.length === 0) {
        throw new Error('No candidates in Gemini response');
      }

      const firstCandidate = candidates[0];
      const parts = firstCandidate.content?.parts;
      
      if (!parts || parts.length === 0) {
        throw new Error('No parts in Gemini response candidate');
      }

      responseText = parts[0].text || '';

      if (!responseText) {
        throw new Error('Empty response text from Gemini');
      }

      console.log('Raw Gemini Response:', responseText);

      // Extract JSON from code block if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      const cleanedResponseText = jsonMatch 
        ? jsonMatch[1] 
        : responseText.trim();

      // Safely parse the response text
      let findings;
      try {
        findings = JSON.parse(cleanedResponseText);
      } catch (parseError) {
        console.error('Failed to parse response text:', {
          responseText: cleanedResponseText,
          parseError
        });
        throw new Error('Invalid JSON response from Gemini');
      }

      console.log('Parsed Findings:', findings);

      // Store message and findings
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id,
          is_ai_response: true,
          content: JSON.stringify(findings)
        }])
        .select()
        .single();

      if (messageError) {
        console.error('Supabase message insert error:', messageError);
        return res.status(500).json({ 
          error: 'Failed to store analysis', 
          details: messageError instanceof Error 
            ? messageError.message 
            : JSON.stringify(messageError)
        });
      }

      res.json({ message_id: message.id, findings });

    } catch (parseError: unknown) {
      console.error('Parsing Error:', parseError);
      console.error('Raw Gemini Response:', responseText);
      
      return res.status(400).json({ 
        error: 'Failed to parse analysis results', 
        details: parseError instanceof Error 
          ? parseError.message 
          : (typeof parseError === 'object' 
             ? JSON.stringify(parseError) 
             : String(parseError))
      });
    }
  } catch (error: unknown) {
    console.error('Unexpected Error in Text Analysis:', error);
    
    res.status(500).json({ 
      error: 'Unexpected error during text analysis', 
      details: error instanceof Error 
        ? error.message 
        : (typeof error === 'object' 
           ? JSON.stringify(error) 
           : String(error))
    });
  }
};

export const getFindings = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const { data, error } = await supabase
      .from('compliance_findings')
      .select('*')
      .eq('message_id', messageId);

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    console.error('Error fetching findings:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to fetch findings', details: errorMessage });
  }
};