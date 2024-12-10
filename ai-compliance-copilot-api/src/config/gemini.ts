import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use a standard model as a fallback
export const model = genAI.getGenerativeModel({ 
  model: process.env.GEMINI_MODEL || "gemini-pro"
});

// Vision model for image-based analysis
export const visionModel = genAI.getGenerativeModel({ 
  model: process.env.GEMINI_VISION_MODEL || "gemini-pro-vision"
});