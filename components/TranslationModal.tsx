'use client';

import { useEffect, useState } from 'react';
import { ComparativeVerse, WordBreakdown } from '@/lib/bible';

interface VerseDetails {
  book: string;
  bookName: string;
  nativeName?: string;
  chapter: number;
  verse: number;
  primaryText: string;
  language: string;
  comparisons: ComparativeVerse[];
  hebrewText?: string;
  greekText?: string;
  englishText?: string;
  aramaicText?: string;
  transliteration?: string;
  englishLiteral?: string;
  kjv?: string;
  breakdown: WordBreakdown[];
  manuscriptNotes: string;
  codexSource: string;
}

interface TranslationModalProps {
  verseId: number | string;
  book?: string;
  chapter?: number | string;
  lang?: string;
  initialText?: string;
  onClose: () => void;
}

export default function TranslationModal({
  verseId,
  book = 'genesis',
  chapter = '1',
  lang = 'english',
  initialText = '',
  onClose,
}: TranslationModalProps) {
  const [data, setData] = useState<VerseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `/api/verse-details?book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(
            chapter
          )}&verse=${encodeURIComponent(verseId)}&lang=${encodeURIComponent(lang)}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load translation details (${res.status})`);
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error loading translation history');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [verseId, book, chapter, lang, onClose]);

  const copyText = async (text: string, id: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const isRtl = lang === 'hebrew' || lang === 'aramaic';

  const isEnglishLang = (id: string) => id === 'english' || id === 'english-bsb' || id === 'english-ylt';

  // Rule: Except for its own language, omit its own translation below
  const displayedComparisons = (data?.comparisons || []).filter((comp) => {
    if (isEnglishLang(lang) && comp.langId === 'english') {
      return false; // omit English if active language is English
    }
    if (lang === 'hebrew' && comp.langId === 'hebrew') {
      return false; // omit Hebrew if active language is Hebrew
    }
    if (lang === 'aramaic' && comp.langId === 'aramaic') {
      return false; // omit Aramaic if active language is Aramaic
    }
    if (lang === 'greek' && comp.langId === 'greek') {
      return false; // omit Greek if active language is Greek
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl bg-[#090D1A] text-white p-5 sm:p-8 shadow-2xl border border-slate-800 font-sans"
      >
        {/* Header - Matching Screenshot */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-amber-400 bg-amber-950/50 border border-amber-800/60 px-3 py-0.5 rounded-full">
                TRANSLATION HISTORY &amp; LEXICON
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                {book.toUpperCase()} {chapter}:{verseId}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial-serif font-light text-white flex items-baseline gap-2">
              <span>{data ? `${data.bookName} ${data.chapter}:${data.verse}` : `${book} ${chapter}:${verseId}`}</span>
              {data?.nativeName && data.nativeName !== data.bookName && (
                <span className="text-lg sm:text-xl text-slate-400 font-normal">
                  ({data.nativeName})
                </span>
              )}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 space-y-4">
            <div className="h-16 rounded-2xl skeleton-waving w-full mx-auto"></div>
            <div className="h-28 rounded-2xl skeleton-waving w-full mx-auto"></div>
            <div className="h-28 rounded-2xl skeleton-waving w-full mx-auto"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-400 bg-red-950/30 p-4 rounded-xl border border-red-900/50">
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Primary Text Card - Active Selected Language */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700/80">
                    Selected Language ({lang})
                  </span>
                  {data?.nativeName && (
                    <span className="text-xs text-slate-400">
                      {data.nativeName}
                    </span>
                  )}
                </div>

                {/* Primary Card Copy Button */}
                <button
                  type="button"
                  onClick={() => copyText(data?.primaryText || initialText, 'primary')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs border ${
                    copiedId === 'primary'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700/80'
                  }`}
                >
                  {copiedId === 'primary' ? (
                    <>
                      <span className="text-emerald-400">✓</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <p
                dir={isRtl ? 'rtl' : 'ltr'}
                className={`text-2xl sm:text-3xl lg:text-[2.2rem] leading-[2.2] text-white font-normal ${
                  lang === 'hebrew'
                    ? 'font-hebrew text-right'
                    : lang === 'aramaic'
                    ? 'font-aramaic text-right'
                    : lang === 'greek'
                    ? 'font-greek'
                    : lang === 'malayalam'
                    ? 'font-malayalam'
                    : lang === 'chinese'
                    ? 'font-chinese'
                    : lang === 'burmese'
                    ? 'font-burmese'
                    : lang === 'slavic'
                    ? 'font-slavic'
                    : 'font-editorial-serif'
                }`}
              >
                {data?.primaryText || initialText}
              </p>

              {data?.transliteration && (
                <p className="mt-4 pt-3 border-t border-slate-800/60 text-sm italic text-amber-300/80 tracking-wide font-sans">
                  {data.transliteration}
                </p>
              )}
            </div>

            {/* Comparative Translations Section in Different Colors */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                  Cross-Verification Translations (Comparative Codices)
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Different Color Themes • Individually Copyable
                </span>
              </div>

              <div className="space-y-4">
                {displayedComparisons.map((comp) => {
                  const isCompRtl = comp.dir === 'rtl';
                  const isThisCopied = copiedId === comp.langId;

                  return (
                    <div
                      key={comp.langId}
                      className={`p-5 sm:p-6 rounded-3xl border transition-all shadow-md ${comp.theme.bg} ${comp.theme.border}`}
                    >
                      {/* Comparison Header */}
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${comp.theme.badgeBg} ${comp.theme.badgeText}`}>
                            {comp.badge}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">
                            {comp.name}
                          </span>
                        </div>

                        {/* Copy Button for This Language */}
                        {comp.available && comp.text && (
                          <button
                            type="button"
                            onClick={() => copyText(comp.text, comp.langId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs border ${
                              isThisCopied
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : `${comp.theme.copyBg} ${comp.theme.copyHover}`
                            }`}
                          >
                            {isThisCopied ? (
                              <>
                                <span className="text-emerald-400">✓</span>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy {comp.name.split(' ')[0]}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Verse Text or Unavailable Canon Note */}
                      {comp.available && comp.text ? (
                        <p
                          dir={isCompRtl ? 'rtl' : 'ltr'}
                          className={`text-xl sm:text-2xl leading-[2.2] font-normal ${comp.theme.textColor} ${comp.fontClass} ${
                            isCompRtl ? 'text-right' : 'text-left'
                          }`}
                        >
                          {comp.text}
                        </p>
                      ) : (
                        <div className="py-2 text-xs text-slate-400 italic flex items-center gap-2">
                          <span className="text-slate-500">ℹ️</span>
                          <span>{comp.unavailableReason || 'Text not available in this historical codex.'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Word-by-Word Lexical Analysis */}
            {data?.breakdown && data.breakdown.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">
                  Lexical Breakdown &amp; Morphology
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {data.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-colors"
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span
                          dir="rtl"
                          className="text-lg font-medium text-white font-hebrew"
                        >
                          {item.hebrew}
                        </span>
                        <span className="text-xs font-mono text-amber-400 font-medium">
                          {item.transliteration}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 font-medium">{item.meaning}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.grammar}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Codex Manuscript Notes */}
            {data?.manuscriptNotes && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1.5 leading-relaxed">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="text-amber-400">📜</span>
                  Codex Manuscript Information
                </div>
                <p>{data.manuscriptNotes}</p>
                <p className="text-[11px] opacity-75 italic text-slate-400">{data.codexSource}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">ESC</kbd> to close
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
