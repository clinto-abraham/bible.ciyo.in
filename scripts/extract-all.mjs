import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CONFIGS = [
  {
    lang: 'hebrew',
    label: 'Biblical Hebrew',
    nativeLabel: 'עִבְרִית',
    dir: 'rtl',
    file: 'WLC.json',
    scriptFamily: 'hebrew',
  },
  {
    lang: 'greek',
    label: 'Koine Greek',
    nativeLabel: 'Ἑλληνική',
    dir: 'ltr',
    file: 'TR.json',
    scriptFamily: 'greek',
  },
  {
    lang: 'burmese',
    label: 'Burmese Judson',
    nativeLabel: 'မြန်မာဘာသာ',
    dir: 'ltr',
    file: 'BurJudson.json',
    scriptFamily: 'burmese',
  },
  {
    lang: 'slavic',
    label: 'Church Slavonic',
    nativeLabel: 'Церковнославя́нскій',
    dir: 'ltr',
    file: 'CSlElizabeth.json',
    scriptFamily: 'cyrillic',
  },
  {
    lang: 'english',
    label: 'English (KJV)',
    nativeLabel: 'English',
    dir: 'ltr',
    file: 'KJV.json',
    scriptFamily: 'latin',
  },
];

function slugifyBookName(name) {
  let s = name
    .toLowerCase()
    .replace(/^i\s+/, '1-')
    .replace(/^ii\s+/, '2-')
    .replace(/^iii\s+/, '3-')
    .replace(/^1st\s+/, '1-')
    .replace(/^2nd\s+/, '2-')
    .replace(/^3rd\s+/, '3-')
    .replace(/\s+of\s+john$/, '') // e.g. "Revelation of John" -> "revelation"
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (s === 'song-of-solomon') return 'song-of-solomon';
  if (s === 'revelation-of-john') return 'revelation';
  return s;
}

const NATIVE_BOOK_NAMES = {
  hebrew: {
    Genesis: 'בְּרֵאשִׁית',
    Exodus: 'שְׁמוֹת',
    Leviticus: 'וַיִּקְרָא',
    Numbers: 'בְּמִדְבַּר',
    Deuteronomy: 'דְּבָרִים',
    Joshua: 'יְהוֹשֻׁעַ',
    Judges: 'שׁוֹפְטִים',
    'I Samuel': 'שְׁמוּאֵל א׳',
    'II Samuel': 'שְׁמוּאֵל ב׳',
    'I Kings': 'מְלָכִים א׳',
    'II Kings': 'מְלָכִים ב׳',
    Isaiah: 'יְשַׁעְיָהוּ',
    Jeremiah: 'יִרְמְיָהוּ',
    Ezekiel: 'יְחֶזְקֵאל',
    Hosea: 'הוֹשֵׁעַ',
    Joel: 'יוֹאֵל',
    Amos: 'עָמוֹס',
    Obadiah: 'עֹבַדְיָה',
    Jonah: 'יוֹנָה',
    Micah: 'מִיכָה',
    Nahum: 'נַחוּם',
    Habakkuk: 'חֲבַקּוּק',
    Zephaniah: 'צְפַנְיָה',
    Haggai: 'חַגַּי',
    Zechariah: 'זְכַרְיָה',
    Malachi: 'מַלְאָכִי',
    'I Chronicles': 'דִּבְרֵי הַיָּמִים א׳',
    'II Chronicles': 'דִּבְרֵי הַיָּמִים ב׳',
    Psalms: 'תְּהִלִּים',
    Job: 'אִיּוֹב',
    Proverbs: 'מִשְׁלֵי',
    Ruth: 'רוּת',
    'Song of Solomon': 'שִׁיר הַשִּׁירִים',
    Ecclesiastes: 'קֹהֶלֶת',
    Lamentations: 'אֵיכָה',
    Esther: 'אֶסְתֵּר',
    Daniel: 'דָּנִיֵּאל',
    Ezra: 'עֶזְרָא',
    Nehemiah: 'נְחֶמְיָה',
  },
  greek: {
    Matthew: 'Κατὰ Μαθθαῖον',
    Mark: 'Κατὰ Μᾶρκον',
    Luke: 'Κατὰ Λουκᾶν',
    John: 'Κατὰ Ἰωάννην',
    Acts: 'Πράξεις τῶν Ἀποστόλων',
    Romans: 'Πρὸς Ῥωμαίους',
    'I Corinthians': 'Πρὸς Κορινθίους Α',
    'II Corinthians': 'Πρὸς Κορινθίους Β',
    Galatians: 'Πρὸς Γαλάτας',
    Ephesians: 'Πρὸς Ἐφεσίους',
    Philippians: 'Πρὸς Φιλιππησίους',
    Colossians: 'Πρὸς Κολοσσαεῖς',
    'I Thessalonians': 'Πρὸς Θεσσαλονικεῖς Α',
    'II Thessalonians': 'Πρὸς Θεσσαλονικεῖς Β',
    'I Timothy': 'Πρὸς Τιμόθεον Α',
    'II Timothy': 'Πρὸς Τιμόθεον Β',
    Titus: 'Πρὸς Τίτον',
    Philemon: 'Πρὸς Φιλήμονα',
    Hebrews: 'Πρὸς Ἑβραίους',
    James: 'Ἰακώβου',
    'I Peter': 'Πέτρου Α',
    'II Peter': 'Πέτρου Β',
    'I John': 'Ἰωάννου Α',
    'II John': 'Ἰωάννου Β',
    'III John': 'Ἰωάννου Γ',
    Jude: 'Ἰούδα',
    'Revelation of John': 'Ἀποκάλυψις Ἰωάννου',
  },
};

