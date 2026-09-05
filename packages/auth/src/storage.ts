import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const memoryFallback = new Map<string, string>();

function sanitizeKey(key: string): string {
  // SecureStore keys on Android must only contain alphanumeric characters, '.', '-', and '_'
  return key.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return memoryFallback.get(key) || null;
      }

      const safe = sanitizeKey(key);
      const val = await SecureStore.getItemAsync(safe);
      if (val !== null) return val;
      return memoryFallback.get(key) || null;
    } catch (err) {
      return memoryFallback.get(key) || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      memoryFallback.set(key, value);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return;
      }

      const safe = sanitizeKey(key);
      await SecureStore.setItemAsync(safe, value);
    } catch (err) {
      // Memory fallback is already set
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      memoryFallback.delete(key);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return;
      }

      const safe = sanitizeKey(key);
      await SecureStore.deleteItemAsync(safe);
    } catch (err) {
      // Memory fallback is already cleaned
    }
  },
};
