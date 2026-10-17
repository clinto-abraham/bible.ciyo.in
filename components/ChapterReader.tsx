'use client';

import { useState, useEffect, useRef } from 'react';
import { ChapterData, Verse } from '@/lib/bible';
import VerseCard from './VerseCard';
import { getClientFontSize, setClientFontSize, FontSizeLevel } from '@/lib/preferences';

interface ChapterReaderProps {
  data: ChapterData;
  initialVerse?: string | number | null;
}

export default function ChapterReader({ data, initialVerse }: ChapterReaderProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#verse-')) {
      const h = Number.parseInt(window.location.hash.replace('#verse-', ''), 10);
      if (!Number.isNaN(h)) return h;
    }
    if (!initialVerse) return null;
    const n = Number.parseInt(String(initialVerse), 10);
    return Number.isNaN(n) ? null : n;
  });

  const [rangeStart, setRangeStart] = useState<number>(() => {
    if (initialVerse) {
      const s = String(initialVerse);
      if (s.includes('-')) {
        const [a] = s.split('-').map(Number);
        return a || 1;
      }
      const n = Number.parseInt(s, 10);
      return Number.isNaN(n) ? 1 : n;
    }
    return 1;
  });

  const [rangeEnd, setRangeEnd] = useState<number>(() => {
    if (initialVerse) {
      const s = String(initialVerse);
      if (s.includes('-')) {
        const [, b] = s.split('-').map(Number);
        return b || Math.min(10, data.verses.length);
      }
      const n = Number.parseInt(s, 10);
      return Number.isNaN(n) ? Math.min(10, data.verses.length) : n;
    }
    return Math.min(10, data.verses.length);
  });

  const [isRangeMode, setIsRangeMode] = useState<boolean>(() => {
    if (initialVerse && String(initialVerse).includes('-')) return true;
    return false;
  });

  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => getClientFontSize());
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Medium smooth scroll animation helper
  const scrollToVerse = (verseNum: number) => {
    setTimeout(() => {
      const el = document.getElementById(`verse-${verseNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Synchronize hash changes and initial scroll
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#verse-')) {
        const num = Number.parseInt(hash.replace('#verse-', ''), 10);
        if (!Number.isNaN(num)) {
          setSelectedVerse(num);
          setIsRangeMode(false);
          document.getElementById(`verse-${num}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    window.addEventListener('hashchange', onHashChange);

    if (selectedVerse) {
      const timer = setTimeout(() => {
        document.getElementById(`verse-${selectedVerse}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('hashchange', onHashChange);
      };
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, [selectedVerse]);

  const handleSelectVerse = (vNum: number) => {
    if (isRangeMode) {
      if (vNum < rangeStart) {
        setRangeStart(vNum);
      } else {
        setRangeEnd(vNum);
      }
    } else {
      setSelectedVerse(vNum);
      setRangeStart(vNum);
      setRangeEnd(vNum);
      scrollToVerse(vNum);
      // Update hash without triggering navigation
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#verse-${vNum}`);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedVerse(null);
    setIsRangeMode(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hash = '';
      url.searchParams.delete('verse');
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

  // Copy helper
  const handleCopy = async (type: 'all' | 'range' | 'selected') => {
    setIsCopying(true);
    let versesToCopy: Verse[] = [];
    let titleHeader = '';

    if (type === 'all') {
      versesToCopy = data.verses;
      titleHeader = `${data.bookName} ${data.chapterNumber} (${data.translation})`;
    } else if (type === 'range' || isRangeMode) {
      const start = Math.min(rangeStart, rangeEnd);
      const end = Math.max(rangeStart, rangeEnd);
      versesToCopy = data.verses.filter((v) => v.verse >= start && v.verse <= end);
      titleHeader = `${data.bookName} ${data.chapterNumber}:${start}-${end} (${data.translation})`;
    } else if (selectedVerse !== null) {
      versesToCopy = data.verses.filter((v) => v.verse === selectedVerse);
      titleHeader = `${data.bookName} ${data.chapterNumber}:${selectedVerse} (${data.translation})`;
    } else {
      versesToCopy = data.verses;
      titleHeader = `${data.bookName} ${data.chapterNumber} (${data.translation})`;
    }

    const formattedText = [
      titleHeader,
      '',
      ...versesToCopy.map((v) => `${v.verse} ${v.text}`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopyFeedback(`Copied ${versesToCopy.length} verse${versesToCopy.length === 1 ? '' : 's'} to clipboard!`);
    } catch {
      setCopyFeedback('Failed to copy to clipboard.');
    } finally {
      setIsCopying(false);
      setTimeout(() => setCopyFeedback(null), 3500);
    }
  };

  const cycleFontSize = (direction: 'up' | 'down') => {
    let nextSize: FontSizeLevel = 'huge';
    if (direction === 'up') {
      if (fontSize === 'normal') nextSize = 'huge';
      else if (fontSize === 'huge') nextSize = 'colossal';
      else nextSize = 'colossal';
    } else {
      if (fontSize === 'colossal') nextSize = 'huge';
      else if (fontSize === 'huge') nextSize = 'normal';
      else nextSize = 'normal';
    }
    setFontSize(nextSize);
    setClientFontSize(nextSize);
  };

  // Determine if a verse is highlighted
  const isVerseHighlighted = (vNum: number) => {
    if (isRangeMode) {
      const start = Math.min(rangeStart, rangeEnd);
      const end = Math.max(rangeStart, rangeEnd);
      return vNum >= start && vNum <= end;
    }
    return selectedVerse === vNum;
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* COPY TOAST FEEDBACK NOTIFICATION */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-950/95 border border-emerald-500/80 text-emerald-200 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-medium">
            <span className="text-emerald-400 text-base">✓</span>
            <span>{copyFeedback}</span>
          </div>
        </div>
      )}

      {/* TOP CONTROLS SUITE: ACTIVE VERSE STATUS, QUICK JUMP CHIPS & TOOLBAR */}
      <div className="sticky top-[61px] z-30 mb-10 backdrop-blur-2xl bg-[#060814]/90 border-y border-slate-800/80 py-3.5 px-4 -mx-4 sm:mx-0 sm:rounded-3xl shadow-xl transition-all">
        <div className="flex flex-col gap-3">
          {/* Row 1: Active Verse Indicator & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Active Verse Indicator */}
            <div className="flex items-center gap-2">
              {selectedVerse !== null || isRangeMode ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/60 text-amber-300 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>
                      {isRangeMode
                        ? `Focus: Verses ${Math.min(rangeStart, rangeEnd)} – ${Math.max(rangeStart, rangeEnd)}`
                        : `Focus: Verse ${selectedVerse}`}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToVerse(selectedVerse || rangeStart)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors"
                    title="Scroll down to this verse"
                  >
                    Scroll To ↓
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2 py-1 rounded-full bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 text-[11px] transition-colors"
                    title="Clear selection and view whole chapter"
                  >
                    Clear ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-sky-400 font-bold">📖</span>
                  <span>
                    Viewing full chapter ({data.verses.length} verses)
                  </span>
                </div>
              )}
            </div>

            {/* Right side: Copy Controls & Font Size Adjuster */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy Menu / Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
                {/* Copy Entire Chapter */}
                <button
                  type="button"
                  onClick={() => handleCopy('all')}
                  disabled={isCopying}
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy the entire chapter with verse numbers and book info"
                >
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  <span>Copy Chapter</span>
                </button>

                {/* Range Mode Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsRangeMode(!isRangeMode);
                    if (!isRangeMode && selectedVerse) {
                      setRangeStart(selectedVerse);
                      setRangeEnd(Math.min(selectedVerse + 4, data.verses.length));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isRangeMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle custom verse range selection (e.g. 1-12)"
                >
                  Range (1–12)
                </button>

                {/* Copy Selected/Range Button */}
                {(selectedVerse !== null || isRangeMode) && (
                  <button
                    type="button"
                    onClick={() => handleCopy('range')}
                    disabled={isCopying}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {isRangeMode
                        ? `Copy ${Math.min(rangeStart, rangeEnd)}–${Math.max(rangeStart, rangeEnd)}`
                        : `Copy Verse ${selectedVerse}`}
                    </span>
                  </button>
                )}
              </div>

              {/* Font Size Adjuster (A- / A+) */}
              <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => cycleFontSize('down')}
                  className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-serif font-bold transition-colors cursor-pointer"
                  title="Decrease font size"
                >
                  A-
                </button>
                <span className="text-[10px] font-sans text-slate-500 uppercase px-1 select-none font-semibold">
                  {fontSize === 'normal' ? 'Med' : fontSize === 'huge' ? 'Huge' : 'Max'}
                </span>
                <button
                  type="button"
                  onClick={() => cycleFontSize('up')}
                  className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-serif font-bold transition-colors cursor-pointer"
                  title="Increase font size (Make text bigger)"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Range Inputs Bar when Range Mode is Active */}
          {isRangeMode && (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Select Verse Range:
              </span>
              <div className="flex items-center gap-2">
                <label className="text-slate-500 text-[11px]">From:</label>
                <select
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {data.verses.map((v) => (
                    <option key={v.verse} value={v.verse}>
                      Verse {v.verse}
                    </option>
                  ))}
                </select>

                <label className="text-slate-500 text-[11px]">To:</label>
                <select
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {data.verses.map((v) => (
                    <option key={v.verse} value={v.verse}>
                      Verse {v.verse}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setRangeStart(1);
                    setRangeEnd(Math.min(5, data.verses.length));
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                >
                  1–5
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRangeStart(1);
                    setRangeEnd(Math.min(12, data.verses.length));
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                >
                  1–12
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRangeStart(1);
                    setRangeEnd(data.verses.length);
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                >
                  All (1–{data.verses.length})
                </button>
              </div>
            </div>
          )}

          {/* Quick Jump Verses Chips Carousel */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[11px] font-sans text-slate-400 uppercase font-semibold shrink-0 mr-2 select-none">
                Jump to Verse:
              </span>
              {data.verses.map((v) => {
                const highlighted = isVerseHighlighted(v.verse);
                return (
                  <button
                    key={v.verse}
                    type="button"
                    onClick={() => handleSelectVerse(v.verse)}
                    className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-semibold text-center transition-all shrink-0 cursor-pointer ${
                      highlighted
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                    title={`Jump to Verse ${v.verse}`}
                  >
                    {v.verse}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VERSES LIST */}
      <div className="space-y-6">
        {data.verses.map((verse) => {
          const highlighted = isVerseHighlighted(verse.verse);
          return (
            <div
              key={verse.verse}
              id={`verse-${verse.verse}`}
              className="scroll-mt-36"
            >
              <VerseCard
                verseData={verse}
                book={data.bookSlug}
                chapter={data.chapterNumber}
                lang={data.language}
                dir={data.dir}
                isHighlighted={highlighted}
                fontSize={fontSize}
                onSelect={() => handleSelectVerse(verse.verse)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
