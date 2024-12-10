import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { model, visionModel } from '../config/gemini';

export const analyzeDocument = async (req: Request, res: Response) => {
  try {
    console.log('Analyze Document Request:', {
      body: req.body,
      query: req.query,
      params: req.params
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
    const cleanedFileUrl = decodeURIComponent(fileUrl)
      .replace(/^documents\//, '')  // Remove 'documents/' prefix if present
      .trim();
    console.log('Cleaned File URL:', cleanedFileUrl);

    // Download file from storage
    let fileData;
    try {
      console.log('Supabase Storage Download Attempt:', {
        bucket: 'documents',
        path: cleanedFileUrl,
        url: supabase.storage.from('documents').getPublicUrl(cleanedFileUrl)
      });

      // First, check if file exists
      const folderPath = cleanedFileUrl.split('/').slice(0, -1).join('/');
      const fileName = cleanedFileUrl.split('/').pop();
      
      console.log('Checking file existence:', {
        folderPath,
        fileName
      });

      const { data: listData, error: listError } = await supabase
        .storage
        .from('documents')
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      console.log('Storage List Result:', {
        files: listData?.map(file => file.name),
        error: listError
      });

      // Check if the specific file exists in the list
      const fileExists = listData?.some(file => file.name === fileName);
      
      if (!fileExists) {
        console.error('File not found in storage', {
          path: cleanedFileUrl,
          existingFiles: listData?.map(file => file.name)
        });
        return res.status(404).json({ 
          error: 'Document not found', 
          details: `No file found at path: ${cleanedFileUrl}` 
        });
      }

      const { data, error: fileError } = await supabase
        .storage
        .from('documents')
        .download(cleanedFileUrl);

      if (fileError) {
        console.error('Detailed Supabase storage download error:', {
          error: fileError,
          errorType: typeof fileError,
          errorKeys: Object.keys(fileError || {}),
          stringifiedError: JSON.stringify(fileError)
        });
        return res.status(400).json({ 
          error: 'Failed to download document', 
          details: fileError instanceof Error 
            ? fileError.message 
            : JSON.stringify(fileError)
        });
      }

      fileData = data;
    } catch (downloadError) {
      console.error('Unexpected download error:', {
        error: downloadError,
        errorType: typeof downloadError,
        stringifiedError: JSON.stringify(downloadError)
      });
      return res.status(500).json({ 
        error: 'Unexpected error downloading document', 
        details: downloadError instanceof Error 
          ? downloadError.message 
          : JSON.stringify(downloadError)
      });
    }

    // Read file content
    let fileContent: string;
    try {
      fileContent = await fileData.text();
      console.log('File Content Length:', fileContent.length);
      console.log('First 500 chars:', fileContent.slice(0, 500));
    } catch (textError) {
      console.error('File to text conversion error:', textError);
      return res.status(400).json({ 
        error: 'Failed to convert document to text', 
        details: textError instanceof Error 
          ? textError.message 
          : JSON.stringify(textError)
      });
    }

    // Gemini analysis
    let result;
    try {
      result = await visionModel.generateContent(`
        Analyze this document for potential compliance risks. 
        Provide a JSON response with these keys:
        - risk_level (string: 'low', 'medium', 'high')
        - key_risks (array of strings)
        - remediation_steps (array of strings)
        
        Document content:
        ${fileContent}
      `);
    } catch (geminiError) {
      console.error('Gemini API call error:', geminiError);
      return res.status(500).json({ 
        error: 'Failed to analyze document with AI', 
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

      console.log('Raw Response Text:', responseText);

      // Safely parse the response text
      let findings;
      try {
        findings = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response text:', parseError);
        throw new Error('Invalid JSON response from Gemini');
      }

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
      console.error('Raw Response Text:', responseText);
      
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