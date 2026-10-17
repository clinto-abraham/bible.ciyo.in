'use client';

// Language locale mapping for Web Speech API text-to-speech
export const LANGUAGE_LOCALES: Record<string, { bcp47: string[]; label: string }> = {
  hebrew: { bcp47: ['he-IL', 'he', 'iw-IL', 'iw'], label: 'Hebrew' },
  english: { bcp47: ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en'], label: 'English (KJV)' },
  'english-bsb': { bcp47: ['en-US', 'en-GB', 'en-AU', 'en'], label: 'English (BSB)' },
  'english-ylt': { bcp47: ['en-GB', 'en-US', 'en'], label: 'English (YLT)' },
  malayalam: { bcp47: ['ml-IN', 'ml', 'hi-IN', 'en-IN'], label: 'Malayalam' },
  greek: { bcp47: ['el-GR', 'el'], label: 'Koine Greek' },
  aramaic: { bcp47: ['syr', 'ar-XA', 'ar-SY', 'ar-SA', 'he-IL'], label: 'Syriac Aramaic' },
  latin: { bcp47: ['it-IT', 'la', 'es-ES'], label: 'Latin' },
  german: { bcp47: ['de-DE', 'de-AT', 'de'], label: 'German' },
  french: { bcp47: ['fr-FR', 'fr-CA', 'fr'], label: 'French' },
  spanish: { bcp47: ['es-ES', 'es-MX', 'es-US', 'es'], label: 'Spanish' },
  russian: { bcp47: ['ru-RU', 'ru'], label: 'Russian' },
  chinese: { bcp47: ['zh-CN', 'zh-TW', 'zh-HK', 'zh'], label: 'Chinese' },
  burmese: { bcp47: ['my-MM', 'my'], label: 'Burmese' },
  slavic: { bcp47: ['ru-RU', 'uk-UA', 'bg-BG'], label: 'Church Slavonic' },
};

// Novelty and low-quality joke voices on macOS/Windows that MUST be filtered out
export const NOVELTY_VOICE_NAMES = [
  'whisper',
  'deranged',
  'zarvox',
  'trinoids',
  'bad news',
  'good news',
  'hysterical',
  'pipe organ',
  'bubbles',
  'bells',
  'boing',
  'cellos',
  'albert',
  'bahh',
  'fred',
  'junior',
  'ralph',
  'princess',
  'organ',
  'wobble',
];

// Names commonly associated with female voices
const FEMALE_VOICE_PATTERNS = [
  'female',
  'woman',
  'girl',
  'samantha',
  'karen',
  'victoria',
  'moira',
  'tessa',
  'serena',
  'ava',
  'allison',
  'kate',
  'susan',
  'zira',
  'jenny',
  'aria',
  'carmit',
  'lekha',
  'helena',
  'laura',
  'monica',
  'paulina',
  'milena',
  'alva',
  'klara',
  'mariya',
  'elena',
  'damayanti',
  'kanya',
  'kyoko',
  'yuna',
  'ting-ting',
  'sin-ji',
  'meijia',
  'veena',
  'ananya',
  'priya',
  'nita',
  'kavya',
  'shreya',
  'fiona',
];

// Names commonly associated with male voices
const MALE_VOICE_PATTERNS = [
  'male',
  'man',
  'boy',
  'alex',
  'daniel',
  'oliver',
  'tom',
  'jamie',
  'george',
  'david',
  'guy',
  'mark',
  'richard',
  'diego',
  'jorge',
  'thomas',
  'yannick',
  'martin',
  'stefan',
  'mikhail',
  'yuri',
  'kazuhiro',
  'tarik',
  'rishi',
  'anil',
  'ravi',
  'asaf',
];

export type VoiceGender = 'auto' | 'female' | 'male';

export interface AudioSettings {
  gender: VoiceGender;
  rate: number; // 0.75 to 1.3
  preferredVoiceName?: string | null;
}

const SETTINGS_STORAGE_KEY = 'bible_audio_settings';

export function getStoredAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') {
    return { gender: 'auto', rate: 0.92, preferredVoiceName: null };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AudioSettings>;
      return {
        gender: parsed.gender || 'auto',
        rate: parsed.rate || 0.92,
        preferredVoiceName: parsed.preferredVoiceName || null,
      };
    }
  } catch {
    // fallback
  }
  return { gender: 'auto', rate: 0.92, preferredVoiceName: null };
}

