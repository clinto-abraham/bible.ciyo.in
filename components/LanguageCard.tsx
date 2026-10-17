'use client';

import Link from 'next/link';
import { setClientPreferredLanguage } from '@/lib/preferences';
import { LanguageMeta } from '@/lib/bible';

interface LanguageCardProps {
  language: LanguageMeta;
  isSelected: boolean;
}

export default function LanguageCard({ language, isSelected }: LanguageCardProps) {
  return (
    <Link
      href={`/?lang=${language.id}`}
      onClick={() => setClientPreferredLanguage(language.id)}
      className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-b from-blue-950/40 to-slate-900/90 border-sky-500/60 shadow-lg shadow-sky-500/10'
          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl select-none">{language.flag}</span>
          {isSelected && (
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              ACTIVE
            </span>
          )}
        </div>
        <div className="text-base font-semibold text-white mb-0.5">
          {language.name}
        </div>
        <div className="text-xs text-slate-400 font-sans">
          {language.nativeName}
        </div>
      </div>
      <div className="text-[11px] text-amber-400 font-medium font-sans mt-3 pt-2 border-t border-slate-800/60">
        {language.booksCount} Books
      </div>
    </Link>
  );
}
