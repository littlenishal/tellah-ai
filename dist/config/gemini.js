"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visionModel = exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('Missing Gemini API Key');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
// Use a standard model as a fallback
exports.model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-pro"
});
// Vision model for image-based analysis
exports.visionModel = genAI.getGenerativeModel({
    model: process.env.GEMINI_VISION_MODEL || "gemini-pro-vision"
});
