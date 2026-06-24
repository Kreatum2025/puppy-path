import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** True when the public Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Supabase client, or `null` when not configured.
 *
 * Services must fall back to local mock data when this is `null`, so the app
 * runs identically with or without a backend. Slice 1 is read-only/anon
 * (public `breeds`), so we disable auth session persistence — no AsyncStorage
 * dependency and no auth yet.
 */
export const supabase: SupabaseClient | null =
  isSupabaseConfigured && url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
