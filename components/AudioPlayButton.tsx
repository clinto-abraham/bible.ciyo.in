'use client';

import { useState } from 'react';
import { speakText, stopAudio, isAudioSupported } from '@/lib/audio';
import AudioSettingsModal from './AudioSettingsModal';

interface AudioPlayButtonProps {
  text: string;
  lang: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSettings?: boolean;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

export default function AudioPlayButton({
  text,
  lang,
  label,
  size = 'md',
  className = '',
  showSettings = false,
  onAudioStart,
  onAudioEnd,
}: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported] = useState<boolean>(() => isAudioSupported());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supported) return;

    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      onAudioEnd?.();
    } else {
      setIsPlaying(true);
      onAudioStart?.();
      speakText(text, lang, {
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          onAudioEnd?.();
        },
        onError: () => {
          setIsPlaying(false);
          onAudioEnd?.();
        },
      });
    }
  };

  if (!supported) return null;

  const sizeClasses = {
    sm: 'p-1.5 text-xs rounded-lg',
    md: 'px-2.5 py-1.5 text-xs rounded-xl',
    lg: 'px-4 py-2 text-sm rounded-2xl',
  }[size];

  return (
    <>
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 font-medium transition-all cursor-pointer shadow-xs border ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/70 shadow-amber-500/10'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/80'
          } ${sizeClasses}`}
          title={isPlaying ? 'Stop reading' : `Listen to ${label || 'text'} in ${lang}`}
          aria-label={isPlaying ? 'Stop audio reading' : `Listen to audio in ${lang}`}
        >
          {isPlaying ? (
            <>
              {/* Animated sound wave bars */}
              <span className="flex items-end gap-0.5 h-3 px-0.5">
                <span className="w-0.5 h-full bg-amber-400 animate-pulse rounded-full" />
                <span className="w-0.5 h-2 bg-amber-300 animate-bounce rounded-full delay-75" />
                <span className="w-0.5 h-3 bg-amber-400 animate-pulse rounded-full delay-150" />
              </span>
              <span className="text-[11px] font-semibold text-amber-300">
                {label ? `Stop ${label}` : 'Stop'}
              </span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              {label && <span className="text-[11px] font-semibold">{label}</span>}
            </>
          )}
        </button>

        {showSettings && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
            }}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
            title="Audio voice & gender settings"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        )}
      </div>

      {showSettings && (
        <AudioSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentLang={lang}
        />
      )}
    </>
  );
}
