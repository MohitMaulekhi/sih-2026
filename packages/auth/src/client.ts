import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExpoSecureStoreAdapter } from './storage';
import { Platform } from 'react-native';

let supabaseInstance: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://zogktmqmoeauncwbpxqz.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_iEWxkLSTfMCMxvpnax8flw_ZrTwIGyh';

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY;

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });

  return supabaseInstance;
}

export const supabase = getSupabaseClient();