export function saveAudioSettings(settings: Partial<AudioSettings>): AudioSettings {
  const current = getStoredAudioSettings();
  const updated: AudioSettings = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('bible_audio_settings_updated'));
    } catch {
      // ignore
    }
  }
  return updated;
}

// Check if browser supports Web Speech API
export function isAudioSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

// Global cached voice list for browsers where getVoices() loads asynchronously
let cachedVoices: SpeechSynthesisVoice[] = [];

export function getLoadedVoices(): SpeechSynthesisVoice[] {
  if (!isAudioSupported()) return [];
  const list = window.speechSynthesis.getVoices();
  if (list && list.length > 0) {
    cachedVoices = list;
    return list;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) cachedVoices = v;
  };
}

// Detect perceived gender of a voice
export function detectVoiceGender(voice: SpeechSynthesisVoice): 'female' | 'male' | 'unknown' {
  const lowerName = voice.name.toLowerCase();
  for (const f of FEMALE_VOICE_PATTERNS) {
    if (lowerName.includes(f)) return 'female';
  }
  for (const m of MALE_VOICE_PATTERNS) {
    if (lowerName.includes(m)) return 'male';
  }
  return 'unknown';
}

// Check if a voice is a novelty/joke voice
export function isNoveltyVoice(voice: SpeechSynthesisVoice): boolean {
  const lowerName = voice.name.toLowerCase();
  return NOVELTY_VOICE_NAMES.some((novelty) => lowerName.includes(novelty));
}

// Check if a voice natively speaks Hebrew
export function isNativeHebrewVoice(voice: SpeechSynthesisVoice): boolean {
  const l = voice.lang.toLowerCase().replace(/_/g, '-');
  const n = voice.name.toLowerCase();
  return (
    l.startsWith('he') ||
    l.startsWith('iw') ||
    n.includes('carmit') ||
    n.includes('עברית') ||
    n.includes('hebrew')
  );
}

// Check if a voice natively speaks Koine/Modern Greek
export function isNativeGreekVoice(voice: SpeechSynthesisVoice): boolean {
  const l = voice.lang.toLowerCase().replace(/_/g, '-');
  const n = voice.name.toLowerCase();
  return (
    l.startsWith('el') ||
    n.includes('greek') ||
    n.includes('ελληνικά') ||
    n.includes('melina') ||
    n.includes('nikos')
  );
}

// Check if a voice natively speaks Syriac or Semitic Arabic
export function isNativeAramaicVoice(voice: SpeechSynthesisVoice): boolean {
  const l = voice.lang.toLowerCase().replace(/_/g, '-');
  const n = voice.name.toLowerCase();
  return (
    l.startsWith('syr') ||
    l.startsWith('ar') ||
    n.includes('syriac') ||
    n.includes('arabic') ||
    n.includes('aramaic')
  );
}

// Check if a voice is considered native for a given biblical language
export function isNativeVoiceForLanguage(voice: SpeechSynthesisVoice, langId: string): boolean {
  if (langId === 'hebrew') return isNativeHebrewVoice(voice);
  if (langId === 'greek') return isNativeGreekVoice(voice);
  if (langId === 'aramaic') return isNativeAramaicVoice(voice);

  const mapping = LANGUAGE_LOCALES[langId];
  if (!mapping) return false;

  const vLang = voice.lang.toLowerCase().replace(/_/g, '-');
  return mapping.bcp47.some((code) => {
    const clean = code.toLowerCase().replace(/_/g, '-');
    return vLang === clean || vLang.startsWith(clean.split('-')[0]);
  });
}

// Retrieve curated, non-novelty voices available for a given language
export function getAvailableVoicesForLang(langId: string): SpeechSynthesisVoice[] {
  const allVoices = getLoadedVoices();
  if (allVoices.length === 0) return [];

  const mapping = LANGUAGE_LOCALES[langId] || { bcp47: ['en-US', 'en'] };

  const matchingVoices = allVoices.filter((v) => {
    // Reject novelty voices (like "Whisper", "Deranged", etc.)
    if (isNoveltyVoice(v)) return false;

    if (langId === 'hebrew' && isNativeHebrewVoice(v)) return true;
    if (langId === 'greek' && isNativeGreekVoice(v)) return true;
    if (langId === 'aramaic' && isNativeAramaicVoice(v)) return true;

    const vLang = v.lang.toLowerCase().replace(/_/g, '-');
    return mapping.bcp47.some((code) => {
      const cleanCode = code.toLowerCase().replace(/_/g, '-');
      return vLang === cleanCode || vLang.startsWith(cleanCode.split('-')[0]);
    });
  });

  return matchingVoices;
}

