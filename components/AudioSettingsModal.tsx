'use client';

import { useState, useEffect } from 'react';
import {
  AudioSettings,
  VoiceGender,
  getStoredAudioSettings,
  saveAudioSettings,
  getAvailableVoicesForLang,
  detectVoiceGender,
  speakText,
  stopAudio,
  isAudioSpeaking,
  LANGUAGE_LOCALES,
} from '@/lib/audio';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
}

const SAMPLE_TEXTS: Record<string, string> = {
  hebrew: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ.',
  english: 'The Lord is my shepherd; I shall not want.',
  'english-bsb': 'The Lord is my shepherd; I shall not want.',
  'english-ylt': 'Jehovah is my shepherd, I do not lack.',
  malayalam: 'ആദിയിൽ ദൈവം ആകാശവും ഭൂമിയും സൃഷ്ടിച്ചു.',
  greek: 'Ἐν ἀρχῇ ἦν ὁ Λόγος, καὶ ὁ Λόγος ἦν πρὸς τὸν Θεόν.',
  aramaic: 'ܒܪܫܝܬ ܐܝܬܘܗܝ ܗܘܐ ܡܠܬܐ',
  latin: 'In principio creavit Deus caelum et terram.',
  german: 'Im Anfang schuf Gott die Himmel und die Erde.',
  french: 'Au commencement, Dieu créa les cieux et la terre.',
  spanish: 'En el principio creó Dios los cielos y la tierra.',
  russian: 'В начале сотворил Бог небо и землю.',
  chinese: '起初，神创造天地。',
  burmese: 'အစအဦး၌ ဘုရားသခင်သည် ကောင်းကင်နှင့် မြေကြီးကို ဖန်ဆင်းတော်မူ၏။',
  slavic: 'Въ нача́лѣ сотвори́ Бо́гъ не́бо и зе́млю.',
};

export default function AudioSettingsModal({
  isOpen,
  onClose,
  currentLang,
}: AudioSettingsModalProps) {
  const [settings, setSettings] = useState<AudioSettings>(() => getStoredAudioSettings());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);

  // Load voices when open or voices change
  useEffect(() => {
    if (!isOpen) return;

    const loadVoices = () => {
      const voices = getAvailableVoicesForLang(currentLang);
      setAvailableVoices(voices);
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isOpen, currentLang]);

  // Keep settings updated if changed elsewhere
  useEffect(() => {
    const handleSync = () => {
      setSettings(getStoredAudioSettings());
    };
    window.addEventListener('bible_audio_settings_updated', handleSync);
    return () => window.removeEventListener('bible_audio_settings_updated', handleSync);
  }, []);

  // Stop test audio on unmount or close
  useEffect(() => {
    return () => {
      if (isPlayingTest) {
        stopAudio();
      }
    };
  }, [isPlayingTest]);

  if (!isOpen) return null;

  const handleGenderChange = (gender: VoiceGender) => {
    const updated = saveAudioSettings({ gender, preferredVoiceName: null });
    setSettings(updated);
  };

  const handleVoiceSelect = (voiceName: string) => {
    const name = voiceName === '__auto__' ? null : voiceName;
    const updated = saveAudioSettings({ preferredVoiceName: name });
    setSettings(updated);
  };

  const handleRateChange = (rate: number) => {
    const updated = saveAudioSettings({ rate });
    setSettings(updated);
  };

  const handlePlayTest = () => {
    if (isPlayingTest || isAudioSpeaking()) {
      stopAudio();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      const text = SAMPLE_TEXTS[currentLang] || SAMPLE_TEXTS.english;
      speakText(text, currentLang, {
        rate: settings.rate,
        gender: settings.gender,
        voiceName: settings.preferredVoiceName,
        onStart: () => setIsPlayingTest(true),
        onEnd: () => setIsPlayingTest(false),
        onError: () => setIsPlayingTest(false),
      });
    }
  };

  const langLabel = LANGUAGE_LOCALES[currentLang]?.label || currentLang;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#090d1f] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-7 text-white flex flex-col gap-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audio &amp; Voice Settings</h3>
              <p className="text-xs text-slate-400">
                Preferences saved in your browser for <span className="text-amber-300 font-medium">{langLabel}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-sm cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Voice Gender */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Voice Gender Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleGenderChange('auto')}
              className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                settings.gender === 'auto'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              ✨ Auto
            </button>
            <button
              type="button"
              onClick={() => handleGenderChange('female')}
              className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                settings.gender === 'female'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-md shadow-pink-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span>♀</span>
              <span>Female</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenderChange('male')}
              className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                settings.gender === 'male'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span>♂</span>
              <span>Male</span>
            </button>
          </div>
        </div>

        {/* Section 2: Specific Voice Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Browser Voice
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {availableVoices.length} detected
            </span>
          </div>

          {availableVoices.length > 0 ? (
            <select
              value={settings.preferredVoiceName || '__auto__'}
              onChange={(e) => handleVoiceSelect(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="__auto__">
                ✨ Default Natural Voice ({settings.gender === 'auto' ? 'Auto Gender' : settings.gender})
              </option>
              {availableVoices.map((v) => {
                const detectedGender = detectVoiceGender(v);
                const genderTag = detectedGender !== 'unknown' ? ` • ${detectedGender}` : '';
                return (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang}){genderTag}
                  </option>
                );
              })}
            </select>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Using high-compatibility speech synthesis engine for <span className="text-white font-medium">{langLabel}</span>.
            </div>
          )}
        </div>

        {/* Section 3: Reading Speed / Pace */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Reading Speed
            </label>
            <span className="text-xs font-mono text-amber-400 font-bold">
              {settings.rate}x
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { rate: 0.8, label: '0.8x Slow' },
              { rate: 0.92, label: '0.9x Reverent' },
              { rate: 1.0, label: '1.0x Normal' },
              { rate: 1.15, label: '1.15x Brisk' },
            ].map((option) => (
              <button
                key={option.rate}
                type="button"
                onClick={() => handleRateChange(option.rate)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all cursor-pointer border text-center ${
                  Math.abs(settings.rate - option.rate) < 0.03
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-xs'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Voice Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePlayTest}
            className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              isPlayingTest
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/80 shadow-md shadow-amber-500/10'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500 shadow-md shadow-blue-600/20'
            }`}
          >
            {isPlayingTest ? (
              <>
                <span className="flex items-end gap-0.5 h-3 px-0.5">
                  <span className="w-0.5 h-full bg-amber-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-2 bg-amber-300 animate-bounce rounded-full delay-75" />
                  <span className="w-0.5 h-3 bg-amber-400 animate-pulse rounded-full delay-150" />
                </span>
                <span>Stop Sample Preview</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Preview Voice &amp; Pitch</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
