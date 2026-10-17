import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function slugifyBookName(name) {
  let s = name
    .toLowerCase()
    .replace(/^i\s+/, '1-')
    .replace(/^ii\s+/, '2-')
    .replace(/^iii\s+/, '3-')
    .replace(/^1st\s+/, '1-')
    .replace(/^2nd\s+/, '2-')
    .replace(/^3rd\s+/, '3-')
    .replace(/\s+of\s+john$/, '') // "Revelation of John" -> "revelation"
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (s === 'song-of-solomon') return 'song-of-solomon';
  if (s === 'revelation-of-john') return 'revelation';
  return s;
}

// Translations configuration with exact priorities and labels
const NEW_CONFIGS = [
  {
    lang: 'english-bsb',
    altDirNames: ['english bsb'],
    label: 'English (Berean Standard Bible)',
    nativeLabel: 'Berean Standard Bible',
    flag: '🇺🇸',
    dir: 'ltr',
    file: 'BSB.json',
    sourceDir: 'english bsb',
  },
  {
    lang: 'english-ylt',
    altDirNames: ['english ylt'],
    label: "English (Young's Literal Translation)",
    nativeLabel: "Young's Literal Translation",
    flag: '🇬🇧',
    dir: 'ltr',
    file: 'YLT.json',
    sourceDir: 'english ylt',
  },
  {
    lang: 'malayalam',
    altDirNames: [],
    label: 'Malayalam (സത്യവേദപുസ്തകം)',
    nativeLabel: 'മലയാളം',
    flag: '🇮🇳',
    dir: 'ltr',
    file: 'Mal1910.json',
    sourceDir: 'malayalam',
  },
  {
    lang: 'aramaic',
    altDirNames: [],
    label: 'Aramaic (Syriac Peshitta)',
    nativeLabel: 'ܐܪܡܝܐ (Peshitta)',
    flag: '🇸🇾',
    dir: 'rtl',
    file: 'Peshitta.json',
    sourceDir: 'aramaic',
  },
  {
    lang: 'latin',
    altDirNames: [],
    label: 'Latin (Biblia Sacra Vulgata)',
    nativeLabel: 'Latina (Vulgate)',
    flag: '🇻🇦',
    dir: 'ltr',
    file: 'Vulgate.json',
    sourceDir: 'latin',
  },
  {
    lang: 'german',
    altDirNames: [],
    label: 'German (Elberfelder 1905)',
    nativeLabel: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    file: 'GerElb1905.json',
    sourceDir: 'german',
  },
  {
    lang: 'french',
    altDirNames: [],
    label: 'French (Augustin Crampon 1923)',
    nativeLabel: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    file: 'FreCrampon.json',
    sourceDir: 'french',
  },
  {
    lang: 'spanish',
    altDirNames: [],
    label: 'Spanish (Reina-Valera 1909)',
    nativeLabel: 'Español (Reina-Valera)',
    flag: '🇪🇸',
    dir: 'ltr',
    file: 'SpaRV.json',
    sourceDir: 'spanish',
  },
  {
    lang: 'russian',
    altDirNames: [],
    label: 'Russian (Синодальный перевод)',
    nativeLabel: 'Русский (Синодальный)',
    flag: '🇷🇺',
    dir: 'ltr',
    file: 'RusSynodal.json',
    sourceDir: 'russian',
  },
  {
    lang: 'chinese',
    altDirNames: [],
    label: 'Chinese (和合本 繁體字)',
    nativeLabel: '中文 (和合本)',
    flag: '🇨🇳',
    dir: 'ltr',
    file: 'ChiUn.json',
    sourceDir: 'chinese',
  },
];