const languagesManifest = [];

for (const cfg of CONFIGS) {
  const sourcePath = path.join(rootDir, 'public', 'data', cfg.lang, cfg.file);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`File not found: ${sourcePath}, skipping ${cfg.lang}`);
    continue;
  }

  console.log(`Processing ${cfg.label} from ${cfg.file}...`);
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const parsed = JSON.parse(raw);

  const translationTitle = parsed.translation || cfg.label;
  const outBase = path.join(rootDir, 'public', 'data', cfg.lang, 'bible');
  fs.mkdirSync(outBase, { recursive: true });

  const booksMeta = [];
  let chaptersExtracted = 0;
  let versesExtracted = 0;

  for (const book of parsed.books || []) {
    const rawName = book.name;
    const slug = slugifyBookName(rawName);
    const nativeName =
      (NATIVE_BOOK_NAMES[cfg.lang] && NATIVE_BOOK_NAMES[cfg.lang][rawName]) ||
      rawName;

    const chapters = book.chapters || [];
    // Filter out books with 0 verses or empty texts (e.g. TR Old Testament placeholders)
    const validChapters = chapters.filter((c) =>
      (c.verses || []).some((v) => v.text && v.text.trim().length > 0)
    );

    if (validChapters.length === 0) {
      continue;
    }

    const meta = {
      name: rawName,
      slug,
      nativeName,
      chapterCount: validChapters.length,
      language: cfg.lang,
      dir: cfg.dir,
    };
    booksMeta.push(meta);

    const bookDir = path.join(outBase, slug);
    fs.mkdirSync(bookDir, { recursive: true });

    for (const ch of validChapters) {
      const chNum = ch.chapter;
      const verses = (ch.verses || []).filter((v) => v.text && v.text.trim().length > 0);
      versesExtracted += verses.length;
      chaptersExtracted++;

      const chapterPayload = {
        translation: translationTitle,
        language: cfg.lang,
        dir: cfg.dir,
        bookName: rawName,
        bookSlug: slug,
        nativeName,
        chapterNumber: chNum,
        totalVerses: verses.length,
        verses: verses.map((v) => ({
          verse: v.verse,
          text: v.text,
        })),
      };

      fs.writeFileSync(
        path.join(bookDir, `${chNum}.json`),
        JSON.stringify(chapterPayload, null, 2),
        'utf8'
      );
    }
  }

  // Write books.json inside public/data/[lang]/bible/books.json
  fs.writeFileSync(
    path.join(outBase, 'books.json'),
    JSON.stringify(booksMeta, null, 2),
    'utf8'
  );

  // Also write to public/data/[lang]/books.json for backwards compatibility
  fs.writeFileSync(
    path.join(rootDir, 'public', 'data', cfg.lang, 'books.json'),
    JSON.stringify(booksMeta, null, 2),
    'utf8'
  );

  languagesManifest.push({
    id: cfg.lang,
    name: cfg.label,
    nativeName: cfg.nativeLabel,
    dir: cfg.dir,
    translation: translationTitle,
    booksCount: booksMeta.length,
    firstBook: booksMeta[0]?.slug || 'genesis',
  });

  console.log(`  ✓ ${cfg.lang}: ${booksMeta.length} books, ${chaptersExtracted} chapters, ${versesExtracted} verses extracted into ${cfg.lang}/bible/`);
}

// Write languages manifest
fs.writeFileSync(
  path.join(rootDir, 'public', 'data', 'languages.json'),
  JSON.stringify(languagesManifest, null, 2),
  'utf8'
);

console.log('🎉 All Bible translations successfully extracted into public/data/<lang>/bible/!');
