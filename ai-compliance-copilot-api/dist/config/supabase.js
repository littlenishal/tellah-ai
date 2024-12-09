"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAuth = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Ensure environment variables are loaded
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    console.error('Supabase configuration is incomplete');
    process.exit(1);
}
// Create Supabase client with service role key for admin operations
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false
    }
});
// Create a separate client for authentication
exports.supabaseAuth = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false
    }
});
