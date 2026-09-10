import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const LANGUAGE_STORAGE_KEY = 'ruralclap_language';
const memoryFallback = new Map<string, string>();

/**
 * Small persistence adapter for the selected locale, mirroring the pattern
 * used by @repo/auth's ExpoSecureStoreAdapter so both packages behave the
 * same way across web/native and gracefully fall back if storage is
 * unavailable.
 */
export async function getStoredLanguage(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      }
      return memoryFallback.get(LANGUAGE_STORAGE_KEY) || null;
    }

    const val = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
    if (val !== null) return val;
    return memoryFallback.get(LANGUAGE_STORAGE_KEY) || null;
  } catch {
    return memoryFallback.get(LANGUAGE_STORAGE_KEY) || null;
  }
}

export async function setStoredLanguage(lng: string): Promise<void> {
  try {
    memoryFallback.set(LANGUAGE_STORAGE_KEY, lng);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      }
      return;
    }

    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, lng);
  } catch {
    // Memory fallback already set
  }
}
