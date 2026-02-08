/**
 * @file supabase.ts
 * @description Supabase client for Arsenal Nexus
 * 
 * Provides a lazy-initialized browser client that only creates
 * the Supabase connection when actually needed AND when keys are configured.
 * This prevents build-time crashes when NEXT_PUBLIC_SUPABASE_ANON_KEY is empty.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== "undefined" && supabaseAnonKey.length > 10);
}

// Lazy singleton — only created when both URL and key exist
let _client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!_client) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    _client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

/**
 * Proxy object: safe to import at module scope.
 * Actual Supabase calls should go through weapons-service.ts which checks isSupabaseConfigured() first.
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getSupabaseClient() as unknown;
    return (client as Record<string | symbol, unknown>)[prop];
  },
});

export default supabase;
