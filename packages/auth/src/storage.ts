import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const memoryFallback = new Map<string, string>();

// Android Keystore-backed SecureStore rejects values over ~2048 bytes (Supabase
// sessions routinely exceed this once access + refresh tokens are included).
// Values above this size are split across numbered chunk keys instead.
const CHUNK_SIZE = 1800;
const CHUNK_COUNT_SUFFIX = '_chunks';

function sanitizeKey(key: string): string {
  // SecureStore keys on Android must only contain alphanumeric characters, '.', '-', and '_'
  return key.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

async function getChunkedItem(safeKey: string): Promise<string | null> {
  const countRaw = await SecureStore.getItemAsync(safeKey + CHUNK_COUNT_SUFFIX);
  if (countRaw === null) {
    // No chunk metadata — fall back to a plain (unchunked) value, if any.
    return SecureStore.getItemAsync(safeKey);
  }

  const count = parseInt(countRaw, 10);
  if (!Number.isFinite(count) || count <= 0) return null;

  const chunks: string[] = [];
  for (let i = 0; i < count; i++) {
    const chunk = await SecureStore.getItemAsync(`${safeKey}_${i}`);
    if (chunk === null) return null;
    chunks.push(chunk);
  }
  return chunks.join('');
}

async function setChunkedItem(safeKey: string, value: string): Promise<void> {
  // Clear out any previous chunk set (a new value may need fewer chunks).
  await clearChunks(safeKey);

  if (value.length <= CHUNK_SIZE) {
    await SecureStore.setItemAsync(safeKey, value);
    return;
  }

  await SecureStore.deleteItemAsync(safeKey).catch(() => {});

  const chunkCount = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < chunkCount; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await SecureStore.setItemAsync(`${safeKey}_${i}`, chunk);
  }
  await SecureStore.setItemAsync(safeKey + CHUNK_COUNT_SUFFIX, String(chunkCount));
}

async function clearChunks(safeKey: string): Promise<void> {
  const countRaw = await SecureStore.getItemAsync(safeKey + CHUNK_COUNT_SUFFIX);
  if (countRaw === null) return;

  const count = parseInt(countRaw, 10);
  if (Number.isFinite(count) && count > 0) {
    for (let i = 0; i < count; i++) {
      await SecureStore.deleteItemAsync(`${safeKey}_${i}`).catch(() => {});
    }
  }
  await SecureStore.deleteItemAsync(safeKey + CHUNK_COUNT_SUFFIX).catch(() => {});
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
      const val = await getChunkedItem(safe);
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
      await setChunkedItem(safe, value);
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
      await clearChunks(safe);
      await SecureStore.deleteItemAsync(safe).catch(() => {});
    } catch (err) {
      // Memory fallback is already cleaned
    }
  },
};