// Rich native names map
const NATIVE_NAMES = {
  malayalam: {
    Genesis: 'ഉല്പത്തി', Exodus: 'പുറപ്പാട്', Leviticus: 'ലേവ്യപുസ്തകം', Numbers: 'സംഖ്യാപുസ്തകം', Deuteronomy: 'ആവർത്തനം',
    Joshua: 'യോശുവ', Judges: 'ന്യായാധിപന്മാർ', Ruth: 'രൂത്ത്', 'I Samuel': '1 ശമുവേൽ', 'II Samuel': '2 ശമുവേൽ',
    'I Kings': '1 രാജാക്കന്മാർ', 'II Kings': '2 രാജാക്കന്മാർ', 'I Chronicles': '1 ദിനവൃത്താന്തം', 'II Chronicles': '2 ദിനവൃത്താന്തം',
    Ezra: 'എസ്രാ', Nehemiah: 'നെഹെമ്യാവു', Esther: 'എസ്ഥേർ', Job: 'ഇയ്യോബ്', Psalms: 'സങ്കീർത്തനങ്ങൾ', Proverbs: 'സദൃശവാക്യങ്ങൾ',
    Ecclesiastes: 'സഭാപ്രസംഗി', 'Song of Solomon': 'ഉത്തമഗീതം', Isaiah: 'യെശയ്യാവു', Jeremiah: 'യിരെമ്യാവു', Lamentations: 'വിലാപങ്ങൾ',
    Ezekiel: 'യെഹെസ്കേൽ', Daniel: 'ദാനീയേൽ', Hosea: 'ഹോശേയ', Joel: 'യോവേൽ', Amos: 'ആമോസ്', Obadiah: 'ഓബദ്യാവു',
    Jonah: 'യോനാ', Micah: 'മീഖാ', Nahum: 'നഹൂം', Habakkuk: 'ഹബക്കൂക്ക്', Zephaniah: 'സെഫന്യാവു', Haggai: 'ഹഗ്ഗായി',
    Zechariah: 'സെഖര്യാവു', Malachi: 'മലാഖി',
    Matthew: 'മത്തായി', Mark: 'മർക്കൊസ്', Luke: 'ലൂക്കൊസ്', John: 'യോഹന്നാൻ', Acts: 'അപ്പൊസ്തലന്മാരുടെ പ്രവൃത്തികൾ',
    Romans: 'റോമർ', 'I Corinthians': '1 കൊരിന്ത്യർ', 'II Corinthians': '2 കൊരിന്ത്യർ', Galatians: 'ഗലാത്യർ',
    Ephesians: 'എഫെസ്യർ', Philippians: 'ഫിലിപ്പിയർ', Colossians: 'കൊലൊസ്സ്യർ', 'I Thessalonians': '1 തെസ്സലൊനീക്യർ',
    'II Thessalonians': '2 തെസ്സലൊനീക്യർ', 'I Timothy': '1 തിമൊഥെയൊസ്', 'II Timothy': '2 തിമൊഥെയൊസ്', Titus: 'തീത്തൊസ്',
    Philemon: 'ഫിലേമോൻ', Hebrews: 'എബ്രായർ', James: 'യാക്കോബ്', 'I Peter': '1 പത്രൊസ്', 'II Peter': '2 പത്രൊസ്',
    'I John': '1 യോഹന്നാൻ', 'II John': '2 യോഹന്നാൻ', 'III John': '3 യോഹന്നാൻ', Jude: 'യൂദാ', 'Revelation of John': 'വെളിപ്പാടു'
  },
  chinese: {
    Genesis: '創世記', Exodus: '出埃及記', Leviticus: '利未記', Numbers: '民數記', Deuteronomy: '申命記',
    Joshua: '約書亞記', Judges: '士師記', Ruth: '路得記', 'I Samuel': '撒母耳記上', 'II Samuel': '撒母耳記下',
    'I Kings': '列王紀上', 'II Kings': '列王紀下', 'I Chronicles': '歷代志上', 'II Chronicles': '歷代志下',
    Ezra: '以斯拉記', Nehemiah: '尼希米記', Esther: '以斯帖記', Job: '約伯記', Psalms: '詩篇', Proverbs: '箴言',
    Ecclesiastes: '傳道書', 'Song of Solomon': '雅歌', Isaiah: '以賽亞書', Jeremiah: '耶利米書', Lamentations: '耶利米哀歌',
    Ezekiel: '以西結書', Daniel: '但以理書', Hosea: '何西阿書', Joel: '約珥書', Amos: '阿摩司書', Obadiah: '俄巴底亞書',
    Jonah: '約拿書', Micah: '彌迦書', Nahum: '那鴻書', Habakkuk: '哈巴谷書', Zephaniah: '西番雅書', Haggai: '哈該書',
    Zechariah: '撒迦利亞書', Malachi: '瑪拉基書',
    Matthew: '馬太福音', Mark: '馬可福音', Luke: '路加福音', John: '約翰福音', Acts: '使徒行傳', Romans: '羅馬書',
    'I Corinthians': '哥林多前書', 'II Corinthians': '哥林多後書', Galatians: '加拉太書', Ephesians: '以弗所書',
    Philippians: '腓立比書', Colossians: '歌羅西書', 'I Thessalonians': '帖撒羅尼迦前書', 'II Thessalonians': '帖撒羅尼迦後書',
    'I Timothy': '提摩太前書', 'II Timothy': '提摩太後書', Titus: '提多書', Philemon: '腓利門書', Hebrews: '希伯來書',
    James: '雅各書', 'I Peter': '彼得前書', 'II Peter': '彼得後書', 'I John': '約翰一書', 'II John': '約翰二書',
    'III John': '約翰三書', Jude: '猶大書', 'Revelation of John': '啟示錄'
  },
  russian: {
    Genesis: 'Бытие', Exodus: 'Исход', Leviticus: 'Левит', Numbers: 'Числа', Deuteronomy: 'Второзаконие',
    Joshua: 'Иисус Навин', Judges: 'Судьи', Ruth: 'Руфь', 'I Samuel': '1 Царств', 'II Samuel': '2 Царств',
    'I Kings': '3 Царств', 'II Kings': '4 Царств', 'I Chronicles': '1 Паралипоменон', 'II Chronicles': '2 Паралипоменон',
    Ezra: '1 Ездры', Nehemiah: 'Неемия', Esther: 'Есфирь', Job: 'Иов', Psalms: 'Псалтирь', Proverbs: 'Притчи',
    Ecclesiastes: 'Екклесиаст', 'Song of Solomon': 'Песнь песней', Isaiah: 'Исаия', Jeremiah: 'Иеремия', Lamentations: 'Плач Иеремии',
    Ezekiel: 'Иезекииль', Daniel: 'Даниил', Hosea: 'Осия', Joel: 'Иоиль', Amos: 'Амос', Obadiah: 'Авдий',
    Jonah: 'Иона', Micah: 'Михей', Nahum: 'Наум', Habakkuk: 'Аввакум', Zephaniah: 'Софония', Haggai: 'Аггей',
    Zechariah: 'Захария', Malachi: 'Малахия',
    Matthew: 'От Матфея', Mark: 'От Марка', Luke: 'От Луки', John: 'От Иоанна', Acts: 'Деяния',
    Romans: 'К Римлянам', 'I Corinthians': '1 Коринфянам', 'II Corinthians': '2 Коринфянам', Galatians: 'К Галатам',
    Ephesians: 'К Ефесянам', Philippians: 'К Филиппийцам', Colossians: 'К Колоссянам', 'I Thessalonians': '1 Фессалоникийцам',
    'II Thessalonians': '2 Фессалоникийцам', 'I Timothy': '1 Тимофею', 'II Timothy': '2 Тимофею', Titus: 'К Титу',
    Philemon: 'К Филимону', Hebrews: 'К Евреям', James: 'Иакова', 'I Peter': '1 Петра', 'II Peter': '2 Петра',
    'I John': '1 Иоанна', 'II John': '2 Иоанна', 'III John': '3 Иоанна', Jude: 'Иуды', 'Revelation of John': 'Откровение'
  },
  aramaic: {
    Matthew: 'ܡܬܝ', Mark: 'ܡܪܩܘܣ', Luke: 'ܠܘܩܐ', John: 'ܝܘܚܢܢ', Acts: 'ܦܪܟܣܝܣ ܕܫܠܝܚܐ', Romans: 'ܪ̈ܗܘܡܝܐ',
    'I Corinthians': 'ܩܘܪ̈ܢܬܝܐ ܐ', 'II Corinthians': 'ܩܘܪ̈ܢܬܝܐ ܒ', Galatians: 'ܓܠܛܝ̈ܐ', Ephesians: 'ܐܦܣܝ̈ܐ',
    Philippians: 'ܦܝܠܝܦܣܝ̈ܐ', Colossians: 'ܩܘܠܣܝ̈ܐ', 'I Thessalonians': 'ܬܣܠܘܢܝܩܝ̈ܐ ܐ', 'II Thessalonians': 'ܬܣܠܘܢܝܩܝ̈ܐ ܒ',
    'I Timothy': 'ܛܝܡܬܐܘܣ ܐ', 'II Timothy': 'ܛܝܡܬܐܘܣ ܒ', Titus: 'ܛܛܘܣ', Philemon: 'ܦܝܠܡܘܢ', Hebrews: 'ܥܒܪ̈ܝܐ',
    James: 'ܝܥܩܘܒ', 'I Peter': 'ܦܛܪܘܣ ܐ', 'II Peter': 'ܦܛܪܘܣ ܒ', 'I John': 'ܝܘܚܢܢ ܐ', 'II John': 'ܝܘܚܢܢ ܒ',
    'III John': 'ܝܘܚܢܢ ܓ', Jude: 'ܝܗܘܕܐ', 'Revelation of John': 'ܓܠܝܢܐ'
  },
  spanish: {
    Genesis: 'Génesis', Exodus: 'Éxodo', Leviticus: 'Levítico', Numbers: 'Números', Deuteronomy: 'Deuteronomio',
    Matthew: 'San Mateo', Mark: 'San Marcos', Luke: 'San Lucas', John: 'San Juan', Acts: 'Hechos', Romans: 'Romanos',
    'Revelation of John': 'Apocalipsis'
  },
  german: {
    Genesis: '1. Mose', Exodus: '2. Mose', Leviticus: '3. Mose', Numbers: '4. Mose', Deuteronomy: '5. Mose',
    Matthew: 'Matthäus', Mark: 'Markus', Luke: 'Lukas', John: 'Johannes', Acts: 'Apostelgeschichte', Romans: 'Römer',
    'Revelation of John': 'Offenbarung'
  },
  french: {
    Genesis: 'Genèse', Exodus: 'Exode', Leviticus: 'Lévitique', Numbers: 'Nombres', Deuteronomy: 'Deutéronome',
    Matthew: 'Matthieu', Mark: 'Marc', Luke: 'Luc', John: 'Jean', Acts: 'Actes', Romans: 'Romains',
    'Revelation of John': 'Apocalypse'
  },
  latin: {
    Genesis: 'Genesis', Exodus: 'Exodus', Leviticus: 'Leviticus', Numbers: 'Numeri', Deuteronomy: 'Deuteronomium',
    Matthew: 'Secundum Matthaeum', Mark: 'Secundum Marcum', Luke: 'Secundum Lucam', John: 'Secundum Ioannem',
    Acts: 'Actus Apostolorum', Romans: 'Ad Romanos', 'Revelation of John': 'Apocalypsis'
  }
};

