'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LanguageDropdown, { LanguageOption } from './LanguageDropdown';

interface BookSummary {
  name: string;
  slug: string;
  nativeName?: string;
  chapterCount: number;
}

interface ChapterNavProps {
  currentBook: string;
  currentChapter: number;
  currentLang: string;
  languages: LanguageOption[];
  books: BookSummary[];
  prevChapter?: { book: string; chapter: number; lang?: string } | null;
  nextChapter?: { book: string; chapter: number; lang?: string } | null;
}

export default function ChapterNav({
  currentBook,
  currentChapter,
  currentLang = 'english',
  languages,
  books,
  prevChapter,
  nextChapter,
}: ChapterNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectiveLang = searchParams?.get('lang') || currentLang || 'english';

  const selectedBookMeta = books.find((b) => b.slug === currentBook) || books[0];
  const maxChapters = selectedBookMeta ? selectedBookMeta.chapterCount : 50;

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBook = e.target.value;
    router.push(`/${newBook}/1?lang=${effectiveLang}`);
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChapter = e.target.value;
    router.push(`/${currentBook}/${newChapter}?lang=${effectiveLang}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#060814]/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Mobile top row / Desktop left side: Brand Logo & Mobile Language Dropdown */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <Link
            href={`/?lang=${effectiveLang}`}
            className="group flex items-center gap-2.5 sm:gap-3 transition-transform hover:opacity-95 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-blue-500/10">
              <div className="w-full h-full bg-[#060814] rounded-full flex items-center justify-center">
                <span className="text-amber-400 font-serif text-sm font-bold">✝</span>
              </div>
            </div>
            <div className="leading-tight">
              <span className="block font-semibold tracking-wide text-xs sm:text-sm text-white group-hover:text-sky-400 transition-colors">
                Sacred Scriptures
              </span>
              <span className="block text-[9px] sm:text-[10px] font-sans text-slate-400 uppercase tracking-widest">
                ciyo.in official
              </span>
            </div>
          </Link>

          {/* Mobile-only Language Switcher */}
          <div className="sm:hidden shrink-0">
            <Suspense fallback={<div className="w-28 h-8 rounded-full bg-slate-900 border border-slate-800 animate-pulse" />}>
              <LanguageDropdown currentLang={effectiveLang} languages={languages} />
            </Suspense>
          </div>
        </div>

        {/* Center: Book & Chapter Navigation + Next/Prev */}
        <div className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 font-sans text-xs sm:text-sm w-full sm:w-auto">
          {/* Prev Chapter */}
          {prevChapter ? (
            <Link
              href={`/${prevChapter.book}/${prevChapter.chapter}?lang=${effectiveLang}`}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-xs shrink-0"
              title="Previous Chapter"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline">Prev</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-900 text-slate-600 cursor-not-allowed shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline">Prev</span>
            </span>
          )}

          {/* Book Select */}
          <select
            value={currentBook}
            onChange={handleBookChange}
            aria-label="Select Book"
            className="flex-1 sm:flex-initial max-w-[180px] sm:max-w-none truncate bg-slate-900/90 border border-slate-800 text-slate-100 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors cursor-pointer text-xs font-medium shadow-xs"
          >
            {books.map((b) => (
              <option key={b.slug} value={b.slug} className="bg-slate-900 text-white">
                {b.name} {b.nativeName && b.nativeName !== b.name ? `(${b.nativeName})` : ''}
              </option>
            ))}
          </select>

          {/* Chapter Select */}
          <select
            value={currentChapter}
            onChange={handleChapterChange}
            aria-label="Select Chapter"
            className="shrink-0 bg-slate-900/90 border border-slate-800 text-slate-100 rounded-full px-2.5 sm:px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors cursor-pointer text-xs font-medium shadow-xs"
          >
            {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch} className="bg-slate-900 text-white">
                Ch {ch}
              </option>
            ))}
          </select>

          {/* Next Chapter */}
          {nextChapter ? (
            <Link
              href={`/${nextChapter.book}/${nextChapter.chapter}?lang=${effectiveLang}`}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-amber-500/30 hover:border-amber-400/60 text-amber-300 font-medium transition-all shadow-xs shrink-0"
              title="Next Chapter"
            >
              <span className="hidden md:inline">Next</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-900 text-slate-600 cursor-not-allowed shrink-0">
              <span className="hidden md:inline">Next</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>

        {/* Desktop Language Switcher & About */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link
            href="/about"
            className="text-xs font-medium text-slate-300 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-full border border-slate-800/80 bg-slate-900/70 hover:border-slate-700 shadow-xs"
          >
            About
          </Link>
          <Suspense fallback={<div className="w-32 h-9 rounded-full bg-slate-900 border border-slate-800 animate-pulse" />}>
            <LanguageDropdown currentLang={effectiveLang} languages={languages} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
