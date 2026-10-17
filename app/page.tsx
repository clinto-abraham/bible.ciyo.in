import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getBooks, getLanguages, BookMeta } from '@/lib/bible';
import { PREFERRED_LANG_COOKIE } from '@/lib/preferences';
import LanguageDropdown from '@/components/LanguageDropdown';
import PassageSelector from '@/components/PassageSelector';
import LanguageCard from '@/components/LanguageCard';
import SiteFooter from '@/components/SiteFooter';

interface HomePageProps {
  searchParams?: Promise<{ lang?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sParams = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(PREFERRED_LANG_COOKIE)?.value;

  // Use query param if provided, else persisted cookie, else english default
  const currentLang = sParams.lang || cookieLang || 'english';

  const [languages, books] = await Promise.all([
    getLanguages(),
    getBooks(currentLang),
  ]);

  const activeLangMeta = languages.find((l) => l.id === currentLang) || languages[0];

  const isHebrew = currentLang === 'hebrew';
  const isGreek = currentLang === 'greek';
  const isAramaic = currentLang === 'aramaic';

  // Group books for Hebrew
  const torahSlugs = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'];
  const neviimSlugs = [
    'joshua', 'judges', '1-samuel', '2-samuel', '1-kings', '2-kings', 'isaiah',
    'jeremiah', 'ezekiel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah',
    'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
  ];
  const torahBooks = books.filter((b) => torahSlugs.includes(b.slug));
  const neviimBooks = books.filter((b) => neviimSlugs.includes(b.slug));
  const ketuvimBooks = books.filter((b) => !torahSlugs.includes(b.slug) && !neviimSlugs.includes(b.slug));

  // NT classification
  const gospelsSlugs = ['matthew', 'mark', 'luke', 'john', 'acts'];
  const ntSlugs = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', '2-corinthians',
    'galatians', 'ephesians', 'philippians', 'colossians', '1-thessalonians', '2-thessalonians',
    '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews', 'james', '1-peter', '2-peter',
    '1-john', '2-john', '3-john', 'jude', 'revelation'
  ];
  const gospels = books.filter((b) => gospelsSlugs.includes(b.slug));
  const epistles = books.filter((b) => ntSlugs.includes(b.slug) && !gospelsSlugs.includes(b.slug));

  // Canonical Old / New Testament grouping
  const otBooks = books.filter((b) => !ntSlugs.includes(b.slug));
  const ntBooks = books.filter((b) => ntSlugs.includes(b.slug));

  const startBook = activeLangMeta.firstBook || 'genesis';

