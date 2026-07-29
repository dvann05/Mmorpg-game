import React, { useState, useEffect } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from './types/i18n';
import { getTranslation } from './localization';
import { UserProfile } from './types/auth';
import { AudioZoneId } from './types/audio';
import { audioEngine } from './audio/audioEngine';
import {
  LandscapeConfig,
  WeatherType,
  TimeOfDay,
  LANDSCAPES,
} from './types/landscape';

import { HeaderNav } from './components/HeaderNav';
import { FirstLaunchModal } from './components/FirstLaunchModal';
import { OverviewSection } from './components/OverviewSection';
import { LoginSection } from './components/LoginSection';
import { CharacterHub } from './components/CharacterHub';
import { AudioMusicHub } from './components/AudioMusicHub';
import { SecurityCenter } from './components/SecurityCenter';
import { CloudSaveHub } from './components/CloudSaveHub';
import { SettingsModal } from './components/SettingsModal';
import { LandscapeModal } from './components/LandscapeModal';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [voiceLang, setVoiceLang] = useState<LanguageCode>('en');
  const [subLang, setSubLang] = useState<LanguageCode>('en');

  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLandscapeModal, setShowLandscapeModal] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [activeZone, setActiveZone] = useState<AudioZoneId>('login');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Landscape state
  const [currentLandscape, setCurrentLandscape] = useState<LandscapeConfig>(LANDSCAPES[0]);
  const [activeWeather, setActiveWeather] = useState<WeatherType>(LANDSCAPES[0].defaultWeather);
  const [activeTime, setActiveTime] = useState<TimeOfDay>(LANDSCAPES[0].defaultTime);

  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr_demo_777',
    email: 'demo@aetheria.io',
    username: 'AetherHero',
    provider: 'email',
    isGuest: false,
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    renameTickets: 2,
  });

  useEffect(() => {
    // Check if first launch
    const hasLaunched = localStorage.getItem('aetheria_launched');
    if (!hasLaunched) {
      setIsFirstLaunch(true);
    }

    const savedLandscapeId = localStorage.getItem('aetheria_landscape');
    if (savedLandscapeId) {
      const found = LANDSCAPES.find((l) => l.id === savedLandscapeId);
      if (found) {
        setCurrentLandscape(found);
        setActiveWeather(found.defaultWeather);
        setActiveTime(found.defaultTime);
      }
    }
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    setCurrentLang(code);
    setIsFirstLaunch(false);
    localStorage.setItem('aetheria_launched', 'true');
    localStorage.setItem('aetheria_lang', code);
    audioEngine.playUISound('success');
  };

  const handleSelectLandscape = (landscape: LandscapeConfig) => {
    setCurrentLandscape(landscape);
    setActiveWeather(landscape.defaultWeather);
    setActiveTime(landscape.defaultTime);
    localStorage.setItem('aetheria_landscape', landscape.id);
    audioEngine.playUISound('success');
  };

  const handleSyncAudioZone = (zoneId: string) => {
    setActiveZone(zoneId as AudioZoneId);
    audioEngine.playZoneMusic(zoneId as AudioZoneId);
    audioEngine.playUISound('click');
  };

  const handleToggleMute = () => {
    if (isAudioMuted) {
      audioEngine.setVolumes({ master: 80 });
      setIsAudioMuted(false);
      audioEngine.playZoneMusic(activeZone);
    } else {
      audioEngine.setVolumes({ master: 0 });
      setIsAudioMuted(true);
    }
  };

  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div
      className="min-h-screen bg-[#0A0B0E] text-[#E4E4E7] selection:bg-[#00F0FF] selection:text-[#0A0B0E] font-sans antialiased"
      dir={langInfo.dir}
    >
      {/* Top Header Navigation */}
      <HeaderNav
        currentLang={currentLang}
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeZone={activeZone}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        onOpenSettings={() => setShowSettings(true)}
        onOpenLangModal={() => setIsFirstLaunch(true)}
        onOpenLandscapeModal={() => setShowLandscapeModal(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewSection
            currentLang={currentLang}
            user={user}
            setActiveTab={setActiveTab}
            activeZone={activeZone}
            onOpenLangModal={() => setIsFirstLaunch(true)}
            currentLandscape={currentLandscape}
            onSelectLandscape={handleSelectLandscape}
            activeWeather={activeWeather}
            onChangeWeather={setActiveWeather}
            activeTime={activeTime}
            onChangeTime={setActiveTime}
            onSyncAudioZone={handleSyncAudioZone}
            onOpenLandscapeModal={() => setShowLandscapeModal(true)}
          />
        )}

        {activeTab === 'login' && (
          <LoginSection
            currentLang={currentLang}
            user={user}
            onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
            onLogout={() => setUser(null)}
          />
        )}

        {activeTab === 'characters' && (
          <CharacterHub
            currentLang={currentLang}
            userId={user?.id || 'usr_demo_777'}
          />
        )}

        {activeTab === 'audio' && (
          <AudioMusicHub
            currentLang={currentLang}
            activeZone={activeZone}
            setActiveZone={setActiveZone}
            voiceLang={voiceLang}
            setVoiceLang={setVoiceLang}
            subLang={subLang}
            setSubLang={setSubLang}
            onOpenLandscapeModal={() => setShowLandscapeModal(true)}
          />
        )}

        {activeTab === 'security' && <SecurityCenter currentLang={currentLang} />}

        {activeTab === 'cloud' && (
          <CloudSaveHub
            currentLang={currentLang}
            userId={user?.id || 'usr_demo_777'}
          />
        )}
      </main>

      {/* Landscape Modal Selector */}
      <LandscapeModal
        isOpen={showLandscapeModal}
        onClose={() => setShowLandscapeModal(false)}
        currentLandscape={currentLandscape}
        onSelectLandscape={handleSelectLandscape}
        activeWeather={activeWeather}
        onChangeWeather={setActiveWeather}
        activeTime={activeTime}
        onChangeTime={setActiveTime}
        onSyncAudioZone={handleSyncAudioZone}
      />

      {/* First Launch Language Selector Modal */}
      <FirstLaunchModal
        isOpen={isFirstLaunch}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Settings Modal Drawer */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentLang={currentLang}
        onSelectLanguage={handleSelectLanguage}
        voiceLang={voiceLang}
        setVoiceLang={setVoiceLang}
        subLang={subLang}
        setSubLang={setSubLang}
      />
    </div>
  );
}
