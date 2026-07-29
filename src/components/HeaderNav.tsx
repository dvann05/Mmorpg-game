import React from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types/i18n';
import { getTranslation } from '../localization';
import { UserProfile } from '../types/auth';
import { AudioZoneId } from '../types/audio';
import {
  Globe,
  Music,
  ShieldCheck,
  Cloud,
  User,
  Settings,
  Sword,
  Volume2,
  VolumeX,
  Wifi,
  Compass,
} from 'lucide-react';

interface Props {
  currentLang: LanguageCode;
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeZone: AudioZoneId;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenLangModal: () => void;
  onOpenLandscapeModal?: () => void;
}

export const HeaderNav: React.FC<Props> = ({
  currentLang,
  user,
  activeTab,
  setActiveTab,
  activeZone,
  isAudioMuted,
  onToggleMute,
  onOpenSettings,
  onOpenLangModal,
  onOpenLandscapeModal,
}) => {
  const t = getTranslation(currentLang);
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const navItems = [
    { id: 'overview', label: t.navHome, icon: Sword },
    { id: 'login', label: t.navLogin, icon: User },
    { id: 'characters', label: t.navCharacters, icon: Sword },
    { id: 'audio', label: t.navAudio, icon: Music },
    { id: 'security', label: t.navSecurity, icon: ShieldCheck },
    { id: 'cloud', label: t.navCloud, icon: Cloud },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F1116]/95 backdrop-blur-md border-b border-[#2D303E] text-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="p-2.5 border border-[#00F0FF] bg-[#1A1C23] text-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-[#0A0B0E] transition-all">
            <Sword className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight italic text-white flex items-center gap-2">
              <span>{t.appName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
            </h1>
            <p className="text-[10px] text-[#64748B] tracking-[0.25em] uppercase font-mono hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0A0B0E] p-1 border border-[#2D303E]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#00F0FF] text-[#0A0B0E] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-[#64748B] hover:text-[#E4E4E7] hover:bg-[#1A1C23]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Active Audio Zone Indicator */}
          <button
            onClick={onToggleMute}
            title={isAudioMuted ? 'Unmute BGM' : 'Mute BGM'}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#2D303E] bg-[#1A1C23] hover:border-[#00F0FF] text-xs text-[#E4E4E7] transition-all"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#00F0FF] animate-pulse" />
            )}
            <span className="hidden lg:inline text-[10px] font-mono uppercase text-[#64748B]">
              {activeZone}
            </span>
          </button>

          {/* Cloud Sync Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1C23] border border-[#2D303E] text-xs text-[#00F0FF] font-mono">
            <Wifi className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-[10px] uppercase tracking-widest hidden xl:inline">{t.synced}</span>
          </div>

          {/* Language Selector Button */}
          <button
            onClick={onOpenLangModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-[#E4E4E7] text-xs transition-all"
          >
            <span>{langInfo.flag}</span>
            <span className="font-bold font-mono text-[11px] uppercase text-[#00F0FF]">{langInfo.code}</span>
            <Globe className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* User Profile Pill */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A1C23] border border-[#2D303E] text-xs">
              <div className="w-5 h-5 bg-[#00F0FF] text-[#0A0B0E] font-bold text-[10px] flex items-center justify-center font-mono">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-[#E4E4E7] font-mono text-xs max-w-[90px] truncate">
                {user.username}
              </span>
            </div>
          )}

          {/* Change Landscape Trigger Button */}
          {onOpenLandscapeModal && (
            <button
              onClick={onOpenLandscapeModal}
              title="Change Landscape Environment"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1C23] border border-[#00F0FF]/40 hover:border-[#00F0FF] text-[#00F0FF] text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            >
              <Compass className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider">LANDSCAPE</span>
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 border border-[#2D303E] bg-[#1A1C23] hover:border-[#00F0FF] hover:text-[#00F0FF] text-[#64748B] transition-all"
            title={t.navSettings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around bg-[#0A0B0E] px-2 py-2 border-t border-[#2D303E] overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                isActive ? 'text-[#00F0FF] font-bold' : 'text-[#64748B] hover:text-[#E4E4E7]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