const extractedResults = [];

for (const cfg of NEW_CONFIGS) {
  const sourcePath = path.join(rootDir, 'public', 'data', cfg.sourceDir, cfg.file);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`File not found: ${sourcePath}, skipping ${cfg.lang}`);
    continue;
  }

  console.log(`Processing ${cfg.label} from ${sourcePath}...`);
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const parsed = JSON.parse(raw);
  const translationTitle = parsed.translation || cfg.label;

  // Output destination: public/data/<cfg.lang>/bible/
  const outBase = path.join(rootDir, 'public', 'data', cfg.lang, 'bible');
  fs.mkdirSync(outBase, { recursive: true });

  // If sourceDir is different (e.g. "english bsb"), also create public/data/<sourceDir>/bible
  const altOutBase = cfg.sourceDir !== cfg.lang ? path.join(rootDir, 'public', 'data', cfg.sourceDir, 'bible') : null;
  if (altOutBase) {
    fs.mkdirSync(altOutBase, { recursive: true });
  }

  const booksMeta = [];
  let chaptersExtracted = 0;
  let versesExtracted = 0;

  for (const book of parsed.books || []) {
    const rawName = book.name;
    const slug = slugifyBookName(rawName);
    const nativeName =
      (NATIVE_NAMES[cfg.lang] && NATIVE_NAMES[cfg.lang][rawName]) ||
      rawName;

    const chapters = book.chapters || [];
    // Filter out books with 0 verses or empty texts
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

    let altBookDir = null;
    if (altOutBase) {
      altBookDir = path.join(altOutBase, slug);
      fs.mkdirSync(altBookDir, { recursive: true });
    }

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

      const payloadStr = JSON.stringify(chapterPayload, null, 2);
      fs.writeFileSync(path.join(bookDir, `${chNum}.json`), payloadStr, 'utf8');

      if (altBookDir) {
        fs.writeFileSync(path.join(altBookDir, `${chNum}.json`), payloadStr, 'utf8');
      }
    }
  }

  // Write books.json
  const booksMetaStr = JSON.stringify(booksMeta, null, 2);
  fs.writeFileSync(path.join(outBase, 'books.json'), booksMetaStr, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public', 'data', cfg.lang, 'books.json'), booksMetaStr, 'utf8');

  if (altOutBase) {
    fs.writeFileSync(path.join(altOutBase, 'books.json'), booksMetaStr, 'utf8');
    fs.writeFileSync(path.join(rootDir, 'public', 'data', cfg.sourceDir, 'books.json'), booksMetaStr, 'utf8');
  }

  extractedResults.push({
    id: cfg.lang,
    name: cfg.label,
    nativeName: cfg.nativeLabel,
    dir: cfg.dir,
    translation: translationTitle,
    booksCount: booksMeta.length,
    firstBook: booksMeta[0]?.slug || (cfg.lang === 'aramaic' ? 'matthew' : 'genesis'),
    flag: cfg.flag,
  });

  console.log(`  ✓ ${cfg.lang}: ${booksMeta.length} books, ${chaptersExtracted} chapters, ${versesExtracted} verses extracted into ${cfg.lang}/bible/`);
}