  // Schema.org WebSite & Organization JSON-LD for Search Engines
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://bible.ciyo.in/#website',
        name: 'Sacred Scriptures',
        alternateName: ['bible.ciyo.in', 'ciyo.in Bible', 'Multi-Language Biblical Codices'],
        url: 'https://bible.ciyo.in',
        description:
          'Read, listen, and cross-reference the Holy Scriptures across 15 ancient manuscripts and world translations: Westminster Leningrad Codex Hebrew, Textus Receptus Greek, Syriac Aramaic Peshitta, Malayalam, King James Version, and Berean Standard Bible.',
        inLanguage: languages.map((l) => l.id),
        publisher: {
          '@id': 'https://bible.ciyo.in/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://bible.ciyo.in/#organization',
        name: 'ciyo.in',
        url: 'https://ciyo.in',
        email: 'care@ciyo.in',
        telephone: '+91-8590770477',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Iritty',
          addressLocality: 'Kannur',
          addressRegion: 'Kerala',
          postalCode: '670703',
          addressCountry: 'IN',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#060814] text-white selection:bg-sky-500/30 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Cosmic background glow effects matching Screenshot 1 */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-blue-900/20 via-indigo-950/15 to-transparent pointer-events-none blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="fixed top-1/3 right-[-100px] w-[500px] h-[500px] bg-amber-500/5 pointer-events-none blur-3xl -z-10"
      />
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full border-b border-slate-800/80 backdrop-blur-2xl bg-[#060814]/85 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#060814] rounded-full flex items-center justify-center">
                <span className="text-amber-400 font-serif text-sm font-bold">✝</span>
              </div>
            </div>
            <div>
              <span className="font-semibold text-base tracking-wide block leading-tight text-white group-hover:text-sky-400 transition-colors">
                Sacred Scriptures
              </span>
              <span className="text-[10px] font-sans text-slate-400 uppercase tracking-widest block">
                ciyo.in official
              </span>
            </div>
          </Link>

          {/* Top Right: About Link & Language Dropdown */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/about"
              className="text-xs font-medium text-slate-300 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-full border border-slate-800/80 bg-slate-900/70 hover:border-slate-700 shadow-xs"
            >
              About
            </Link>
            <Suspense fallback={<div className="w-32 h-9 rounded-full bg-slate-900 border border-slate-800 animate-pulse" />}>
              <LanguageDropdown currentLang={currentLang} languages={languages} />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-16 w-full flex-1">
        <div className="text-center py-4 sm:py-6 mb-8 sm:mb-12 relative">
          {/* Ciyo Style Top Pill Tag */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 px-3.5 sm:px-4 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 shadow-md max-w-full">
            <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase font-semibold bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent truncate">
              MULTI-LANGUAGE SCRIPTURES
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase font-medium text-slate-400 shrink-0">
              CIYO.IN
            </span>
          </div>

          {/* Main Headline with Ciyo Gradient Concept */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.2] sm:leading-[1.15] break-words">
            The Living Word in{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              Ancient Tongues
            </span>{' '}
            &amp;{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Sacred Codices
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-400 font-sans font-normal leading-relaxed mb-8 sm:mb-10 px-2">
            A lightweight, heavily optimized reader streaming one chapter at a time with waving shimmer skeletons, multi-lingual audio pronunciation, and deep lexical translation history.
          </p>

          {/* HUGE READ BIBLE NOW BUTTON + PASSAGE SELECTOR DROPDOWNS WITH SEARCH */}
          <div className="mb-14">
            <PassageSelector
              currentLang={currentLang}
              books={books.map((b) => ({
                name: b.name,
                slug: b.slug,
                nativeName: b.nativeName || b.hebrewName,
                chapterCount: b.chapterCount,
              }))}
              initialBook={startBook}
              initialChapter={1}
            />
          </div>
        </div>

        {/* Feature Showcase: "What does our app do?" */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Designed for Reverence, Speed &amp; Scholarly Depth
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              How our reader brings historical biblical codices to life with zero bloat and high performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-xl mb-4 group-hover:scale-105 transition-transform">
                  ⚡
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Single-Chapter Streaming
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Never freezes your browser loading 5MB+ books. Static JSON chunks are fetched strictly on-demand, one chapter at a time, keeping memory footprints negligible.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-sky-400 font-mono">
                Suspense &amp; Server Components
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl mb-4 group-hover:scale-105 transition-transform">
                  🌊
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Waving Shimmer Skeletons
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  While next chapters stream in, a calming wave shimmer skeleton pulses in the adjacent reading area so the page layout never shifts or blinks abruptly.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-amber-400 font-mono">
                Fluid Shimmer Transition
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl mb-4 group-hover:scale-105 transition-transform">
                  📜
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Fifteen Sacred Codices
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Experience ancient manuscripts &amp; world translations: Hebrew (WLC), Greek (TR), Syriac Aramaic (Peshitta), Latin Vulgate, English (KJV, BSB, YLT), Malayalam, German, French, Spanish, Russian, Chinese, Burmese, and Church Slavonic.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-indigo-400 font-mono">
                Hebrew • English • Malayalam • 15 Global Codices
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl mb-4 group-hover:scale-105 transition-transform">
                  🔍
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Lexical Translation Modal
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click any verse to unlock the original text modal. Inspect phonetic transliterations, vocalized nikkud, morphological glosses, and Strong&apos;s references.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-emerald-400 font-mono">
                Morphology &amp; Strong&apos;s Concordance
              </div>
            </div>
          </div>
        </section>

        {/* Translation Cards Showcase */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
              Select Translation Edition
            </span>
            <span className="text-xs text-slate-500">
              {languages.length} Available Codices
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {languages.map((l) => (
              <LanguageCard key={l.id} language={l} isSelected={l.id === currentLang} />
            ))}
          </div>
        </div>

        {/* Books Library Section */}
        <div id="books-catalog" className="space-y-16 scroll-mt-24">
          {isHebrew ? (
            <>
              {/* Torah */}
              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-editorial-serif text-white">תּוֹרָה</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Torah • The Law (5 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {torahBooks.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>

              {/* Nevi'im */}
              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-editorial-serif text-white">נְבִיאִים</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Nevi&apos;im • The Prophets (21 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {neviimBooks.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>

              {/* Ketuvim */}
              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-editorial-serif text-white">כְּתוּבִים</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Ketuvim • The Writings (13 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {ketuvimBooks.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>
            </>
          ) : isGreek ? (
            <>
              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-editorial-serif text-white">Εὐαγγέλια</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Gospels &amp; Acts (5 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {gospels.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-editorial-serif text-white">Ἐπιστολαί</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Epistles &amp; Apocalypse (22 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {epistles.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>
            </>
          ) : isAramaic ? (
            <>
              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-aramaic text-white">ܐܘܢܓܠܝܘܢ</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Gospels &amp; Acts (5 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {gospels.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-aramaic text-white">ܐܓܪ̈ܬܐ</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Epistles &amp; Apocalypse (22 Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {epistles.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Old Testament */}
              <div>
                <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                  <h2 className="text-2xl font-semibold text-white">The Old Testament</h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    ({otBooks.length} Books)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {otBooks.map((b) => (
                    <BookCard key={b.slug} book={b} lang={currentLang} />
                  ))}
                </div>
              </div>

              {/* New Testament */}
              {ntBooks.length > 0 && (
                <div>
                  <div className="flex items-baseline gap-3 border-b border-slate-800 pb-3 mb-6">
                    <h2 className="text-2xl font-semibold text-white">The New Testament</h2>
                    <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                      ({ntBooks.length} Books)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {ntBooks.map((b) => (
                      <BookCard key={b.slug} book={b} lang={currentLang} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

function BookCard({ book, lang }: { book: BookMeta; lang: string }) {
  const isHebrew = lang === 'hebrew';
  const isAramaic = lang === 'aramaic';
  const isGreek = lang === 'greek';
  const isMalayalam = lang === 'malayalam';
  const isChinese = lang === 'chinese';
  const isBurmese = lang === 'burmese';
  const isSlavic = lang === 'slavic';
  const isRtl = isHebrew || isAramaic;

  return (
    <Link
      href={`/${book.slug}/1?lang=${lang}`}
      className="group p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/50 shadow-xs hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {book.nativeName && (
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`text-lg sm:text-xl font-medium text-white group-hover:text-amber-400 transition-colors mb-1 truncate ${
              isHebrew
                ? 'font-hebrew text-right'
                : isAramaic
                ? 'font-aramaic text-right'
                : isGreek
                ? 'font-greek'
                : isMalayalam
                ? 'font-malayalam'
                : isChinese
                ? 'font-chinese'
                : isBurmese
                ? 'font-burmese'
                : isSlavic
                ? 'font-slavic'
                : ''
            }`}
          >
            {book.nativeName}
          </div>
        )}
        <div className="text-xs font-sans font-medium text-slate-400 group-hover:text-white transition-colors truncate">
          {book.name}
        </div>
      </div>
      <div className="text-[11px] font-sans text-slate-500 mt-3">
        {book.chapterCount} {book.chapterCount === 1 ? 'chapter' : 'chapters'}
      </div>
    </Link>
  );
}
