/**
 * Server-side Supabase client with service role key
 * 
 * This client bypasses Row Level Security (RLS) and should only be used
 * on the server-side for administrative operations like seeding data.
 * 
 * Usage:
 * - Import this in server-side code only (API routes, hooks, etc.)
 * - Use for database operations that need to bypass RLS
 * - Never expose this client or its key to the client-side
 */

import { createClient } from "@supabase/supabase-js";
import { 
    PUBLIC_SUPABASE_URL, 
    PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY 
} from "$env/static/public";
import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import type { Database } from "../types/supabase.js";

const supabaseUrl = PUBLIC_SUPABASE_URL;

// Use service role key if available, fallback to anon key
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
    throw new Error("Missing PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseKey) {
    throw new Error("Missing Supabase keys - need either SUPABASE_SERVICE_ROLE_KEY or PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
}

// Create admin client with service role permissions
export const supabaseAdmin = createClient<Database>(
    supabaseUrl, 
    supabaseKey,
    {
        auth: {
            // Disable auth for admin operations
            autoRefreshToken: false,
            persistSession: false
        },
        // Optional: Add database schema if needed
        db: {
            schema: 'public'
        }
    }
);

// Helper function to check if we're using service role
export function isUsingServiceRole(): boolean {
    return !!SUPABASE_SERVICE_ROLE_KEY;
}

// Type exports for server-side use
export type { Database } from "../types/supabase.js";