import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { model, visionModel } from '../config/gemini';

export const analyzeDocument = async (req: Request, res: Response) => {
  try {
    const { file_url, conversation_id } = req.body;

    // Remove 'documents/' prefix if present
    const cleanedFileUrl = file_url.startsWith('documents/') 
      ? file_url.replace('documents/', '') 
      : file_url;

    console.log('Attempting to download file:', cleanedFileUrl);

    // Get file from Supabase storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('documents')
      .download(cleanedFileUrl);

    if (fileError) {
      console.error('Supabase storage download error:', fileError);
      return res.status(400).json({ 
        error: 'Failed to analyze document', 
        details: fileError instanceof Error ? fileError.message : String(fileError)
      });
    }

    // Convert file to text (simplified for MVP)
    let text;
    try {
      text = await fileData.text();
      console.log('File converted to text successfully');
    } catch (textError: unknown) {
      console.error('Text conversion error:', textError);
      
      // Type guard to handle the unknown error
      const errorMessage = textError instanceof Error ? textError.message : String(textError);
      
      return res.status(400).json({ 
        error: 'Failed to convert document to text', 
        details: errorMessage 
      });
    }

    // Analyze with Gemini
    const result = await model.generateContent(`
      Analyze this document for regulatory compliance issues:
      ${text}
      
      Focus on:
      1. Truth in Lending Act (TILA)
      2. Equal Credit Opportunity Act (ECOA)
      3. Unfair, Deceptive, or Abusive Acts or Practices (UDAAP)
      
      Format the response as JSON with:
      - regulation_reference
      - severity (Critical, High, Medium, Low)
      - finding_details
      - remediation_steps
    `);

    console.log('Gemini analysis initiated');

    const response = await result.response;
    console.log('Gemini response received');

    let findings;
    try {
      findings = JSON.parse(response.text());
      console.log('Findings parsed successfully');
    } catch (parseError: unknown) {
      console.error('JSON parsing error:', parseError);
      return res.status(400).json({ 
        error: 'Failed to parse analysis results', 
        details: parseError instanceof Error ? parseError.message : String(parseError)
      });
    }

    // Store message and findings
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert([{
        conversation_id,
        file_url: cleanedFileUrl,
        is_ai_response: true,
        content: 'Document Analysis Results'
      }])
      .select()
      .single();

    if (messageError) throw messageError;

    // Store findings
    const { error: findingsError } = await supabase
      .from('compliance_findings')
      .insert(
        findings.map((finding: any) => ({
          message_id: message.id,
          ...finding
        }))
      );

    if (findingsError) throw findingsError;

    res.json({ message_id: message.id, findings });
  } catch (error: unknown) {
    console.error('Analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to analyze document', details: errorMessage });
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