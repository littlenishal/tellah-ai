"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversation_controller_1 = require("../controllers/conversation.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticateToken, conversation_controller_1.createConversation);
router.get('/', auth_middleware_1.authenticateToken, conversation_controller_1.getConversations);
router.get('/:id', auth_middleware_1.authenticateToken, conversation_controller_1.getConversationById);
exports.default = router;
