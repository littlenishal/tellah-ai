import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { model, visionModel } from '../config/gemini';

export const analyzeDocument = async (req: Request, res: Response) => {
  try {
    console.log('Analyze Document Request:', {
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });

    const { file_url: fileUrl, conversation_id } = req.body;
    
    if (!fileUrl) {
      console.error('Missing file URL');
      return res.status(400).json({ 
        error: 'Missing file URL', 
        details: 'File URL is required in the request body' 
      });
    }

    // Validate and clean file URL
    const cleanedFileUrl = decodeURIComponent(fileUrl);
    console.log('Cleaned File URL:', cleanedFileUrl);

    // Download file from storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('documents')
      .download(cleanedFileUrl);

    if (fileError) {
      console.error('Supabase storage download error:', fileError);
      return res.status(400).json({ 
        error: 'Failed to analyze document', 
        details: fileError instanceof Error 
          ? fileError.message 
          : JSON.stringify(fileError)
      });
    }

    // Read file content
    const fileContent = await fileData.text();
    console.log('File Content Length:', fileContent.length);
    console.log('First 500 chars:', fileContent.slice(0, 500));

    // Gemini analysis
    const result = await visionModel.generateContent(`
      Analyze this document for potential compliance risks. 
      Provide a JSON response with these keys:
      - risk_level (string: 'low', 'medium', 'high')
      - key_risks (array of strings)
      - remediation_steps (array of strings)
      
      Document content:
      ${fileContent}
    `);

    console.log('Gemini analysis initiated');

    const response = await result.response;
    console.log('Gemini response received:', response);
    
    // More robust response handling
    let responseText;
    try {
      // Check if response has a text method
      if (typeof response.text === 'function') {
        responseText = response.text();
      } else if (response.candidates && response.candidates[0]) {
        // Alternative parsing for Gemini response
        responseText = response.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unable to extract text from response');
      }

      console.log('Raw Response Text:', responseText);

      // Attempt to parse the response text
      const findings = JSON.parse(responseText);
      console.log('Parsed Findings:', findings);

      // Store message and findings
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id,
          file_url: cleanedFileUrl,
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
      console.error('Response Text that Failed to Parse:', responseText);
      
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
    console.error('Unexpected Error in Document Analysis:', error);
    
    res.status(500).json({ 
      error: 'Unexpected error during document analysis', 
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