"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authRoutes = express_1.default.Router();
const { signUp: signup, signIn: signin, signOut: signout, getCurrentUser, verifyEmail } = auth_controller_1.authController;
// Public routes
authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
authRoutes.post('/verify-email', verifyEmail);
// Protected routes (require authentication)
authRoutes.post('/signout', signout);
authRoutes.get('/current-user', auth_middleware_1.authenticateToken, getCurrentUser);
exports.default = authRoutes;
