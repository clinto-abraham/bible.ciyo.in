'use client';

import { useState, useEffect } from 'react';
import TranslationModal from './TranslationModal';
import AudioPlayButton from './AudioPlayButton';
import AudioSettingsModal from './AudioSettingsModal';
import { FontSizeLevel } from '@/lib/preferences';

interface VerseData {
  verse: number | string;
  text: string;
}

interface VerseCardProps {
  verseData: VerseData;
  book?: string;
  chapter?: number | string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  isHighlighted?: boolean;
  fontSize?: FontSizeLevel;
  onSelect?: () => void;
}

export default function VerseCard({
  verseData,
  book = 'genesis',
  chapter = 1,
  lang = 'english',
  dir = 'ltr',
  isHighlighted = false,
  fontSize = 'huge',
  onSelect,
}: VerseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  const verseId = `${book}-${chapter}-${verseData.verse}`;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('bible_bookmarks');
      if (!raw) return false;
      const list = JSON.parse(raw);
      return Array.isArray(list) && list.some((b: { id: string }) => b.id === verseId);
    } catch {
      return false;
    }
  });

  // Keep bookmark state in sync across browser tabs & interactions
  useEffect(() => {
    const checkBookmark = () => {
      try {
        const raw = localStorage.getItem('bible_bookmarks');
        if (!raw) {
          setIsBookmarked(false);
          return;
        }
        const list = JSON.parse(raw);
        setIsBookmarked(Array.isArray(list) && list.some((b: { id: string }) => b.id === verseId));
      } catch {
        setIsBookmarked(false);
      }
    };

    window.addEventListener('storage', checkBookmark);
    window.addEventListener('bible_bookmarks_updated', checkBookmark);
    return () => {
      window.removeEventListener('storage', checkBookmark);
      window.removeEventListener('bible_bookmarks_updated', checkBookmark);
    };
  }, [verseId]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem('bible_bookmarks');
      const list = raw ? JSON.parse(raw) : [];
      const existingIdx = list.findIndex((b: { id: string }) => b.id === verseId);

      if (existingIdx !== -1) {
        list.splice(existingIdx, 1);
        setIsBookmarked(false);
      } else {
        list.push({
          id: verseId,
          bookSlug: book,
          bookName: book.charAt(0).toUpperCase() + book.slice(1),
          chapterNumber: Number(chapter),
          verseNumber: Number(verseData.verse),
          lang,
          textSnippet: verseData.text.slice(0, 80),
          createdAt: Date.now(),
          index: list.length + 1,
        });
        setIsBookmarked(true);
      }

      localStorage.setItem('bible_bookmarks', JSON.stringify(list));
      window.dispatchEvent(new Event('bible_bookmarks_updated'));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const isRtl = dir === 'rtl' || lang === 'hebrew' || lang === 'aramaic';

  // Responsive large/huge typography sizing tailored to script
  const getScriptClass = () => {
    switch (lang) {
      case 'hebrew':
        if (fontSize === 'colossal') {
          return 'font-hebrew text-4xl sm:text-5xl lg:text-[3.3rem] leading-[2.8] tracking-wide text-right';
        }
        if (fontSize === 'normal') {
          return 'font-hebrew text-2xl sm:text-3xl leading-[2.4] tracking-wide text-right';
        }
        return 'font-hebrew text-3xl sm:text-4xl lg:text-[2.65rem] leading-[2.6] tracking-wide text-right';

      case 'aramaic':
        if (fontSize === 'colossal') {
          return 'font-aramaic text-4xl sm:text-5xl lg:text-[3.3rem] leading-[2.8] tracking-wide text-right';
        }
        if (fontSize === 'normal') {
          return 'font-aramaic text-2xl sm:text-3xl leading-[2.4] tracking-wide text-right';
        }
        return 'font-aramaic text-3xl sm:text-4xl lg:text-[2.65rem] leading-[2.6] tracking-wide text-right';

      case 'greek':
        if (fontSize === 'colossal') {
          return 'font-greek text-3xl sm:text-4xl lg:text-5xl leading-relaxed tracking-normal';
        }
        if (fontSize === 'normal') {
          return 'font-greek text-xl sm:text-2xl leading-relaxed tracking-normal';
        }
        return 'font-greek text-2xl sm:text-3xl lg:text-4xl leading-relaxed tracking-normal';

      case 'malayalam':
        if (fontSize === 'colossal') {
          return 'font-malayalam text-2xl sm:text-3xl lg:text-4xl leading-[2.3]';
        }
        if (fontSize === 'normal') {
          return 'font-malayalam text-lg sm:text-xl leading-[2.0]';
        }
        return 'font-malayalam text-xl sm:text-2xl lg:text-3xl leading-[2.2]';

      case 'chinese':
        if (fontSize === 'colossal') {
          return 'font-chinese text-2xl sm:text-3xl lg:text-4xl leading-[2.2]';
        }
        if (fontSize === 'normal') {
          return 'font-chinese text-lg sm:text-xl leading-relaxed';
        }
        return 'font-chinese text-xl sm:text-2xl lg:text-3xl leading-relaxed';

      case 'burmese':
        if (fontSize === 'colossal') {
          return 'font-burmese text-2xl sm:text-3xl lg:text-4xl leading-[2.4]';
        }
        if (fontSize === 'normal') {
          return 'font-burmese text-lg sm:text-xl leading-[2.1]';
        }
        return 'font-burmese text-xl sm:text-2xl lg:text-3xl leading-[2.2]';

      case 'slavic':
        if (fontSize === 'colossal') {
          return 'font-slavic text-3xl sm:text-4xl lg:text-5xl leading-relaxed';
        }
        if (fontSize === 'normal') {
          return 'font-slavic text-xl sm:text-2xl leading-relaxed';
        }
        return 'font-slavic text-2xl sm:text-3xl lg:text-4xl leading-relaxed';

      default:
        // English, Latin, German, French, Spanish, Russian
        if (fontSize === 'colossal') {
          return 'font-editorial-serif text-3xl sm:text-4xl lg:text-5xl leading-relaxed';
        }
        if (fontSize === 'normal') {
          return 'font-editorial-serif text-xl sm:text-2xl leading-relaxed';
        }
        return 'font-editorial-serif text-2xl sm:text-3xl lg:text-4xl leading-relaxed';
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleCopySingle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const formatted = `${verseData.verse} ${verseData.text}`;
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`group relative flex items-baseline gap-3 sm:gap-6 cursor-pointer p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl transition-all duration-300 border ${
          isHighlighted
            ? 'border-amber-400/90 ring-2 ring-amber-400/40 bg-gradient-to-r from-amber-950/40 via-slate-900/95 to-amber-950/30 shadow-2xl shadow-amber-500/20 scale-[1.01]'
            : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-sky-500/50 shadow-xs hover:shadow-lg hover:shadow-sky-500/5'
        } ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Leading Accent Line for Highlighted Verse */}
        {isHighlighted && (
          <div
            className={`absolute top-3 bottom-3 w-1.5 rounded-full bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 shadow-sm shadow-amber-400 ${
              isRtl ? 'right-2' : 'left-2'
            }`}
          />
        )}

        {/* Verse Number & Status Badges */}
        <div className={`flex flex-col gap-1 shrink-0 ${isRtl ? 'items-end' : 'items-start'}`}>
          <span
            className={`text-sm sm:text-base font-mono font-bold px-2.5 py-1 rounded-xl transition-all select-none shadow-xs ${
              isHighlighted
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                : 'bg-slate-800/90 text-sky-400 border border-slate-700/80 group-hover:border-amber-500/60 group-hover:text-amber-300'
            }`}
          >
            {verseData.verse}
          </span>

          {isHighlighted && (
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50 select-none">
              ★ FOCUS
            </span>
          )}

          {isBookmarked && (
            <span className="text-[10px] font-sans font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50 select-none">
              BOOKMARK
            </span>
          )}
        </div>

        {/* Verse Script Text - Rendered Huge & Clear (Takes full horizontal width) */}
        <p
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`flex-1 transition-colors ${
            isHighlighted
              ? 'text-amber-50 font-medium drop-shadow-sm'
              : 'text-slate-100 group-hover:text-white'
          } ${getScriptClass()}`}
        >
          {verseData.text}
        </p>

        {/* ACTION BUTTONS: VERTICALLY ALIGNED IN A COMPACT COLUMN TO MAXIMIZE VERSE READING WIDTH */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1.5 opacity-90 sm:opacity-80 group-hover:opacity-100 shrink-0 self-start sm:self-center"
        >
          {/* 1. Bookmark Button (Inside Paper Grid, directly nearby Copy) */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              isBookmarked
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/40 ring-2 ring-emerald-400/40 scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700/80'
            }`}
            title={isBookmarked ? 'Bookmarked! Click to remove bookmark' : 'Bookmark this verse'}
          >
            <svg
              className="w-4 h-4"
              fill={isBookmarked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isBookmarked ? 1.5 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          {/* 2. Quick Copy Verse Button */}
          <button
            type="button"
            onClick={handleCopySingle}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
              copied
                ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/80'
            }`}
            title="Copy this verse"
          >
            {copied ? (
              <span className="text-xs font-semibold text-emerald-400">✓</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>

          {/* 3. Audio Listen Button */}
          <AudioPlayButton
            text={verseData.text}
            lang={lang}
            size="sm"
            className="w-8 h-8 p-0 justify-center rounded-xl"
          />

          {/* 4. Audio Voice & Gender Settings Button */}
          <button
            type="button"
            onClick={() => setIsVoiceSettingsOpen(true)}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700/80 flex items-center justify-center transition-colors cursor-pointer"
            title="Voice & Gender Settings (Male/Female, Speed, Browser Voices)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>

          {/* 5. Lexicon / Details Trigger Icon */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700/80 flex items-center justify-center transition-colors cursor-pointer"
            title="Inspect Hebrew/Greek lexicon, transliteration, and codices"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Translation & Etymology Modal */}
      {isOpen && (
        <TranslationModal
          key={`${book}-${chapter}-${verseData.verse}-${lang}`}
          verseId={verseData.verse}
          book={book}
          chapter={chapter}
          lang={lang}
          initialText={verseData.text}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Audio Voice & Gender Settings Modal */}
      {isVoiceSettingsOpen && (
        <AudioSettingsModal
          isOpen={isVoiceSettingsOpen}
          onClose={() => setIsVoiceSettingsOpen(false)}
          currentLang={lang}
        />
      )}
    </>
  );
}
