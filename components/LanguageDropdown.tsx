'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { setClientPreferredLanguage } from '@/lib/preferences';

export interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  translation: string;
}

interface LanguageDropdownProps {
  currentLang: string;
  languages: LanguageOption[];
}

export default function LanguageDropdown({ currentLang, languages }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeLangId = searchParams?.get('lang') || currentLang || 'english';
  const activeLang = languages.find((l) => l.id === activeLangId) || languages[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return languages;
    const q = searchQuery.toLowerCase().trim();
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.translation.toLowerCase().includes(q)
    );
  }, [languages, searchQuery]);

  // Check scroll position to show/hide scroll hints
  const checkScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    setCanScrollUp(scrollTop > 6);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6);
  };

  // When opening dropdown: scroll active item into view, update scroll arrows
  useEffect(() => {
    if (isOpen) {
      // Small timeout to let DOM render
      const timer = setTimeout(() => {
        checkScroll();
        if (activeItemRef.current) {
          activeItemRef.current.scrollIntoView({ block: 'nearest' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleScrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -180, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 180, behavior: 'smooth' });
    }
  };

  const handleSelect = (langId: string) => {
    setIsOpen(false);
    // Persist in cookie and localStorage
    setClientPreferredLanguage(langId);

    // If on a chapter page like /[book]/[chapter], adjust book if necessary (e.g. Greek is NT only)
    const ntBooks = [
      'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', '2-corinthians',
      'galatians', 'ephesians', 'philippians', 'colossians', '1-thessalonians', '2-thessalonians',
      '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews', 'james', '1-peter', '2-peter',
      '1-john', '2-john', '3-john', 'jude', 'revelation'
    ];

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
      let book = segments[0];
      let chapter = segments[1];

      if (langId === 'greek' && !ntBooks.includes(book)) {
        book = 'matthew';
        chapter = '1';
      } else if (langId === 'aramaic' && !ntBooks.includes(book) && book !== 'genesis') {
        book = 'matthew';
        chapter = '1';
      } else if (langId === 'hebrew' && ntBooks.includes(book)) {
        book = 'genesis';
        chapter = '1';
      }
      router.push(`/${book}/${chapter}?lang=${langId}`);
    } else {
      router.push(`/?lang=${langId}`);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - exactly styled as in Screenshot 2 */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery('');
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-emerald-500 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all text-xs sm:text-sm font-medium cursor-pointer"
      >
        <span className="text-emerald-600 dark:text-emerald-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </span>
        <span className="text-base select-none">{activeLang?.flag || '🇬🇧'}</span>
        <span className="font-semibold text-slate-900 dark:text-white">
          {activeLang?.name.split(' ')[0] || 'English'}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div
          onWheel={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-76 sm:w-84 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        >
          {/* Header & Search Bar */}
          <div className="pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
            <div className="px-2 pt-1 pb-1.5 flex items-center justify-between text-[11px] font-sans font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
              <span>SELECT LANGUAGE / ഭാഷ</span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">
                {languages.length} AVAILABLE
              </span>
            </div>

            {/* Quick Filter Search */}
            <div className="relative mt-1">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Scroll Up Control Button */}
          {canScrollUp && (
            <button
              type="button"
              onClick={handleScrollUp}
              className="w-full py-1 text-[11px] text-slate-400 hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
              <span>Scroll up</span>
            </button>
          )}

          {/* Scrollable Language Options List - Contained Scroll with No Background Chaining */}
          <div
            ref={listRef}
            onScroll={checkScroll}
            className="max-h-[min(22rem,calc(100vh-12rem))] overflow-y-auto overscroll-contain space-y-1 pr-1 scroll-smooth"
          >
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching language found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredLanguages.map((l) => {
                const isSelected = l.id === activeLangId;
                return (
                  <button
                    key={l.id}
                    ref={isSelected ? activeItemRef : undefined}
                    onClick={() => handleSelect(l.id)}
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl select-none">{l.flag}</span>
                      <div className="leading-tight">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">
                          {l.name}
                          {l.nativeName && l.nativeName !== l.name && (
                            <span className="ml-1.5 text-xs font-normal text-slate-500 dark:text-slate-400">
                              ({l.nativeName})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {l.translation}
                        </div>
                      </div>
                    </div>

                    {/* Emerald checkmark for selected language */}
                    {isSelected && (
                      <span className="text-emerald-600 dark:text-emerald-400 ml-2 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Scroll Down Control Button */}
          {canScrollDown && (
            <button
              type="button"
              onClick={handleScrollDown}
              className="w-full mt-1 py-1 text-[11px] text-slate-400 hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800/60"
            >
              <span>Scroll down for more</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
