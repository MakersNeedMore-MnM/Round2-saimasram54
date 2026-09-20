import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Server Client — for use in API routes, server components, and server actions.
 *
 * Uses the secret (service-role) key for full database access.
 * NEVER expose this client or its key to the browser.
 */

let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverClient) return serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      'Missing Supabase server environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are set in .env.local'
    );
  }

  serverClient = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serverClient;
}

/**
 * Pre-initialized admin client for convenient direct imports.
 * Usage: import { supabaseAdmin } from '@/lib/supabase/server';
 */
export const supabaseAdmin = getSupabaseServerClient();
