import Link from 'next/link';

export default function SiteFooter() {
  const emailDraftSubject = encodeURIComponent('Sacred Scriptures Inquiry — ciyo.in');
  const emailDraftBody = encodeURIComponent(
    'Hello Clinto,\n\nI am contacting you regarding the Sacred Scriptures multi-language Bible platform (bible.ciyo.in).\n\nKind regards,'
  );
  const emailHref = `mailto:care@ciyo.in?subject=${emailDraftSubject}&body=${emailDraftBody}`;

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#04060d]/95 backdrop-blur-xl text-slate-400 font-sans mt-auto">
      {/* Top Banner / Non-Commercial Notice */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-amber-950/20 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300 uppercase tracking-widest">
              100% Free &amp; Non-Commercial
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Public open-access for spiritual, ecclesiastical &amp; academic study
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/about"
              className="text-sky-400 hover:text-sky-300 font-medium underline underline-offset-4 transition-colors"
            >
              About the Codices &amp; Data Sources →
            </Link>
            <a
              href="https://github.com/clinto-abraham/bible.ciyo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#060814] rounded-full flex items-center justify-center">
                  <span className="text-amber-400 font-serif text-sm font-bold">✝</span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-base tracking-wide block leading-tight text-white">
                  Sacred Scriptures
                </span>
                <span className="text-[10px] font-sans text-slate-500 uppercase tracking-widest block">
                  bible.ciyo.in
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Streaming ancient biblical manuscripts across 15 world translations. Read, listen, cross-reference, and compare original Hebrew, Greek, and Aramaic codices chapter-by-chapter.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/clinto-abraham/bible.ciyo.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>github.com/clinto-abraham/bible.ciyo.in</span>
              </a>
            </div>
          </div>

          {/* Column 2: Supported Translations */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
              Supported Codices
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li><span className="text-slate-300 font-medium">Hebrew:</span> Westminster Leningrad Codex</li>
              <li><span className="text-slate-300 font-medium">Greek:</span> Textus Receptus (1550/1894)</li>
              <li><span className="text-slate-300 font-medium">Aramaic:</span> Syriac Peshitta NT</li>
              <li><span className="text-slate-300 font-medium">English:</span> KJV (1769), BSB, YLT (1898)</li>
              <li><span className="text-slate-300 font-medium">Malayalam:</span> സത്യവേദപുസ്തകം (1910)</li>
              <li><span className="text-slate-300 font-medium">Latin:</span> Biblia Sacra Vulgata</li>
              <li><span className="text-slate-300 font-medium">German, French, Spanish, Russian, Chinese, Burmese, Slavic</span></li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
              Navigation
            </h3>
            <ul className="text-xs space-y-2">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  Home &amp; Passage Selector
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About the Project &amp; Codices
                </Link>
              </li>
              <li>
                <Link href="/genesis/1?lang=english" className="hover:text-sky-400 transition-colors">
                  Genesis 1 (English KJV)
                </Link>
              </li>
              <li>
                <Link href="/genesis/1?lang=hebrew" className="hover:text-sky-400 transition-colors">
                  Genesis 1 (Hebrew Tanakh)
                </Link>
              </li>
              <li>
                <Link href="/matthew/1?lang=greek" className="hover:text-sky-400 transition-colors">
                  Matthew 1 (Greek Textus Receptus)
                </Link>
              </li>
              <li>
                <Link href="/matthew/1?lang=aramaic" className="hover:text-sky-400 transition-colors">
                  Matthew 1 (Syriac Aramaic Peshitta)
                </Link>
              </li>
              <li>
                <Link href="/genesis/1?lang=malayalam" className="hover:text-sky-400 transition-colors">
                  ഉല്പത്തി 1 (Malayalam 1910)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
              Contact &amp; Support
            </h3>
            <div className="space-y-3 text-xs">
              {/* Email with Ready-to-Send Draft */}
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Email (Click to Draft)
                </span>
                <a
                  href={emailHref}
                  className="text-sky-400 hover:text-sky-300 font-medium underline underline-offset-4 transition-colors flex items-center gap-1.5 mt-0.5"
                  title="Click to compose an email to care@ciyo.in"
                >
                  <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>care@ciyo.in</span>
                </a>
              </div>

              {/* Phone */}
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Phone / Direct Line
                </span>
                <a
                  href="tel:+918590770477"
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5 mt-0.5"
                >
                  <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91-8590770477</span>
                </a>
              </div>

              {/* Physical Address */}
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Address
                </span>
                <address className="not-italic text-slate-300 text-xs leading-relaxed mt-0.5 flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Iritty, Kannur, Kerala 670703, India
                  </span>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Sacred Scriptures • ciyo.in official. All rights reserved for community open access.</p>
          <p className="text-[11px]">
            Designed with reverence for the Divine Scriptures • Free for all humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
