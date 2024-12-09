import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL! });
export const visionModel = genAI.getGenerativeModel({ model: process.env.GEMINI_VISION_MODEL! });