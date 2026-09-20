import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Browser Client — for use in client components (React hooks, event handlers).
 *
 * Uses the publishable (anon) key which is safe to expose in the browser.
 * Row Level Security (RLS) policies in Supabase control data access.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      'Missing Supabase browser environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local'
    );
  }

  browserClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  return browserClient;
}
