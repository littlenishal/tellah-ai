"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const supabase_1 = require("../config/supabase");
exports.authController = {
    // Sign up a new user
    async signUp(req, res) {
        var _a, _b;
        try {
            const _c = req.body, { email, password } = _c, metadata = __rest(_c, ["email", "password"]);
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            // Sign up the user
            const { data, error } = await supabase_1.supabase.auth.signUp({
                email,
                password,
                options: {
                    // Optional: add additional user metadata
                    data: metadata
                }
            });
            if (error) {
                return res.status(400).json({
                    error: 'Sign up failed',
                    details: error.message
                });
            }
            // Return user details (excluding sensitive information)
            res.status(201).json({
                user: {
                    id: (_a = data.user) === null || _a === void 0 ? void 0 : _a.id,
                    email: (_b = data.user) === null || _b === void 0 ? void 0 : _b.email,
                },
                message: 'User created successfully'
            });
        }
        catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Sign in a user
    async signIn(req, res) {
        var _a, _b, _c;
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            // Sign in the user
            const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    details: error.message
                });
            }
            // Return access token and user details
            res.status(200).json({
                accessToken: (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token,
                user: {
                    id: (_b = data.user) === null || _b === void 0 ? void 0 : _b.id,
                    email: (_c = data.user) === null || _c === void 0 ? void 0 : _c.email,
                }
            });
        }
        catch (error) {
            console.error('Signin error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Sign out a user
    async signOut(req, res) {
        var _a;
        try {
            // Get the access token from the request
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(400).json({ error: 'No token provided' });
            }
            // Sign out the user
            const { error } = await supabase_1.supabase.auth.signOut();
            if (error) {
                return res.status(400).json({
                    error: 'Logout failed',
                    details: error.message
                });
            }
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            console.error('Signout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Get current user profile
    async getCurrentUser(req, res) {
        try {
            // The user should already be authenticated by the middleware
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            res.status(200).json({
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    // Add any other non-sensitive user details
                }
            });
        }
        catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
