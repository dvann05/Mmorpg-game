import React, { useState } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types/i18n';
import { getTranslation, formatLocaleDate, formatLocaleCurrency, formatLocaleNumber } from '../localization';
import { Check, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onSelectLanguage: (code: LanguageCode) => void;
}

export const FirstLaunchModal: React.FC<Props> = ({ isOpen, onSelectLanguage }) => {
  const [selected, setSelected] = useState<LanguageCode>('en');

  if (!isOpen) return null;

  const selectedInfo = SUPPORTED_LANGUAGES.find((l) => l.code === selected) || SUPPORTED_LANGUAGES[0];
  const t = getTranslation(selected);
  const now = new Date();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-4xl bg-[#0F1116] border border-[#00F0FF]/50 p-6 md:p-8 shadow-2xl text-[#E4E4E7] flex flex-col max-h-[90vh]"
          dir={selectedInfo.dir}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#2D303E] pb-4 mb-6">
            <div className="p-3 bg-[#1A1C23] border border-[#00F0FF] text-[#00F0FF]">
              <Globe className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
                <span>{t.selectLanguageTitle}</span>
                <Sparkles className="w-5 h-5 text-[#00F0FF]" />
              </h2>
              <p className="text-xs text-[#64748B] font-mono">{t.selectLanguageDesc}</p>
            </div>
          </div>

          {/* Language Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto pr-1 mb-6 max-h-[45vh] custom-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelected(lang.code)}
                  className={`relative flex items-center gap-3 p-3.5 border text-left transition-all ${
                    isSelected
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-[#E4E4E7] hover:border-[#64748B]'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold truncate text-white uppercase">{lang.name}</p>
                    <p className="text-[10px] text-[#64748B] truncate font-mono">{lang.englishName}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-[#00F0FF] text-[#0A0B0E] font-bold flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {lang.dir === 'rtl' && (
                    <span className="absolute top-1 right-2 text-[9px] px-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                      RTL
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Live Formatting Preview */}
          <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] mb-6">
            <h4 className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em] mb-2">
              {t.formattingPreview} ({selectedInfo.name})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-[#1A1C23] border border-[#2D303E]">
                <span className="text-[#64748B] block text-[10px] uppercase font-mono mb-0.5">{t.sampleDate}:</span>
                <span className="font-mono text-[#00F0FF] font-medium">{formatLocaleDate(now, selected)}</span>
              </div>
              <div className="p-2.5 bg-[#1A1C23] border border-[#2D303E]">
                <span className="text-[#64748B] block text-[10px] uppercase font-mono mb-0.5">{t.sampleCurrency}:</span>
                <span className="font-mono text-emerald-400 font-medium">{formatLocaleCurrency(1250, selected)}</span>
              </div>
              <div className="p-2.5 bg-[#1A1C23] border border-[#2D303E]">
                <span className="text-[#64748B] block text-[10px] uppercase font-mono mb-0.5">{t.sampleNumber}:</span>
                <span className="font-mono text-amber-300 font-medium">{formatLocaleNumber(984500, selected)} GOLD</span>
              </div>
            </div>
          </div>

          {/* Footer Info & Confirm */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#2D303E]">
            <p className="text-xs text-[#64748B] font-mono text-center sm:text-left">
              💡 {t.changeLanguageAnytime}
            </p>
            <button
              onClick={() => onSelectLanguage(selected)}
              className="w-full sm:w-auto px-6 py-3 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0B0E] font-bold text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>{t.confirmLanguage}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