// Now build the master languages list in EXACT user priority:
// 1. Hebrew
// 2. English
// 3. English bsb (Put full form)
// 4. English YLT
// 5. Malayalam
// rest.. below
const EXISTING_LANGS = [
  {
    id: 'hebrew',
    name: 'Biblical Hebrew',
    nativeName: 'עִבְרִית',
    dir: 'rtl',
    translation: 'Westminster Leningrad Codex (WLC)',
    booksCount: 39,
    firstBook: 'genesis',
    flag: '🇮🇱',
  },
  {
    id: 'english',
    name: 'English (KJV)',
    nativeName: 'English',
    dir: 'ltr',
    translation: 'King James Version (1769)',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇬🇧',
  },
  {
    id: 'english-bsb',
    name: 'English (Berean Standard Bible)',
    nativeName: 'Berean Standard Bible',
    dir: 'ltr',
    translation: 'Berean Standard Bible (BSB)',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇺🇸',
  },
  {
    id: 'english-ylt',
    name: "English (Young's Literal Translation)",
    nativeName: "Young's Literal Translation",
    dir: 'ltr',
    translation: "Young's Literal Translation (YLT 1898)",
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇬🇧',
  },
  {
    id: 'malayalam',
    name: 'Malayalam (സത്യവേദപുസ്തകം)',
    nativeName: 'മലയാളം',
    dir: 'ltr',
    translation: 'Sathyavedapusthakam (1910)',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇮🇳',
  },
  {
    id: 'greek',
    name: 'Koine Greek',
    nativeName: 'Ἑλληνική',
    dir: 'ltr',
    translation: 'Textus Receptus (1550/1894)',
    booksCount: 27,
    firstBook: 'matthew',
    flag: '🇬🇷',
  },
  {
    id: 'aramaic',
    name: 'Aramaic (Syriac Peshitta)',
    nativeName: 'ܐܪܡܝܐ (Peshitta)',
    dir: 'rtl',
    translation: 'Syriac Peshitta New Testament',
    booksCount: 27,
    firstBook: 'matthew',
    flag: '🇸🇾',
  },
  {
    id: 'latin',
    name: 'Latin (Biblia Sacra Vulgata)',
    nativeName: 'Latina',
    dir: 'ltr',
    translation: 'Latin Vulgate',
    booksCount: 78,
    firstBook: 'genesis',
    flag: '🇻🇦',
  },
  {
    id: 'german',
    name: 'German (Elberfelder 1905)',
    nativeName: 'Deutsch',
    dir: 'ltr',
    translation: 'Unrevidierte Elberfelder (1905)',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇩🇪',
  },
  {
    id: 'french',
    name: 'French (Augustin Crampon)',
    nativeName: 'Français',
    dir: 'ltr',
    translation: 'Bible Augustin Crampon (1923)',
    booksCount: 73,
    firstBook: 'genesis',
    flag: '🇫🇷',
  },
  {
    id: 'spanish',
    name: 'Spanish (Reina-Valera 1909)',
    nativeName: 'Español',
    dir: 'ltr',
    translation: 'La Santa Biblia Reina-Valera (1909)',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇪🇸',
  },
  {
    id: 'russian',
    name: 'Russian (Синодальный перевод)',
    nativeName: 'Русский',
    dir: 'ltr',
    translation: 'Синодального Перевода Библии',
    booksCount: 78,
    firstBook: 'genesis',
    flag: '🇷🇺',
  },
  {
    id: 'chinese',
    name: 'Chinese (和合本 繁體字)',
    nativeName: '中文 (和合本)',
    dir: 'ltr',
    translation: '和合本 (繁體字 ChiUn)',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇨🇳',
  },
  {
    id: 'burmese',
    name: 'Burmese Judson',
    nativeName: 'မြန်မာဘာသာ',
    dir: 'ltr',
    translation: '1835 Judson Burmese Bible',
    booksCount: 66,
    firstBook: 'genesis',
    flag: '🇲🇲',
  },
  {
    id: 'slavic',
    name: 'Church Slavonic',
    nativeName: 'Церковнославя́нскій',
    dir: 'ltr',
    translation: '1757 Elizabeth Bible',
    booksCount: 76,
    firstBook: 'genesis',
    flag: '☦️',
  },
];

// Write updated public/data/languages.json
fs.writeFileSync(
  path.join(rootDir, 'public', 'data', 'languages.json'),
  JSON.stringify(EXISTING_LANGS, null, 2),
  'utf8'
);

console.log('🎉 Updated languages.json successfully with 15 languages in exact priority order!');
