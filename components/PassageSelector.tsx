'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface BookOption {
  name: string;
  slug: string;
  nativeName?: string;
  chapterCount: number;
}

interface PassageSelectorProps {
  currentLang?: string;
  books: BookOption[];
  initialBook?: string;
  initialChapter?: number;
}

export default function PassageSelector({
  currentLang = 'english',
  books,
  initialBook = 'genesis',
  initialChapter = 1,
}: PassageSelectorProps) {
  const router = useRouter();

  const [selectedBookSlug, setSelectedBookSlug] = useState(initialBook);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedVerse, setSelectedVerse] = useState<number | string>(1);

  // Dropdown open states
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [verseDropdownOpen, setVerseDropdownOpen] = useState(false);

  // Search filter query inputs
  const [bookSearch, setBookSearch] = useState('');
  const [chapterSearch, setChapterSearch] = useState('');
  const [verseSearch, setVerseSearch] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const bookSearchInputRef = useRef<HTMLInputElement>(null);
  const chapterSearchInputRef = useRef<HTMLInputElement>(null);
  const verseSearchInputRef = useRef<HTMLInputElement>(null);

  // Current selected book metadata
  const selectedBook = useMemo(() => {
    return books.find((b) => b.slug === selectedBookSlug) || books[0];
  }, [books, selectedBookSlug]);

  const maxChapters = selectedBook?.chapterCount || 50;

  // Filtered lists based on search
  const filteredBooks = useMemo(() => {
    const q = bookSearch.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.nativeName && b.nativeName.toLowerCase().includes(q)) ||
        b.slug.toLowerCase().includes(q)
    );
  }, [books, bookSearch]);

  const filteredChapters = useMemo(() => {
    const all = Array.from({ length: maxChapters }, (_, i) => i + 1);
    const q = chapterSearch.trim();
    if (!q) return all;
    return all.filter((ch) => String(ch).includes(q));
  }, [maxChapters, chapterSearch]);

  // Rough estimation of verses (or up to 176 for Psalms 119)
  const estimatedVerses = useMemo(() => {
    const count = 50; // standard maximum verse count for dropdown
    const all = Array.from({ length: count }, (_, i) => i + 1);
    const q = verseSearch.trim();
    if (!q) return all;
    return all.filter((v) => String(v).includes(q));
  }, [verseSearch]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setBookDropdownOpen(false);
        setChapterDropdownOpen(false);
        setVerseDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search inputs when dropdown opens
  useEffect(() => {
    if (bookDropdownOpen) setTimeout(() => bookSearchInputRef.current?.focus(), 50);
  }, [bookDropdownOpen]);

  useEffect(() => {
    if (chapterDropdownOpen) setTimeout(() => chapterSearchInputRef.current?.focus(), 50);
  }, [chapterDropdownOpen]);

  useEffect(() => {
    if (verseDropdownOpen) setTimeout(() => verseSearchInputRef.current?.focus(), 50);
  }, [verseDropdownOpen]);

  const startBook = currentLang === 'greek' || currentLang === 'aramaic' ? 'matthew' : 'genesis';

  const handleGo = () => {
    const targetBook = selectedBook?.slug || startBook;
    const targetChapter = selectedChapter || 1;
    const verseNum = selectedVerse && Number(selectedVerse) >= 1 ? Number(selectedVerse) : 1;
    const verseQuery = `&verse=${verseNum}`;
    const verseHash = `#verse-${verseNum}`;
    router.push(`/${targetBook}/${targetChapter}?lang=${currentLang}${verseQuery}${verseHash}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" ref={containerRef}>
      {/* 1. HUGE READ BIBLE NOW BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/${startBook}/1?lang=${currentLang}`}
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-bold text-lg sm:text-xl tracking-wider uppercase shadow-2xl shadow-blue-500/25 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center"
        >
          <span className="text-xl">📖</span>
          <span>READ BIBLE NOW</span>
          <span className="text-xs bg-black/30 px-2.5 py-1 rounded-full font-medium tracking-widest normal-case border border-white/20">
            {startBook === 'matthew' ? 'Matthew 1' : 'Genesis 1'}
          </span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* 2. SEARCHABLE PASSAGE SELECTOR CARD */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sky-400">⚡</span>
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-300 font-sans">
              Quick Passage Navigator
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-sans">
            Jump to any Book, Chapter, or Verse
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* BOOK SELECTOR WITH SEARCH */}
          <div className="sm:col-span-5 relative">
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Book
            </label>
            <button
              type="button"
              onClick={() => {
                setBookDropdownOpen(!bookDropdownOpen);
                setChapterDropdownOpen(false);
                setVerseDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 hover:border-sky-500/80 text-white font-medium text-sm transition-all text-left shadow-xs cursor-pointer"
            >
              <div className="truncate">
                <span className="font-semibold text-slate-100">{selectedBook?.name || 'Genesis'}</span>
                {selectedBook?.nativeName && selectedBook.nativeName !== selectedBook.name && (
                  <span className="text-xs text-slate-400 ml-1.5">({selectedBook.nativeName})</span>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
                  bookDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Book Search Dropdown Popover */}
            {bookDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full sm:w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar Input */}
                <div className="relative mb-2">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    ref={bookSearchInputRef}
                    type="text"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    placeholder="Search book (e.g. Gen, Matt)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Books List */}
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                  {filteredBooks.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500">No books found</div>
                  ) : (
                    filteredBooks.map((b) => {
                      const isSelected = b.slug === selectedBookSlug;
                      return (
                        <button
                          key={b.slug}
                          type="button"
                          onClick={() => {
                            setSelectedBookSlug(b.slug);
                            setSelectedChapter(1);
                            setBookDropdownOpen(false);
                            setBookSearch('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600/30 text-sky-200 border border-sky-500/40'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-white">{b.name}</span>
                            {b.nativeName && b.nativeName !== b.name && (
                              <span className="text-[11px] text-slate-400 ml-1.5 font-normal">
                                ({b.nativeName})
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {b.chapterCount} ch
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CHAPTER SELECTOR WITH SEARCH */}
          <div className="sm:col-span-3 relative">
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Chapter
            </label>
            <button
              type="button"
              onClick={() => {
                setChapterDropdownOpen(!chapterDropdownOpen);
                setBookDropdownOpen(false);
                setVerseDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 hover:border-sky-500/80 text-white font-medium text-sm transition-all text-left shadow-xs cursor-pointer"
            >
              <span>Chapter {selectedChapter}</span>
              <svg
                className={`w-4 h-4 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${
                  chapterDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Chapter Search Dropdown */}
            {chapterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full sm:w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-2">
                  <input
                    ref={chapterSearchInputRef}
                    type="text"
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    placeholder="Filter chapter number..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto grid grid-cols-5 gap-1.5 p-1">
                  {filteredChapters.map((ch) => {
                    const isSelected = ch === selectedChapter;
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          setSelectedChapter(ch);
                          setChapterDropdownOpen(false);
                          setChapterSearch('');
                        }}
                        className={`py-2 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* VERSE SELECTOR WITH SEARCH */}
          <div className="sm:col-span-2 relative">
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Verse
            </label>
            <button
              type="button"
              onClick={() => {
                setVerseDropdownOpen(!verseDropdownOpen);
                setBookDropdownOpen(false);
                setChapterDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 hover:border-sky-500/80 text-white font-medium text-sm transition-all text-left shadow-xs cursor-pointer"
            >
              <span>Verse {selectedVerse}</span>
              <svg
                className={`w-4 h-4 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${
                  verseDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Verse Search Dropdown */}
            {verseDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full sm:w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-2">
                  <input
                    ref={verseSearchInputRef}
                    type="text"
                    value={verseSearch}
                    onChange={(e) => setVerseSearch(e.target.value)}
                    placeholder="Filter verse..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto grid grid-cols-5 gap-1.5 p-1">
                  {estimatedVerses.map((v) => {
                    const isSelected = v === Number(selectedVerse);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setSelectedVerse(v);
                          setVerseDropdownOpen(false);
                          setVerseSearch('');
                        }}
                        className={`py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div className="sm:col-span-2 pt-5 sm:pt-4">
            <button
              onClick={handleGo}
              type="button"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Go</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
