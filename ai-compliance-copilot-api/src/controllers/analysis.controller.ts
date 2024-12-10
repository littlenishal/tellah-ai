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

    // Get file from Supabase storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('documents')
      .download(cleanedFileUrl);

    if (fileError) throw fileError;

    // Convert file to text (simplified for MVP)
    const text = await fileData.text();

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

    const response = await result.response;
    const findings = JSON.parse(response.text());

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
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch findings' });
  }
};