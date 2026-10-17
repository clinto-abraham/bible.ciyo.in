import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'About Sacred Scriptures | Open-Access Multi-Language Biblical Codices',
  description:
    'Learn about the Sacred Scriptures project (bible.ciyo.in), our 100% free non-commercial mission, GitHub open-source repository, and the 15 ancient biblical manuscripts and historical database sources.',
  keywords: [
    'About Sacred Scriptures',
    'bible.ciyo.in',
    'ciyo.in',
    'Clinto Abraham',
    'Open Source Bible',
    'Free Biblical Codices',
    'Westminster Leningrad Codex source',
    'Textus Receptus source',
    'Syriac Peshitta source',
    'Malayalam Bible database',
    'Bible GitHub repository',
    'Non-commercial Bible study'
  ],
  alternates: {
    canonical: 'https://bible.ciyo.in/about',
  },
  openGraph: {
    type: 'article',
    url: 'https://bible.ciyo.in/about',
    title: 'About Sacred Scriptures | Open-Access Multi-Language Biblical Codices',
    description:
      'Learn about the Sacred Scriptures project (bible.ciyo.in), our 100% free non-commercial mission, and GitHub open-source repository.',
    siteName: 'Sacred Scriptures - ciyo.in',
  },
};

export default function AboutPage() {
  const emailDraftSubject = encodeURIComponent('Sacred Scriptures Inquiry — ciyo.in');
  const emailDraftBody = encodeURIComponent(
    'Hello Clinto,\n\nI am contacting you regarding the Sacred Scriptures multi-language Bible platform (bible.ciyo.in).\n\nKind regards,'
  );
  const emailHref = `mailto:care@ciyo.in?subject=${emailDraftSubject}&body=${emailDraftBody}`;

  const codices = [
    {
      title: 'Biblical Hebrew Tanakh',
      subtitle: 'Westminster Leningrad Codex (WLC)',
      lang: 'עִבְרִית (Biblical Hebrew)',
      origin:
        'Digitized by the J. Alan Groves Center for Advanced Biblical Research in Philadelphia, based on the Leningrad Codex (B19a, dated 1008 CE), the oldest complete manuscript of the Hebrew Bible. Cross-verified with Open Scriptures Hebrew Bible database.',
      scope: '39 Old Testament Books (Torah, Nevi’im, Ketuvim)',
      badge: 'Ancient Hebrew',
      badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    },
    {
      title: 'Koine Greek New Testament',
      subtitle: 'Textus Receptus (Stephanus 1550 / Scrivener 1894)',
      lang: 'Ἑλληνική (Koine Greek)',
      origin:
        'The historic Received Text of the Protestant Reformation, collated by Robert Estienne (Stephanus) in 1550 and edited with manuscript variants by Frederick Henry Ambrose Scrivener in 1894.',
      scope: '27 New Testament Books (Gospels, Acts, Epistles, Apocalypse)',
      badge: 'Historic Greek',
      badgeColor: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    },
    {
      title: 'Syriac Aramaic New Testament',
      subtitle: 'Syriac Peshitta (ܦܫܝܛܬܐ)',
      lang: 'ܐܪܡܝܐ (Syriac Aramaic)',
      origin:
        'The classical Syriac New Testament preserved by the ancient Church of the East and the West Syriac traditions. Sourced from critical transcriptions published by the British and Foreign Bible Society (BFBS) and the Khaboris manuscript lineage.',
      scope: '27 New Testament Books + Genesis 1 Comparative Codex',
      badge: 'Semitic Aramaic',
      badgeColor: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    },
    {
      title: 'English Authorized Version',
      subtitle: 'King James Version (KJV 1769)',
      lang: 'English',
      origin:
        'The monumental 1611 English translation commissioned by King James I, incorporating the Oxford standard text revised by Benjamin Blayney in 1769. Widely recognized for its literary majesty and scriptural authority in the English-speaking world.',
      scope: '66 Canonical Books',
      badge: 'Historic English',
      badgeColor: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
    },
    {
      title: 'Berean Standard Bible',
      subtitle: 'Berean Standard Bible (BSB 2022)',
      lang: 'Modern English',
      origin:
        'A modern, faithful, and readable English translation translated directly from the original Hebrew, Aramaic, and Greek texts by a team of biblical scholars. Dedicated to the public domain (CC0) for unhindered worldwide distribution.',
      scope: '66 Canonical Books',
      badge: 'Modern English',
      badgeColor: 'border-teal-500/50 bg-teal-500/10 text-teal-300',
    },
    {
      title: 'Young’s Literal Translation',
      subtitle: 'Robert Young (YLT 1898)',
      lang: 'Literal English',
      origin:
        'Authored by Robert Young (author of Young’s Analytical Concordance), this translation strictly mirrors the underlying Hebrew and Greek grammatical structures and verb tenses (such as the Hebrew waw-consecutive).',
      scope: '66 Canonical Books',
      badge: 'Literal Translation',
      badgeColor: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
    },
    {
      title: 'Malayalam Holy Bible',
      subtitle: 'സത്യവേദപുസ്തകം (Sathyavedapusthakam 1910)',
      lang: 'മലയാളം (Malayalam)',
      origin:
        'The pioneering Malayalam translation initiated by Rev. Benjamin Bailey of the Church Mission Society (Kottayam, 1841) and finalized by the Bible Society of India in 1910. Sourced from verified public domain datasets curated by Free Software Community of India (FSCI).',
      scope: '66 Canonical Books',
      badge: 'Indian Classical',
      badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    },
    {
      title: 'Latin Sacred Vulgate',
      subtitle: 'Biblia Sacra Vulgata (Clementine 1592)',
      lang: 'Latina (Classical Latin)',
      origin:
        'Translated by St. Jerome in Bethlehem between 382 and 405 CE from original Hebrew and Greek texts, promulgated as the official text of the Latin Church by the Council of Trent, in the 1592 Clementine standard revision.',
      scope: '78 Canonical & Deuterocanonical Books',
      badge: 'Western Liturgical',
      badgeColor: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
    },
    {
      title: 'German Elberfelder Bibel',
      subtitle: 'Unrevidierte Elberfelder (1905)',
      lang: 'Deutsch (German)',
      origin:
        'Prepared by Julius Anton von Poseck, Carl Brockhaus, and John Nelson Darby, revered globally for its unparalleled literal fidelity and exact morphological translation of original biblical texts.',
      scope: '66 Canonical Books',
      badge: 'Germanic',
      badgeColor: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    },
    {
      title: 'French Augustin Crampon',
      subtitle: 'Bible Augustin Crampon (1923)',
      lang: 'Français (French)',
      origin:
        'The celebrated French Catholic translation produced directly from original Hebrew, Aramaic, and Greek manuscripts by Canon Augustin Crampon of the Cathedral of Amiens.',
      scope: '73 Canonical Books',
      badge: 'Romance Language',
      badgeColor: 'border-blue-400/50 bg-blue-400/10 text-blue-200',
    },
    {
      title: 'Spanish Reina-Valera',
      subtitle: 'Reina-Valera Antigua (1909)',
      lang: 'Español (Spanish)',
      origin:
        'The classic Spanish Protestant translation by Casiodoro de Reina (1569) and Cipriano de Valera (1602), in the 1909 edition, celebrated throughout Latin America and Spain.',
      scope: '66 Canonical Books',
      badge: 'Hispanic Classical',
      badgeColor: 'border-orange-500/50 bg-orange-500/10 text-orange-300',
    },
    {
      title: 'Russian Synodal Bible',
      subtitle: 'Синодальный перевод (1876)',
      lang: 'Русский (Russian)',
      origin:
        'The authorized Russian translation sanctioned by the Holy Governing Synod of the Russian Orthodox Church under Emperor Alexander II, translated from original biblical languages under Saint Philaret of Moscow.',
      scope: '66 Canonical Books',
      badge: 'Slavic Cyrillic',
      badgeColor: 'border-red-500/50 bg-red-500/10 text-red-300',
    },
    {
      title: 'Chinese Union Version',
      subtitle: '和合本 (CUV 1919)',
      lang: '中文 (Chinese)',
      origin:
        'The preeminent Chinese Bible translation produced by a multi-denominational committee of Protestant translators over 28 years and published in 1919. Sourced from open public domain Chinese scripture datasets.',
      scope: '66 Canonical Books',
      badge: 'East Asian',
      badgeColor: 'border-pink-500/50 bg-pink-500/10 text-pink-300',
    },
    {
      title: 'Burmese Judson Translation',
      subtitle: 'ယုဒသန်ကျမ်းစာ (Adoniram Judson 1835)',
      lang: 'မြန်မာ (Burmese)',
      origin:
        'The monumental translation translated directly from biblical Hebrew and Greek by the legendary missionary and scholar Adoniram Judson, first completed in 1835 in Yangon and Maulmein.',
      scope: '66 Canonical Books',
      badge: 'Southeast Asian',
      badgeColor: 'border-amber-400/50 bg-amber-400/10 text-amber-200',
    },
    {
      title: 'Church Slavonic Elizabeth Bible',
      subtitle: 'Елизаветинская Библия (1751)',
      lang: 'Церковнославянский (Church Slavonic)',
      origin:
        'The definitive liturgical Bible of the Slavic Orthodox Churches, commissioned by Empress Elizabeth of Russia and based on the ancient Cyrillo-Methodian manuscript tradition.',
      scope: '66 Canonical Books',
      badge: 'Liturgical Slavonic',
      badgeColor: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060814] text-white selection:bg-sky-500/30 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-gradient-to-b from-blue-900/20 via-indigo-950/15 to-transparent pointer-events-none blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="fixed top-1/2 right-[-100px] w-[500px] h-[500px] bg-amber-500/5 pointer-events-none blur-3xl -z-10"
      />

      {/* Header */}
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

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            >
              ← Back to Bible Reader
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex-1">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-sans tracking-wider uppercase font-semibold text-emerald-300">
              OPEN-ACCESS THEOLOGICAL PLATFORM
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              Sacred Scriptures
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            A non-commercial, high-performance web platform built to preserve, cross-reference, and illuminate the Divine Scriptures in their original ancient manuscripts and 15 world translations.
          </p>
        </div>

        {/* 100% NON-COMMERCIAL NOTICE CARD */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/40 shadow-xl backdrop-blur-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold uppercase tracking-wider border border-emerald-500/40">
                  Non-Commercial Declaration
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Freely Given, Freely Received
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                This application is <strong className="text-white font-semibold">100% non-commercial</strong> and created for the sole benefit of the human family. Anyone anywhere on earth may access all information, read, study, listen to audio recitation, and download the scriptures freely without any paywall, subscription, advertisement, or data monetization.
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <a
                href="https://github.com/clinto-abraham/bible.ciyo.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>View on GitHub</span>
              </a>
              <a
                href={emailHref}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all"
              >
                <span>Email Creator (care@ciyo.in)</span>
              </a>
            </div>
          </div>
        </section>

        {/* REPOSITORY & OPEN SOURCE SECTION */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Official GitHub Repository</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                  open-source
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                The complete codebase, chapter extractors, translation comparison engines, and data pipeline are openly published on GitHub. Contributions, theological corrections, and academic peer reviews are warmly welcomed.
              </p>
              <div className="pt-2 font-mono text-xs text-sky-400 break-all">
                <a
                  href="https://github.com/clinto-abraham/bible.ciyo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1.5"
                >
                  <span>https://github.com/clinto-abraham/bible.ciyo.in</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* THE 15 HISTORICAL CODICES & DATA SOURCES */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Manuscript Provenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              The 15 Historical Codices &amp; Data Sources
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Our textual databases originate from public domain academic archives, scanned historical codices, and scholarly transcription projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {codices.map((codex, idx) => (
              <div
                key={codex.title}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-slate-500">#{idx + 1}</span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${codex.badgeColor}`}
                    >
                      {codex.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-0.5">{codex.title}</h3>
                  <div className="text-xs text-amber-400/90 font-medium mb-3">
                    {codex.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {codex.origin}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-slate-400 font-medium">{codex.lang}</span>
                  <span>{codex.scope}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CREATOR & CONTACT DIRECTORY */}
        <section className="mb-16 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Direct Contact
            </span>
            <h2 className="text-2xl font-bold text-white mt-1 mb-2">
              Publisher &amp; Contact Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              If you have suggestions, questions, theological feedback, or desire to partner in digitizing additional biblical manuscripts, please reach out directly:
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider block font-semibold">
                    Email (Instant Draft)
                  </span>
                  <a
                    href={emailHref}
                    className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4 text-sm sm:text-base transition-colors"
                  >
                    care@ciyo.in
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Clicking opens an email draft directly in your preferred email client.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider block font-semibold">
                    Phone / Direct Line
                  </span>
                  <a
                    href="tel:+918590770477"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-sm sm:text-base transition-colors"
                  >
                    +91-8590770477
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider block font-semibold">
                    Address
                  </span>
                  <address className="not-italic text-slate-300 font-medium text-sm sm:text-base">
                    Iritty, Kannur, Kerala 670703, India
                  </address>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <div className="text-center py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-semibold text-sm tracking-wide shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
          >
            <span>Start Reading the Scriptures Now →</span>
          </Link>
        </div>
      </main>

      {/* Unified Site Footer */}
      <SiteFooter />
    </div>
  );
}
