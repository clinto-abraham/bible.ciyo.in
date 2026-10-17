'use client';

import { useState } from 'react';
import TranslationModal from './TranslationModal';
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
  book,
  chapter,
  lang = 'english',
  dir = 'ltr',
  isHighlighted = false,
  fontSize = 'huge',
  onSelect,
}: VerseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
          return 'font-greek text-3xl sm:text-4xl lg:text-[2.6rem] leading-[2.5] tracking-normal text-left';
        }
        if (fontSize === 'normal') {
          return 'font-greek text-xl sm:text-2xl leading-[2.1] tracking-normal text-left';
        }
        return 'font-greek text-2xl sm:text-3xl lg:text-[2.1rem] leading-[2.3] tracking-normal text-left';

      case 'malayalam':
        if (fontSize === 'colossal') {
          return 'font-malayalam text-3xl sm:text-4xl lg:text-[2.6rem] leading-[2.5] tracking-wide text-left';
        }
        if (fontSize === 'normal') {
          return 'font-malayalam text-xl sm:text-2xl leading-[2.1] tracking-wide text-left';
        }
        return 'font-malayalam text-2xl sm:text-3xl lg:text-[2.1rem] leading-[2.3] tracking-wide text-left';

      case 'chinese':
        if (fontSize === 'colossal') {
          return 'font-chinese text-3xl sm:text-4xl lg:text-[2.6rem] leading-[2.5] tracking-wide text-left';
        }
        if (fontSize === 'normal') {
          return 'font-chinese text-xl sm:text-2xl leading-[2.1] tracking-wide text-left';
        }
        return 'font-chinese text-2xl sm:text-3xl lg:text-[2.1rem] leading-[2.3] tracking-wide text-left';

      case 'burmese':
        if (fontSize === 'colossal') {
          return 'font-burmese text-3xl sm:text-4xl lg:text-[2.6rem] leading-[2.6] tracking-wide text-left';
        }
        if (fontSize === 'normal') {
          return 'font-burmese text-xl sm:text-2xl leading-[2.2] tracking-wide text-left';
        }
        return 'font-burmese text-2xl sm:text-3xl lg:text-[2.1rem] leading-[2.4] tracking-wide text-left';

      case 'slavic':
        if (fontSize === 'colossal') {
          return 'font-slavic text-3xl sm:text-4xl lg:text-[2.6rem] leading-[2.5] tracking-normal text-left';
        }
        if (fontSize === 'normal') {
          return 'font-slavic text-xl sm:text-2xl leading-[2.1] tracking-normal text-left';
        }
        return 'font-slavic text-2xl sm:text-3xl lg:text-[2.1rem] leading-[2.3] tracking-normal text-left';

      default: // english, english-bsb, english-ylt, latin, german, french, spanish, russian
        if (fontSize === 'colossal') {
          return 'font-editorial-serif text-2xl sm:text-3xl lg:text-[2.35rem] leading-[2.4] tracking-normal text-left';
        }
        if (fontSize === 'normal') {
          return 'font-editorial-serif text-lg sm:text-xl leading-[2.0] tracking-normal text-left';
        }
        return 'font-editorial-serif text-xl sm:text-2xl lg:text-[1.85rem] leading-[2.2] tracking-normal text-left';
    }
  };

  const handleCopySingle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const header = book ? `${book} ${chapter}:${verseData.verse}` : `Verse ${verseData.verse}`;
      await navigator.clipboard.writeText(`${header}\n${verseData.text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleClick = () => {
    if (onSelect) onSelect();
    setIsOpen(true);
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
        className={`group relative flex items-baseline gap-4 sm:gap-6 cursor-pointer p-5 sm:p-7 rounded-3xl transition-all duration-300 border ${
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
        </div>

        {/* Verse Script Text - Rendered Huge & Clear */}
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

        {/* Action Buttons: Quick Copy & Lexicon Modal Indicator */}
        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 self-center shrink-0">
          {/* Quick Copy Verse Button */}
          <button
            type="button"
            onClick={handleCopySingle}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              copied
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80'
            }`}
            title="Copy this verse"
          >
            {copied ? (
              <span className="text-xs font-semibold px-1">✓ Copied</span>
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

          {/* Lexicon / Details Trigger Icon */}
          <span
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/80 transition-colors hidden sm:inline-flex"
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
          </span>
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
    </>
  );
}
