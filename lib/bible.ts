import fs from 'node:fs/promises';
import path from 'node:path';

export interface Verse {
  verse: number;
  text: string;
}

export interface ChapterData {
  translation: string;
  language: string;
  dir?: 'ltr' | 'rtl';
  bookName: string;
  bookSlug: string;
  nativeName?: string;
  hebrewName?: string;
  chapterNumber: number;
  totalVerses: number;
  verses: Verse[];
  totalChapters?: number;
  prevChapter?: { book: string; chapter: number; lang?: string } | null;
  nextChapter?: { book: string; chapter: number; lang?: string } | null;
}

export interface BookMeta {
  name: string;
  slug: string;
  nativeName?: string;
  hebrewName?: string;
  chapterCount: number;
  language?: string;
  dir?: 'ltr' | 'rtl';
  testament?: string;
  textSource?: string;
}

export interface LanguageMeta {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  translation: string;
  booksCount: number;
  firstBook: string;
}

export interface WordBreakdown {
  hebrew: string;
  transliteration: string;
  root: string;
  meaning: string;
  grammar: string;
}

export interface ComparativeVerse {
  langId: string;
  name: string;
  badge: string;
  text: string;
  dir: 'ltr' | 'rtl';
  available: boolean;
  unavailableReason?: string;
  fontClass: string;
  theme: {
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    textColor: string;
    copyBg: string;
    copyHover: string;
  };
}

export interface VerseDetails {
  book: string;
  bookName: string;
  nativeName?: string;
  chapter: number;
  verse: number;
  primaryText: string;
  language: string;
  comparisons: ComparativeVerse[];
  hebrewText?: string;
  greekText?: string;
  englishText?: string;
  aramaicText?: string;
  transliteration?: string;
  englishLiteral?: string;
  kjv?: string;
  breakdown: WordBreakdown[];
  manuscriptNotes: string;
  codexSource: string;
}