// Find best matching voice for a language respecting gender and preferred voice
export function getBestVoice(
  langId: string,
  customSettings?: Partial<AudioSettings>
): SpeechSynthesisVoice | null {
  const allVoices = getLoadedVoices();
  if (allVoices.length === 0) return null;

  const settings = { ...getStoredAudioSettings(), ...customSettings };

  // 1. If user explicitly specified a voice name that exists, use it
  if (settings.preferredVoiceName) {
    const preferred = allVoices.find(
      (v) => v.name.toLowerCase() === settings.preferredVoiceName?.toLowerCase()
    );
    if (preferred && !isNoveltyVoice(preferred)) {
      return preferred;
    }
  }

  // 2. Filter available candidate voices for this language
  const candidates = getAvailableVoicesForLang(langId);

  if (candidates.length > 0) {
    // If gender preference is female
    if (settings.gender === 'female') {
      const femaleVoice = candidates.find((v) => detectVoiceGender(v) === 'female');
      if (femaleVoice) return femaleVoice;
    }

    // If gender preference is male
    if (settings.gender === 'male') {
      const maleVoice = candidates.find((v) => detectVoiceGender(v) === 'male');
      if (maleVoice) return maleVoice;
    }

    // Prefer natural / Google / Apple voices over generic
    const naturalVoice = candidates.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Carmit') ||
        v.name.includes('Natural') ||
        v.name.includes('Samantha') ||
        v.name.includes('Alex') ||
        v.name.includes('Daniel')
    );
    if (naturalVoice) return naturalVoice;

    return candidates[0];
  }

  // Fallback when NO native voice exists for the language (e.g. Hebrew on a browser without Hebrew pack)
  // We match a high-quality voice of the requested gender:
  if (settings.gender === 'female') {
    const femaleFallback = allVoices.find(
      (v) =>
        !isNoveltyVoice(v) &&
        detectVoiceGender(v) === 'female' &&
        (v.lang.startsWith('en') || v.lang.startsWith('it') || v.lang.startsWith('es'))
    );
    if (femaleFallback) return femaleFallback;
  } else if (settings.gender === 'male') {
    const maleFallback = allVoices.find(
      (v) =>
        !isNoveltyVoice(v) &&
        detectVoiceGender(v) === 'male' &&
        (v.lang.startsWith('en') || v.lang.startsWith('it') || v.lang.startsWith('es'))
    );
    if (maleFallback) return maleFallback;
  }

  // General fallback: non-novelty English voice
  const fallback = allVoices.find(
    (v) => !isNoveltyVoice(v) && v.lang.toLowerCase().startsWith('en')
  );

  return fallback || null;
}

