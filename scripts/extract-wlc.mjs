import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const wlcSourcePath = path.join(rootDir, 'public', 'data', 'hebrew', 'WLC.json');
const hebrewOutDir = path.join(rootDir, 'public', 'data', 'hebrew');
const genericOutDir = path.join(rootDir, 'public', 'data');

if (!fs.existsSync(wlcSourcePath)) {
  console.error(`Source file not found at: ${wlcSourcePath}`);
  process.exit(1);
}

console.log(`Reading master file: ${wlcSourcePath}...`);
const rawData = fs.readFileSync(wlcSourcePath, 'utf8');
const wlcData = JSON.parse(rawData);

const HEBREW_NAMES = {
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
};

function slugifyBookName(name) {
  return name
    .toLowerCase()
    .replace(/^i\s+/, '1-')
    .replace(/^ii\s+/, '2-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const booksMeta = [];
let totalChaptersWritten = 0;
let totalVersesCounted = 0;

for (const book of wlcData.books) {
  const bookName = book.name;
  const slug = slugifyBookName(bookName);
  const hebrewName = HEBREW_NAMES[bookName] || '';
  const chapters = book.chapters || [];

  const meta = {
    name: bookName,
    slug,
    hebrewName,
    chapterCount: chapters.length,
    testament: 'OT',
    language: 'Hebrew',
    textSource: 'Westminster Leningrad Codex (WLC)',
  };
  booksMeta.push(meta);

  // Target directories
  const bookDirHebrew = path.join(hebrewOutDir, slug);
  const bookDirGeneric = path.join(genericOutDir, slug);

  fs.mkdirSync(bookDirHebrew, { recursive: true });
  fs.mkdirSync(bookDirGeneric, { recursive: true });

  for (const chapterObj of chapters) {
    const chapterNumber = chapterObj.chapter;
    const verses = chapterObj.verses || [];
    totalVersesCounted += verses.length;

    const chapterData = {
      translation: 'WLC: Westminster Leningrad Codex',
      bookName,
      bookSlug: slug,
      hebrewName,
      chapterNumber,
      totalVerses: verses.length,
      verses: verses.map((v) => ({
        verse: v.verse,
        text: v.text,
      })),
    };

    const chapterJson = JSON.stringify(chapterData, null, 2);

    // Save under public/data/hebrew/[slug]/[chapter].json
    const hebrewChapterFile = path.join(bookDirHebrew, `${chapterNumber}.json`);
    fs.writeFileSync(hebrewChapterFile, chapterJson, 'utf8');

    // Save under public/data/[slug]/[chapter].json for direct accessibility
    const genericChapterFile = path.join(bookDirGeneric, `${chapterNumber}.json`);
    fs.writeFileSync(genericChapterFile, chapterJson, 'utf8');

    totalChaptersWritten++;
  }
}

// Write books manifest
const booksManifestPath = path.join(hebrewOutDir, 'books.json');
fs.writeFileSync(booksManifestPath, JSON.stringify(booksMeta, null, 2), 'utf8');

// Also write generic books manifest
const genericBooksPath = path.join(genericOutDir, 'books.json');
fs.writeFileSync(genericBooksPath, JSON.stringify(booksMeta, null, 2), 'utf8');

console.log('✅ Extraction complete!');
console.log(`- Total Books: ${booksMeta.length}`);
console.log(`- Total Chapters written: ${totalChaptersWritten}`);
console.log(`- Total Verses processed: ${totalVersesCounted}`);
console.log(`- Output locations:`);
console.log(`  * ${hebrewOutDir}/[book]/[chapter].json`);
console.log(`  * ${genericOutDir}/[book]/[chapter].json`);
console.log(`  * ${booksManifestPath}`);
