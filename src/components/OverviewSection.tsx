import React from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types/i18n';
import { getTranslation } from '../localization';
import { UserProfile } from '../types/auth';
import { AudioZoneId } from '../types/audio';
import {
  LandscapeConfig,
  WeatherType,
  TimeOfDay,
} from '../types/landscape';
import { LandscapeViewer } from './LandscapeViewer';
import {
  Globe,
  User,
  Sword,
  Music,
  ShieldCheck,
  Cloud,
  Sparkles,
  Volume2,
  ArrowRight,
  Headphones,
  Sliders,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface Props {
  currentLang: LanguageCode;
  user: UserProfile | null;
  setActiveTab: (tab: string) => void;
  activeZone: AudioZoneId;
  onOpenLangModal: () => void;
  currentLandscape: LandscapeConfig;
  onSelectLandscape: (landscape: LandscapeConfig) => void;
  activeWeather: WeatherType;
  onChangeWeather: (weather: WeatherType) => void;
  activeTime: TimeOfDay;
  onChangeTime: (time: TimeOfDay) => void;
  onSyncAudioZone: (zoneId: string) => void;
  onOpenLandscapeModal: () => void;
}

export const OverviewSection: React.FC<Props> = ({
  currentLang,
  user,
  setActiveTab,
  activeZone,
  onOpenLangModal,
  currentLandscape,
  onSelectLandscape,
  activeWeather,
  onChangeWeather,
  activeTime,
  onChangeTime,
  onSyncAudioZone,
  onOpenLandscapeModal,
}) => {
  const t = getTranslation(currentLang);
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="space-y-8 text-[#E4E4E7]">
      {/* Hero Welcome Banner */}
      <div className="relative p-8 md:p-12 bg-[#0F1116] border border-[#2D303E] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1C23] border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-mono tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Multi-Language RPG Engine & Security Core</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-none">
            {t.appName.toUpperCase()} <span className="text-[#00F0FF]">CORE</span>
          </h2>

          <p className="text-sm md:text-base text-[#64748B] leading-relaxed max-w-2xl">
            Complete high-tech gaming infrastructure featuring 14 localized languages, JWT session credentials, character customization engine, adaptive Web Audio music synthesizer, and cloud state synchronization.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenLandscapeModal}
              className="px-6 py-3 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0B0E] font-bold text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 animate-pulse" />
              <span>CHANGE LANDSCAPE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className="px-6 py-3 bg-[#1A1C23] hover:border-[#00F0FF] border border-[#2D303E] text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <User className="w-4 h-4 text-[#00F0FF]" />
              <span>{user ? 'ACCESS CONTROL' : 'AUTHENTICATE / LOGIN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Interactive Landscape Environment Stage */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D303E] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              ACTIVE RPG LANDSCAPE STAGE
            </h3>
          </div>

          <button
            onClick={onOpenLandscapeModal}
            className="px-4 py-1.5 bg-[#1A1C23] hover:bg-[#2D303E] border border-[#00F0FF]/50 text-[#00F0FF] text-xs font-mono uppercase font-bold flex items-center gap-2 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>CHANGE LANDSCAPE (9 BIOMES)</span>
          </button>
        </div>

        <LandscapeViewer
          currentLandscape={currentLandscape}
          onSelectLandscape={onSelectLandscape}
          activeWeather={activeWeather}
          onChangeWeather={onChangeWeather}
          activeTime={activeTime}
          onChangeTime={onChangeTime}
          onSyncAudioZone={onSyncAudioZone}
          showControls={true}
        />
      </div>

      {/* 3 Core System Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System 1: Language System */}
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] hover:border-[#00F0FF] transition-colors space-y-4 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#64748B]">
                SYSTEM 01
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">
              LINGUA SYSTEM
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              14 supported languages with live switching, RTL layout support for Arabic, separate voice-over vs subtitle language selection, and locale date/currency formatting.
            </p>
          </div>

          <button
            onClick={onOpenLangModal}
            className="w-full py-3 bg-[#1A1C23] group-hover:bg-[#00F0FF] group-hover:text-[#0A0B0E] border border-[#2D303E] text-xs font-mono uppercase tracking-wider text-[#00F0FF] flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>ACTIVE: {langInfo.flag} {langInfo.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* System 2: Login & Character System */}
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] hover:border-[#00F0FF] transition-colors space-y-4 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#64748B]">
                SYSTEM 02
              </div>
              <div className="w-2 h-2 bg-[#2D303E] group-hover:bg-[#00F0FF] transition-colors"></div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">
              CHARACTER & AUTH
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Guest play, JWT session credentials, 2FA, rate limiting, active device manager, character creation, custom colors, stats, rename ticket, and delete safety confirmation.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('characters')}
            className="w-full py-3 bg-[#1A1C23] group-hover:bg-[#00F0FF] group-hover:text-[#0A0B0E] border border-[#2D303E] text-xs font-mono uppercase tracking-wider text-[#00F0FF] flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>CHARACTER HUB</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* System 3: Adaptive Audio System */}
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] hover:border-[#00F0FF] transition-colors space-y-4 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#64748B]">
                SYSTEM 03
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">
              DYNAMO BGM ENGINE
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Synthesized dynamic music across 13 biomes/zones, 12 ambient sound generators, environmental reverb presets, and interactive 3D spatial audio map.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('audio')}
            className="w-full py-3 bg-[#1A1C23] group-hover:bg-[#00F0FF] group-hover:text-[#0A0B0E] border border-[#2D303E] text-xs font-mono uppercase tracking-wider text-[#00F0FF] flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>ACTIVE ZONE: {activeZone.toUpperCase()}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