export interface SpeakOptions {
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.5 to 1.5
  gender?: VoiceGender;
  voiceName?: string | null;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

// Hebrew consonant and vowel phonetic transliteration mapping
const HEBREW_TRANSLIT_MAP: Record<string, string> = {
  'א': '',
  'ב': 'v',
  'בּ': 'b',
  'ג': 'g',
  'ד': 'd',
  'ה': 'h',
  'ו': 'v',
  'ז': 'z',
  'ח': 'ch',
  'ט': 't',
  'י': 'y',
  'כ': 'kh',
  'כּ': 'k',
  'ך': 'kh',
  'ל': 'l',
  'מ': 'm',
  'ם': 'm',
  'נ': 'n',
  'ן': 'n',
  'ס': 's',
  'ע': '',
  'פ': 'f',
  'פּ': 'p',
  'ף': 'f',
  'צ': 'ts',
  'ץ': 'ts',
  'ק': 'k',
  'ר': 'r',
  'ש': 'sh',
  'שׁ': 'sh',
  'שׂ': 's',
  'ת': 't',
  // Vowels
  '\u05B0': 'e', // sheva
  '\u05B1': 'e', // chatef segol
  '\u05B2': 'a', // chatef patach
  '\u05B3': 'o', // chatef qamats
  '\u05B4': 'i', // hireq
  '\u05B5': 'e', // tsere
  '\u05B6': 'e', // segol
  '\u05B7': 'a', // patach
  '\u05B8': 'a', // qamats
  '\u05B9': 'o', // holam
  '\u05BA': 'o', // holam haser
  '\u05BB': 'u', // qubuts
  '\u05BC': '', // dagesh
  '\u05C1': '', // shin dot
  '\u05C2': '', // sin dot
};

export function transliterateHebrew(heb: string): string {
  const t = heb
    .replace(/[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C4\u05C5]/g, '')
    .replace(/שׁ/g, 'sh')
    .replace(/שׂ/g, 's')
    .replace(/בּ/g, 'b')
    .replace(/כּ/g, 'k')
    .replace(/פּ/g, 'p')
    .replace(/\u05C3/g, '.')
    .replace(/\u05BE/g, ' ');

  let out = '';
  for (const ch of t) {
    if (HEBREW_TRANSLIT_MAP[ch] !== undefined) {
      out += HEBREW_TRANSLIT_MAP[ch];
    } else if (/[a-zA-Z0-9\s.,!?;:]/.test(ch)) {
      out += ch;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

// Koine Greek letter mapping for devices lacking a native Greek TTS voice
const GREEK_TRANSLIT_MAP: Record<string, string> = {
  'α': 'a', 'ά': 'a', 'ὰ': 'a', 'ᾶ': 'a', 'ἀ': 'a', 'ἁ': 'ha', 'ἄ': 'a', 'ἅ': 'ha', 'ἆ': 'a', 'ἇ': 'ha', 'ᾳ': 'a', 'ᾴ': 'a', 'ᾷ': 'a',
  'β': 'v',
  'γ': 'g',
  'δ': 'd',
  'ε': 'e', 'έ': 'e', 'ὲ': 'e', 'ἐ': 'e', 'ἑ': 'he', 'ἔ': 'e', 'ἕ': 'he',
  'ζ': 'z',
  'η': 'i', 'ή': 'i', 'ὴ': 'i', 'ῆ': 'i', 'ἠ': 'i', 'ἡ': 'hi', 'ἤ': 'i', 'ἥ': 'hi', 'ἦ': 'i', 'ἧ': 'hi', 'ῃ': 'i', 'ῄ': 'i', 'ῇ': 'i',
  'θ': 'th',
  'ι': 'i', 'ί': 'i', 'ὶ': 'i', 'ῖ': 'i', 'ἰ': 'i', 'ἱ': 'hi', 'ἴ': 'i', 'ἵ': 'hi', 'ἶ': 'i', 'ἷ': 'hi', 'ϊ': 'i', 'ΐ': 'i',
  'κ': 'k',
  'λ': 'l',
  'μ': 'm',
  'ν': 'n',
  'ξ': 'x',
  'ο': 'o', 'ό': 'o', 'ὸ': 'o', 'ὀ': 'o', 'ὁ': 'ho', 'ὄ': 'o', 'ὅ': 'ho',
  'π': 'p',
  'ρ': 'r', 'ῤ': 'r', 'ῥ': 'rh',
  'σ': 's', 'ς': 's',
  'τ': 't',
  'υ': 'y', 'ύ': 'y', 'ὺ': 'y', 'ῦ': 'y', 'ὐ': 'y', 'ὑ': 'hy', 'ὔ': 'y', 'ὕ': 'hy', 'ὖ': 'y', 'ὗ': 'hy', 'ϋ': 'y', 'ΰ': 'y',
  'φ': 'ph',
  'χ': 'ch',
  'ψ': 'ps',
  'ω': 'o', 'ώ': 'o', 'ὼ': 'o', 'ῶ': 'o', 'ὠ': 'o', 'ὡ': 'ho', 'ὤ': 'o', 'ὥ': 'ho', 'ὦ': 'o', 'ὧ': 'ho', 'ῳ': 'o', 'ῴ': 'o', 'ῷ': 'o',
};

const GREEK_DIPHTHONGS: Array<[string, string]> = [
  ['ου', 'ou'], ['ού', 'ou'], ['οὺ', 'ou'], ['οῦ', 'ou'],
  ['αι', 'ai'], ['αί', 'ai'], ['αὶ', 'ai'], ['αῖ', 'ai'],
  ['ει', 'ei'], ['εί', 'ei'], ['εὶ', 'ei'], ['εῖ', 'ei'],
  ['οι', 'oi'], ['οί', 'oi'], ['οὶ', 'oi'], ['οῖ', 'oi'],
  ['υι', 'ui'], ['υί', 'ui'], ['υὶ', 'ui'], ['υῖ', 'ui'],
  ['αυ', 'av'], ['αύ', 'av'], ['αὺ', 'av'], ['αῦ', 'av'],
  ['ευ', 'ev'], ['εύ', 'ev'], ['εὺ', 'ev'], ['εῦ', 'ev'],
  ['γγ', 'ng'], ['γκ', 'nk'], ['γχ', 'nch'], ['μπ', 'mp'], ['ντ', 'nt'],
];

export function transliterateGreek(greek: string): string {
  let s = greek.toLowerCase();
  for (const [diph, repl] of GREEK_DIPHTHONGS) {
    s = s.replaceAll(diph, repl);
  }
  let out = '';
  for (const ch of s) {
    if (GREEK_TRANSLIT_MAP[ch] !== undefined) {
      out += GREEK_TRANSLIT_MAP[ch];
    } else if (/[a-zA-Z0-9\s.,!?;:]/.test(ch)) {
      out += ch;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

// Syriac Aramaic letter mapping for devices lacking a native Syriac voice
const SYRIAC_TRANSLIT_MAP: Record<string, string> = {
  'ܐ': 'a',
  'ܒ': 'b',
  'ܓ': 'g',
  'ܕ': 'd',
  'ܗ': 'h',
  'ܘ': 'w',
  'ܙ': 'z',
  'ܚ': 'kh',
  'ܛ': 't',
  'ܝ': 'y',
  'ܟ': 'k',
  'ܠ': 'l',
  'ܡ': 'm',
  'ܢ': 'n',
  'ܣ': 's',
  'ܤ': 's',
  'ܥ': 'e',
  'ܦ': 'p',
  'ܧ': 'p',
  'ܨ': 'ts',
  'ܩ': 'q',
  'ܪ': 'r',
  'ܫ': 'sh',
  'ܬ': 't',
};

export function transliterateAramaic(aramaic: string): string {
  let out = '';
  for (const ch of aramaic) {
    if (SYRIAC_TRANSLIT_MAP[ch] !== undefined) {
      out += SYRIAC_TRANSLIT_MAP[ch];
    } else if (/[a-zA-Z0-9\s.,!?;:]/.test(ch)) {
      out += ch;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

// Keep active utterances referenced in memory to prevent V8 Garbage Collection from cutting off speech
const activeUtterances = new Set<SpeechSynthesisUtterance>();

// Chromium 15-second speech synthesis keep-alive heartbeat
let keepAliveTimer: NodeJS.Timeout | null = null;

function startKeepAlive() {
  if (keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 9000);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

// Clean and prepare text for speech synthesis tailored to biblical languages
export function sanitizeTextForSpeech(
  text: string,
  langId: string,
  hasNativeVoice: boolean
): string {
  let cleaned = text
    .replace(/\[\d+\]/g, '') // remove footnote references [1]
    .replace(/[\(\)]/g, '') // remove parenthetical markers
    .trim();

  if (langId === 'hebrew') {
    if (hasNativeVoice) {
      // 1. Remove cantillation trope marks (\u0591-\u05AF), meteg (\u05BD), and rare liturgical signs
      cleaned = cleaned.replace(/[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C4\u05C5]/g, '');
      // 2. Replace sof pasuq (\u05C3) with sentence period
      cleaned = cleaned.replace(/\u05C3/g, '.');
      // 3. Replace maqaf hyphen (\u05BE) with space
      cleaned = cleaned.replace(/\u05BE/g, ' ');
      // 4. Normalize Unicode
      cleaned = cleaned.normalize('NFC');
    } else {
      // Fallback: If no Hebrew voice is installed in user browser, transliterate to phonetic text
      cleaned = transliterateHebrew(cleaned);
    }
  } else if (langId === 'greek') {
    if (hasNativeVoice) {
      cleaned = cleaned.normalize('NFC');
    } else {
      // Fallback: If no Greek voice is installed in user browser (e.g. mobile Safari), transliterate to phonetic Latin
      cleaned = transliterateGreek(cleaned);
    }
  } else if (langId === 'aramaic') {
    if (hasNativeVoice) {
      cleaned = cleaned.replace(/[\u0700-\u070D]/g, ' ');
      cleaned = cleaned.normalize('NFC');
    } else {
      cleaned = transliterateAramaic(cleaned);
    }
  } else if (langId === 'malayalam') {
    // 1. Convert archaic Dot Reph \u0D4E to modern chillu \u0D7C (ർ) so modern Indian TTS engines don't choke
    cleaned = cleaned.replace(/\u0D4E/g, 'ർ');
    // 2. Replace semicolons and colons with natural pause commas
    cleaned = cleaned.replace(/[;:]/g, ',');
    // 3. Normalize Unicode
    cleaned = cleaned.normalize('NFC');
  } else {
    cleaned = cleaned.replace(/[—–]/g, ', ');
  }

  return cleaned;
}

export function speakText(text: string, langId: string, options?: SpeakOptions) {
  if (!isAudioSupported()) {
    options?.onError?.(new Error('Audio Speech Synthesis is not supported in this browser.'));
    return;
  }

  // Cancel any ongoing speech
  stopAudio();

  const settings = getStoredAudioSettings();
  const effectiveGender = options?.gender || settings.gender;
  const effectiveVoiceName = options?.voiceName || settings.preferredVoiceName;

  const voice = getBestVoice(langId, {
    gender: effectiveGender,
    preferredVoiceName: effectiveVoiceName,
  });

  const hasNativeVoice = voice ? isNativeVoiceForLanguage(voice, langId) : false;
  const cleanText = sanitizeTextForSpeech(text, langId, hasNativeVoice);
  if (!cleanText) {
    options?.onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  if (voice) {
    utterance.voice = voice;
    // If transliterated to phonetic Latin because no native voice exists on device (e.g. iPhone Greek/Hebrew/Aramaic),
    // match the utterance language tag to the fallback voice (e.g. en-US) so WebKit doesn't throw language-unavailable!
    if (!hasNativeVoice && (langId === 'hebrew' || langId === 'greek' || langId === 'aramaic')) {
      utterance.lang = voice.lang || 'en-US';
    } else {
      utterance.lang = voice.lang;
    }
  } else {
    const mapping = LANGUAGE_LOCALES[langId] || { bcp47: ['en-US'] };
    utterance.lang = mapping.bcp47[0] || 'en-US';
  }

  // Speed / Rate setting (default 0.92 for clear, reverent reading)
  utterance.rate = options?.rate || settings.rate || 0.92;

  // Pitch modulation:
  if (options?.pitch) {
    utterance.pitch = options.pitch;
  } else if (effectiveGender === 'male') {
    // If voice is female or Carmit, drop pitch down to 0.80 so it sounds audibly male
    const isFemale = voice ? detectVoiceGender(voice) === 'female' || isNativeHebrewVoice(voice) : true;
    utterance.pitch = isFemale ? 0.80 : 0.92;
  } else if (effectiveGender === 'female') {
    // If voice is male, raise pitch up to 1.15
    const isMale = voice ? detectVoiceGender(voice) === 'male' : false;
    utterance.pitch = isMale ? 1.15 : 1.05;
  } else {
    utterance.pitch = 1.0;
  }

  // Prevent Garbage Collection
  activeUtterances.add(utterance);
  startKeepAlive();

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    activeUtterances.delete(utterance);
    if (activeUtterances.size === 0) {
      stopKeepAlive();
    }
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterances.delete(utterance);
    if (activeUtterances.size === 0) {
      stopKeepAlive();
    }
    // Ignore intentional cancel or interrupted events - do NOT treat as failure
    if (e.error === 'canceled' || e.error === 'interrupted') {
      return;
    }
    options?.onError?.(e);
  };

  // Synchronous speak call to preserve mobile Safari / iOS WebKit user-activation context
  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    activeUtterances.delete(utterance);
    options?.onError?.(err);
  }
}

export function stopAudio() {
  if (isAudioSupported()) {
    stopKeepAlive();
    activeUtterances.clear();
    window.speechSynthesis.cancel();
  }
}

export function pauseAudio() {
  if (isAudioSupported()) {
    window.speechSynthesis.pause();
  }
}

export function resumeAudio() {
  if (isAudioSupported()) {
    window.speechSynthesis.resume();
  }
}

export function isAudioSpeaking(): boolean {
  return isAudioSupported() && (window.speechSynthesis.speaking || activeUtterances.size > 0);
}
