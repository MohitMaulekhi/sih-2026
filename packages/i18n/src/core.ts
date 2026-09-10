import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import { getStoredLanguage, setStoredLanguage } from './storage';

export const SUPPORTED_LANGUAGES = ['en', 'hi'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
} as const;

let initPromise: Promise<void> | null = null;

/**
 * Initializes i18next once, restoring the persisted locale (falling back to
 * English if nothing was stored yet). Safe to call multiple times — the
 * underlying init only runs once.
 */
export function initI18n(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const stored = await getStoredLanguage();
    const lng: SupportedLanguage =
      stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)
        ? (stored as SupportedLanguage)
        : DEFAULT_LANGUAGE;

    await i18n.use(initReactI18next).init({
      resources,
      lng,
      fallbackLng: DEFAULT_LANGUAGE,
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  })();

  return initPromise;
}

/**
 * Changes the active language and persists the choice so it survives app
 * restarts.
 */
export async function changeLanguage(lng: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lng);
  await setStoredLanguage(lng);
}

export { default as i18nInstance } from 'i18next';
export { useTranslation } from 'react-i18next';