export function slugifyBook(nameOrSlug: string): string {
  const s = decodeURIComponent(nameOrSlug)
    .trim()
    .toLowerCase()
    .replace(/^i\s+/, '1-')
    .replace(/^ii\s+/, '2-')
    .replace(/^iii\s+/, '3-')
    .replace(/^1st\s+/, '1-')
    .replace(/^2nd\s+/, '2-')
    .replace(/^3rd\s+/, '3-')
    .replace(/\s+of\s+john$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (s === 'song-of-solomon') return 'song-of-solomon';
  if (s === 'revelation-of-john') return 'revelation';
  return s;
}

const LANGUAGE_FLAGS: Record<string, string> = {
  hebrew: '🇮🇱',
  english: '🇬🇧',
  'english-bsb': '🇺🇸',
  'english-ylt': '🇬🇧',
  malayalam: '🇮🇳',
  greek: '🇬🇷',
  aramaic: '🇸🇾',
  latin: '🇻🇦',
  german: '🇩🇪',
  french: '🇫🇷',
  spanish: '🇪🇸',
  russian: '🇷🇺',
  chinese: '🇨🇳',
  burmese: '🇲🇲',
  slavic: '☦️',
};

const LANGUAGES_FALLBACK: LanguageMeta[] = [
  { id: 'hebrew', name: 'Biblical Hebrew', nativeName: 'עִבְרִית', flag: '🇮🇱', dir: 'rtl', translation: 'Westminster Leningrad Codex (WLC)', booksCount: 39, firstBook: 'genesis' },
  { id: 'english', name: 'English (KJV)', nativeName: 'English', flag: '🇬🇧', dir: 'ltr', translation: 'King James Version (1769)', booksCount: 66, firstBook: 'genesis' },
  { id: 'english-bsb', name: 'English (Berean Standard Bible)', nativeName: 'Berean Standard Bible', flag: '🇺🇸', dir: 'ltr', translation: 'Berean Standard Bible (BSB)', booksCount: 66, firstBook: 'genesis' },
  { id: 'english-ylt', name: "English (Young's Literal Translation)", nativeName: "Young's Literal Translation", flag: '🇬🇧', dir: 'ltr', translation: "Young's Literal Translation (YLT 1898)", booksCount: 66, firstBook: 'genesis' },
  { id: 'malayalam', name: 'Malayalam (സത്യവേദപുസ്തകം)', nativeName: 'മലയാളം', flag: '🇮🇳', dir: 'ltr', translation: 'Sathyavedapusthakam (1910)', booksCount: 66, firstBook: 'genesis' },
  { id: 'greek', name: 'Koine Greek', nativeName: 'Ἑλληνική', flag: '🇬🇷', dir: 'ltr', translation: 'Textus Receptus (1550/1894)', booksCount: 27, firstBook: 'matthew' },
  { id: 'aramaic', name: 'Aramaic (Syriac Peshitta)', nativeName: 'ܐܪܡܝܐ (Peshitta)', flag: '🇸🇾', dir: 'rtl', translation: 'Syriac Peshitta New Testament', booksCount: 27, firstBook: 'matthew' },
  { id: 'latin', name: 'Latin (Biblia Sacra Vulgata)', nativeName: 'Latina', flag: '🇻🇦', dir: 'ltr', translation: 'Latin Vulgate', booksCount: 78, firstBook: 'genesis' },
  { id: 'german', name: 'German (Elberfelder 1905)', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', translation: 'Unrevidierte Elberfelder (1905)', booksCount: 66, firstBook: 'genesis' },
  { id: 'french', name: 'French (Augustin Crampon)', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', translation: 'Bible Augustin Crampon (1923)', booksCount: 73, firstBook: 'genesis' },
  { id: 'spanish', name: 'Spanish (Reina-Valera 1909)', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', translation: 'La Santa Biblia Reina-Valera (1909)', booksCount: 66, firstBook: 'genesis' },
  { id: 'russian', name: 'Russian (Синодальный перевод)', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr', translation: 'Синодального Перевода Библии', booksCount: 78, firstBook: 'genesis' },
  { id: 'chinese', name: 'Chinese (和合本 繁體字)', nativeName: '中文 (和合本)', flag: '🇨🇳', dir: 'ltr', translation: '和合本 (繁體字 ChiUn)', booksCount: 66, firstBook: 'genesis' },
  { id: 'burmese', name: 'Burmese Judson', nativeName: 'မြန်မာဘာသာ', flag: '🇲🇲', dir: 'ltr', translation: '1835 Judson Burmese Bible', booksCount: 66, firstBook: 'genesis' },
  { id: 'slavic', name: 'Church Slavonic', nativeName: 'Церковнославя́нскій', flag: '☦️', dir: 'ltr', translation: '1757 Elizabeth Bible', booksCount: 76, firstBook: 'genesis' },
];

export async function getLanguages(): Promise<LanguageMeta[]> {
  try {
    const fp = path.join(process.cwd(), 'public', 'data', 'languages.json');
    const content = await fs.readFile(fp, 'utf8');
    const list = JSON.parse(content) as LanguageMeta[];
    return list.map((l) => ({
      ...l,
      flag: l.flag || LANGUAGE_FLAGS[l.id] || '🌐',
    }));
  } catch {
    return LANGUAGES_FALLBACK;
  }
}

const booksCache: Record<string, BookMeta[]> = {};
const chapterCache = new Map<string, ChapterData>();
const MAX_CHAPTER_CACHE_ENTRIES = 500;

export async function getBooks(lang = 'english'): Promise<BookMeta[]> {
  const normLang = lang.toLowerCase();
  if (booksCache[normLang]) return booksCache[normLang];

  const altSpaced = normLang.replace(/-/g, ' ');
  const altHyphen = normLang.replace(/\s+/g, '-');

  const possiblePaths = [
    path.join(process.cwd(), 'public', 'data', normLang, 'bible', 'books.json'),
    path.join(process.cwd(), 'public', 'data', altHyphen, 'bible', 'books.json'),
    path.join(process.cwd(), 'public', 'data', altSpaced, 'bible', 'books.json'),
    path.join(process.cwd(), 'public', 'data', normLang, 'books.json'),
    path.join(process.cwd(), 'public', 'data', altHyphen, 'books.json'),
    path.join(process.cwd(), 'public', 'data', altSpaced, 'books.json'),
    path.join(process.cwd(), 'public', 'data', 'hebrew', 'bible', 'books.json'),
    path.join(process.cwd(), 'public', 'data', 'hebrew', 'books.json'),
  ];

  for (const fp of possiblePaths) {
    try {
      const content = await fs.readFile(fp, 'utf8');
      const list = JSON.parse(content) as BookMeta[];
      if (list && list.length > 0) {
        booksCache[normLang] = list.map((b) => ({
          ...b,
          hebrewName: b.nativeName || b.hebrewName || '',
        }));
        return booksCache[normLang];
      }
    } catch {
      // try next
    }
  }

  return [];
}

export async function getBookBySlug(slugOrName: string, lang = 'english'): Promise<BookMeta | null> {
  const books = await getBooks(lang);
  const normalized = slugifyBook(slugOrName);
  return books.find((b) => b.slug === normalized || slugifyBook(b.name) === normalized) || null;
}

export async function getChapterData(
  bookParam: string,
  chapterParam: string | number,
  langParam = 'english',
  allowFallback = true
): Promise<ChapterData | null> {
  let lang = (langParam || 'english').toLowerCase();
  const slug = slugifyBook(bookParam);
  const chapterNumber = Number.parseInt(String(chapterParam), 10);

  if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
    return null;
  }

  // Automatic language fallback: If book is Matthew-Revelation and language is Hebrew (OT only), switch to Greek or English
  const NT_BOOKS = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', '2-corinthians',
    'galatians', 'ephesians', 'philippians', 'colossians', '1-thessalonians', '2-thessalonians',
    '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews', 'james', '1-peter', '2-peter',
    '1-john', '2-john', '3-john', 'jude', 'revelation'
  ];

  if (allowFallback) {
    if (lang === 'hebrew' && NT_BOOKS.includes(slug)) {
      lang = 'greek';
    } else if (lang === 'aramaic' && !NT_BOOKS.includes(slug) && slug !== 'genesis') {
      lang = 'hebrew';
    }
  }

  const books = await getBooks(lang);
  const bookIndex = books.findIndex((b) => b.slug === slug || slugifyBook(b.name) === slug);
  const currentBook = bookIndex !== -1 ? books[bookIndex] : null;
  const actualSlug = currentBook ? currentBook.slug : slug;

  const cacheKey = `${lang}:${actualSlug}:${chapterNumber}:${allowFallback}`;
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!;
  }

  const altSpaced = lang.replace(/-/g, ' ');
  const altHyphen = lang.replace(/\s+/g, '-');

  // Search paths that support moving into public/data/<lang>/bible/<slug>/<chapter>.json
  const filePaths = [
    path.join(process.cwd(), 'public', 'data', lang, 'bible', actualSlug, `${chapterNumber}.json`),
    path.join(process.cwd(), 'public', 'data', altHyphen, 'bible', actualSlug, `${chapterNumber}.json`),
    path.join(process.cwd(), 'public', 'data', altSpaced, 'bible', actualSlug, `${chapterNumber}.json`),
    path.join(process.cwd(), 'public', 'data', lang, actualSlug, `${chapterNumber}.json`),
    path.join(process.cwd(), 'public', 'data', altHyphen, actualSlug, `${chapterNumber}.json`),
    path.join(process.cwd(), 'public', 'data', altSpaced, actualSlug, `${chapterNumber}.json`),
  ];

  if (allowFallback) {
    filePaths.push(
      path.join(process.cwd(), 'public', 'data', 'hebrew', 'bible', actualSlug, `${chapterNumber}.json`),
      path.join(process.cwd(), 'public', 'data', 'hebrew', actualSlug, `${chapterNumber}.json`),
      path.join(process.cwd(), 'public', 'data', actualSlug, `${chapterNumber}.json`),
    );
  }

  let rawJson: string | null = null;
  for (const fp of filePaths) {
    try {
      rawJson = await fs.readFile(fp, 'utf8');
      break;
    } catch {
      // try next path
    }
  }

  if (!rawJson && allowFallback) {
    // Fallback search across other languages if requested book doesn't exist in active language
    const altLangs = ['english', 'greek', 'hebrew', 'slavic', 'burmese'].filter((l) => l !== lang);
    for (const alt of altLangs) {
      const altPaths = [
        path.join(process.cwd(), 'public', 'data', alt, 'bible', actualSlug, `${chapterNumber}.json`),
        path.join(process.cwd(), 'public', 'data', alt, actualSlug, `${chapterNumber}.json`),
      ];
      for (const fp of altPaths) {
        try {
          rawJson = await fs.readFile(fp, 'utf8');
          lang = alt;
          break;
        } catch {}
      }
      if (rawJson) break;
    }
  }

  if (!rawJson) {
    return null;
  }

  const data = JSON.parse(rawJson) as ChapterData;
  data.language = data.language || lang;
  data.dir = data.dir || (lang === 'hebrew' || lang === 'aramaic' ? 'rtl' : 'ltr');
  data.nativeName = data.nativeName || data.hebrewName || currentBook?.nativeName || currentBook?.hebrewName;
  data.hebrewName = data.nativeName;

  if (currentBook) {
    data.totalChapters = currentBook.chapterCount;

    // Previous chapter
    if (chapterNumber > 1) {
      data.prevChapter = { book: currentBook.slug, chapter: chapterNumber - 1, lang };
    } else if (bookIndex > 0) {
      const prevBook = books[bookIndex - 1];
      data.prevChapter = { book: prevBook.slug, chapter: prevBook.chapterCount, lang };
    } else {
      data.prevChapter = null;
    }

    // Next chapter
    if (chapterNumber < currentBook.chapterCount) {
      data.nextChapter = { book: currentBook.slug, chapter: chapterNumber + 1, lang };
    } else if (bookIndex < books.length - 1) {
      const nextBook = books[bookIndex + 1];
      data.nextChapter = { book: nextBook.slug, chapter: 1, lang };
    } else {
      data.nextChapter = null;
    }
  }

  if (chapterCache.size >= MAX_CHAPTER_CACHE_ENTRIES) {
    const oldestKey = chapterCache.keys().next().value;
    if (oldestKey) chapterCache.delete(oldestKey);
  }
  chapterCache.set(cacheKey, data);

  return data;
}

// Lexicon and translation history
export async function getVerseDetails(
  bookParam: string,
  chapterParam: string | number,
  verseParam: string | number,
  langParam = 'english'
): Promise<VerseDetails | null> {
  const currentChapter = await getChapterData(bookParam, chapterParam, langParam);
  if (!currentChapter) return null;

  const verseNumber = Number.parseInt(String(verseParam), 10);
  const targetVerse = currentChapter.verses.find((v) => v.verse === verseNumber);
  if (!targetVerse) return null;

  // Fetch comparative translations in parallel: English, Hebrew, Aramaic, Greek
  let hebrewText = '';
  let englishText = '';
  let aramaicText = '';
  let greekText = '';

  const [engChapter, hebChapter, araChapter, grkChapter] = await Promise.all([
    getChapterData(bookParam, chapterParam, 'english', false).catch(() => null),
    getChapterData(bookParam, chapterParam, 'hebrew', false).catch(() => null),
    getChapterData(bookParam, chapterParam, 'aramaic', false).catch(() => null),
    getChapterData(bookParam, chapterParam, 'greek', false).catch(() => null),
  ]);

  if (engChapter) {
    englishText = engChapter.verses.find((v) => v.verse === verseNumber)?.text || '';
  }
  if (hebChapter) {
    hebrewText = hebChapter.verses.find((v) => v.verse === verseNumber)?.text || '';
  }
  if (araChapter) {
    aramaicText = araChapter.verses.find((v) => v.verse === verseNumber)?.text || '';
  }
  if (grkChapter) {
    greekText = grkChapter.verses.find((v) => v.verse === verseNumber)?.text || '';
  }

  // Token breakdown
  const sourceWords = (hebrewText || targetVerse.text)
    .replace(/[׃.,;:!?]/g, '')
    .trim()
    .split(/\s+/);

  const VOCAB_MAP: Record<string, { translit: string; root: string; gloss: string; grammar: string }> = {
    'בְּרֵאשִׁ֖ית': { translit: "B'reshít", root: 'ר־א־שׁ (rosh)', gloss: 'In the beginning', grammar: 'Prep. + Noun fem. sing. construct' },
    'בָּרָ֣א': { translit: 'Bará', root: 'ב־ר־א (bara)', gloss: 'Created / brought into being', grammar: 'Verb Qal perfect 3ms' },
    'אֱלֹהִ֑ים': { translit: 'Elohím', root: 'א־ל־ה (eloah)', gloss: 'God / Supreme Deity', grammar: 'Noun masc. plural of majesty' },
    'אֵ֥ת': { translit: 'Et', root: 'את', gloss: '[Direct object marker]', grammar: 'Untranslated accusative particle' },
    'הַשָּׁמַ֖יִם': { translit: 'Ha-shamáyim', root: 'ש־מ־י (shamayim)', gloss: 'The heavens / sky', grammar: 'Def. art. + Noun dual/plural' },
    'וְאֵ֥ת': { translit: "V'et", root: 'את', gloss: 'and [direct object marker]', grammar: 'Conj. + Accusative particle' },
    'הָאָֽרֶץ': { translit: "Ha'áretz", root: 'א־ר־ץ (eretz)', gloss: 'The earth / land', grammar: 'Def. art. + Noun fem. sing.' },
    'וְהָאָ֗רֶץ': { translit: "V'ha'áretz", root: 'א־ר־ץ (eretz)', gloss: 'Now the earth', grammar: 'Conj. + Def. art. + Noun' },
    'הָיְתָ֥ה': { translit: "Hay'tah", root: 'ה־י־ה (hayah)', gloss: 'Was / existed', grammar: 'Verb Qal perfect 3fs' },
    'תֹ֙הוּ֙': { translit: 'Tóhu', root: 'תהה', gloss: 'Formless / chaos / void', grammar: 'Noun masc. sing' },
    'וָבֹ֔הוּ': { translit: 'Va-vóhu', root: 'בהה', gloss: 'and empty / desolate', grammar: 'Conj. + Noun masc. sing.' },
    'וְחֹ֖שֶׁךְ': { translit: "V'chóshekh", root: 'ח־ש־ך (chashekh)', gloss: 'and darkness', grammar: 'Conj. + Noun masc. sing.' },
    'עַל־פְּנֵ֣י': { translit: 'Al-p\'nei', root: 'פ־נ־ה (panim)', gloss: 'over the face / surface of', grammar: 'Prep. + Noun pl. construct' },
    'תְה֑וֹם': { translit: 'Tehóm', root: 'ת־ה־ם (tehom)', gloss: 'The deep / watery abyss', grammar: 'Noun fem. sing.' },
    'וְר֣וּחַ': { translit: "V'rúach", root: 'ר־ܘ־ח (ruach)', gloss: 'and the Spirit / breath / wind of', grammar: 'Conj. + Noun fem. construct' },
    'מְרַחֶ֖פֶת': { translit: "M'rachéfet", root: 'ר־ח־ף (rachaf)', gloss: 'Hovering / brooding over', grammar: 'Verb Piel participle fs' },
    'הַמָּֽיִם': { translit: 'Ham-máyim', root: 'מ־י־ם (mayim)', gloss: 'The waters', grammar: 'Def. art. + Noun masc. dual/plural' },
    'וַיֹּ֥אמֶר': { translit: "Vayyómer", root: 'א־מ־ר (amar)', gloss: 'And He said', grammar: 'Vav consecutive + Verb Qal impf 3ms' },
    'יְהִ֣י': { translit: "Y'hí", root: 'ה־י־ה (hayah)', gloss: 'Let there be / become', grammar: 'Verb Qal jussive 3ms' },
    'א֑וֹר': { translit: 'Or', root: 'א־ו־ר (or)', gloss: 'Light', grammar: 'Noun masc. sing.' },
    'וַֽיְהִי־אֽוֹר': { translit: "Vay'hi-or", root: 'ה־י־ה / א־ו־ר', gloss: 'and there was light', grammar: 'Vav consecutive + Verb + Noun' },
    'שְׁמַ֖ע': { translit: 'Shemá', root: 'ש־מ־ע (shama)', gloss: 'Hear! / Listen attentively', grammar: 'Verb Qal imperative ms' },
    'יִשְׂרָאֵ֑ל': { translit: 'Yisra\'él', root: 'שׂרה + אל', gloss: 'Israel (He strives with God)', grammar: 'Proper name' },
    'יְהוָ֥ה': { translit: 'YHWH / Adonai', root: 'ה־ו־ה (havah - To Be)', gloss: 'The LORD / Eternal Covenant Name', grammar: 'Tetragrammaton (Four Letters)' },
    'אֱלֹהֵ֖ינוּ': { translit: "Elohéinu", root: 'א־ל־ה', gloss: 'Our God', grammar: 'Noun masc. pl. + 1cp suffix' },
    'אֶחָֽד': { translit: 'Echád', root: 'א־ח־ד (achad)', gloss: 'One / Unified / Unique', grammar: 'Adjective masc. sing.' },
  };

  const breakdown: WordBreakdown[] = sourceWords.slice(0, 10).map((word) => {
    const cleanWord = word.replace(/[\u0591-\u05AF]/g, '');
    const entry = VOCAB_MAP[word] || VOCAB_MAP[cleanWord];
    if (entry) {
      return {
        hebrew: word,
        transliteration: entry.translit,
        root: entry.root,
        meaning: entry.gloss,
        grammar: entry.grammar,
      };
    }
    return {
      hebrew: word,
      transliteration: '—',
      root: 'Biblical Root',
      meaning: 'Original manuscript token',
      grammar: 'Vocalized grammatical form',
    };
  });

  // Build comparative translations list for English, Hebrew, Aramaic (and Greek)
  const comparisons: ComparativeVerse[] = [
    {
      langId: 'english',
      name: 'English Translation',
      badge: 'King James Version (KJV)',
      text: englishText,
      dir: 'ltr',
      available: !!englishText,
      unavailableReason: 'English text not available for this verse.',
      fontClass: 'font-editorial-serif',
      theme: {
        border: 'border-sky-500/40',
        bg: 'bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-sky-950/20',
        badgeBg: 'bg-sky-500/10 border-sky-500/30',
        badgeText: 'text-sky-300',
        textColor: 'text-sky-100',
        copyBg: 'bg-sky-950/80 border-sky-700/80 text-sky-200',
        copyHover: 'hover:bg-sky-900/80 hover:text-white hover:border-sky-400',
      },
    },
    {
      langId: 'hebrew',
      name: 'Biblical Hebrew',
      badge: 'Westminster Leningrad Codex (WLC)',
      text: hebrewText,
      dir: 'rtl',
      available: !!hebrewText,
      unavailableReason: 'Hebrew Masoretic codex (WLC) preserves the Old Testament / Tanakh (Genesis – Malachi).',
      fontClass: 'font-hebrew',
      theme: {
        border: 'border-amber-500/40',
        bg: 'bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-amber-950/20',
        badgeBg: 'bg-amber-500/10 border-amber-500/30',
        badgeText: 'text-amber-300',
        textColor: 'text-amber-100',
        copyBg: 'bg-amber-950/80 border-amber-700/80 text-amber-200',
        copyHover: 'hover:bg-amber-900/80 hover:text-white hover:border-amber-400',
      },
    },
    {
      langId: 'aramaic',
      name: 'Syriac Aramaic',
      badge: 'Peshitta Codex (ܐܪܡܝܐ)',
      text: aramaicText,
      dir: 'rtl',
      available: !!aramaicText,
      unavailableReason: 'Syriac Peshitta in this library preserves the New Testament canon (Matthew – Revelation) & Genesis 1.',
      fontClass: 'font-aramaic',
      theme: {
        border: 'border-purple-500/40',
        bg: 'bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-purple-950/20',
        badgeBg: 'bg-purple-500/10 border-purple-500/30',
        badgeText: 'text-purple-300',
        textColor: 'text-purple-100',
        copyBg: 'bg-purple-950/80 border-purple-700/80 text-purple-200',
        copyHover: 'hover:bg-purple-900/80 hover:text-white hover:border-purple-400',
      },
    },
  ];

  if (greekText) {
    comparisons.push({
      langId: 'greek',
      name: 'Koine Greek',
      badge: 'Textus Receptus (1550/1894)',
      text: greekText,
      dir: 'ltr',
      available: true,
      fontClass: 'font-greek',
      theme: {
        border: 'border-emerald-500/40',
        bg: 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-emerald-950/20',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
        badgeText: 'text-emerald-300',
        textColor: 'text-emerald-100',
        copyBg: 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200',
        copyHover: 'hover:bg-emerald-900/80 hover:text-white hover:border-emerald-400',
      },
    });
  }

  return {
    book: currentChapter.bookSlug,
    bookName: currentChapter.bookName,
    nativeName: currentChapter.nativeName,
    chapter: Number(chapterParam),
    verse: verseNumber,
    primaryText: targetVerse.text,
    language: currentChapter.language,
    comparisons,
    hebrewText,
    greekText,
    englishText,
    aramaicText,
    transliteration: breakdown.map((b) => b.transliteration).filter((t) => t !== '—').join(' ') || undefined,
    englishLiteral: englishText || `${currentChapter.bookName} ${chapterParam}:${verseParam}`,
    kjv: englishText,
    breakdown,
    manuscriptNotes:
      'Rendered from original historical manuscripts: Westminster Leningrad Codex (B19a, 1008 CE) for Old Testament Hebrew, and Textus Receptus (1550 Stephanus / 1894 Scrivener) for New Testament Greek, cross-referenced with historical translations.',
    codexSource: 'Primary source codices preserved in historical library archives.',
  };
}
