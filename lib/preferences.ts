export const PREFERRED_LANG_COOKIE = 'preferred_lang';
export const FONT_SIZE_STORAGE_KEY = 'bible_font_size';

export type FontSizeLevel = 'normal' | 'huge' | 'colossal';

export function setClientPreferredLanguage(langId: string): void {
  if (typeof window === 'undefined') return;
  // Set cookie for 1 year
  document.cookie = `${PREFERRED_LANG_COOKIE}=${encodeURIComponent(langId)}; path=/; max-age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem(PREFERRED_LANG_COOKIE, langId);
  } catch {}
}

export function getClientPreferredLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(PREFERRED_LANG_COOKIE);
    if (val) return val;
  } catch {}

  const match = document.cookie.match(new RegExp(`(?:^|; )${PREFERRED_LANG_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setClientFontSize(size: FontSizeLevel): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
  } catch {}
}

export function getClientFontSize(): FontSizeLevel {
  if (typeof window === 'undefined') return 'huge';
  try {
    const val = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (val === 'normal' || val === 'huge' || val === 'colossal') {
      return val;
    }
  } catch {}
  return 'huge'; // Default to huge for majestic readability
}
