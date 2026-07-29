import React from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types/i18n';
import { getTranslation, formatLocaleDate, formatLocaleCurrency, formatLocaleNumber } from '../localization';
import { Settings, X, Globe, Headphones, Type, Check, Sparkles } from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  voiceLang: LanguageCode;
  setVoiceLang: (code: LanguageCode) => void;
  subLang: LanguageCode;
  setSubLang: (code: LanguageCode) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
  voiceLang,
  setVoiceLang,
  subLang,
  setSubLang,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(currentLang);
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const now = new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div
        className="w-full max-w-3xl bg-[#0F1116] border border-[#2D303E] p-6 md:p-8 shadow-2xl text-[#E4E4E7] flex flex-col max-h-[90vh]"
        dir={langInfo.dir}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D303E] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1A1C23] border border-[#00F0FF] text-[#00F0FF]">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white">{t.navSettings}</h2>
              <p className="text-xs text-[#64748B] font-mono">{t.changeLanguageAnytime}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-[#64748B] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto pr-1 custom-scrollbar">
          {/* UI Language Selection */}
          <div>
            <h3 className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00F0FF]" />
              <span>{t.currentLanguage}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      audioEngine.playUISound('click');
                    }}
                    className={`p-3 border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-[#E4E4E7] hover:border-[#64748B]'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono truncate">{lang.name}</p>
                      <p className="text-[10px] text-[#64748B] font-mono truncate">{lang.englishName}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#00F0FF] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice & Subtitle Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] space-y-2">
              <label className="text-xs text-[#64748B] uppercase tracking-wider flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#00F0FF]" />
                <span>{t.voiceOverLanguage}</span>
              </label>
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value as LanguageCode)}
                className="w-full px-3 py-2 bg-[#1A1C23] border border-[#2D303E] text-xs text-white outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] space-y-2">
              <label className="text-xs text-[#64748B] uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-[#00F0FF]" />
                <span>{t.subtitleLanguage}</span>
              </label>
              <select
                value={subLang}
                onChange={(e) => setSubLang(e.target.value as LanguageCode)}
                className="w-full px-3 py-2 bg-[#1A1C23] border border-[#2D303E] text-xs text-white outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Locale Formatting Showcase */}
          <div className="p-4 bg-[#0A0B0E] border border-[#2D303E]">
            <h4 className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em] mb-2">
              {t.formattingPreview} ({langInfo.name})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-[#1A1C23] border border-[#2D303E]">
                <span className="text-[#64748B] block text-[10px] uppercase font-mono mb-0.5">{t.sampleDate}:</span>
                <span className="font-mono text-[#00F0FF]">{formatLocaleDate(now, currentLang)}</span>
              </div>
              <div className="p-2.5 bg-[#1A1C23] border border-[#2D303E]">
                <span className="text-[#64748B] block text-[10px] uppercase font-mono mb-0.5">{t.sampleCurrency}:</span>
                <span className="font-mono text-emerald-400">{formatLocaleCurrency(1250, currentLang)}</span>
              </div>
              <div className="p-2.5 bg-[#1A1C23] border border-[#2D303E]">
                <span className="text-[#64748B] block text-[10px] uppercase font-mono mb-0.5">{t.sampleNumber}:</span>
                <span className="font-mono text-amber-300">{formatLocaleNumber(984500, currentLang)} GOLD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#2D303E] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0B0E] text-xs font-mono uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
