import React, { useState, useEffect } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types/i18n';
import { getTranslation } from '../localization';
import { AudioZoneId, AmbientSoundId, ReverbPreset, AudioVolumeState, SpatialEmitter } from '../types/audio';
import { audioEngine } from '../audio/audioEngine';
import {
  Music,
  Volume2,
  Sliders,
  Radio,
  MapPin,
  Sparkles,
  Disc,
  Headphones,
  Compass,
  Check,
} from 'lucide-react';

interface Props {
  currentLang: LanguageCode;
  activeZone: AudioZoneId;
  setActiveZone: (zone: AudioZoneId) => void;
  voiceLang: LanguageCode;
  setVoiceLang: (lang: LanguageCode) => void;
  subLang: LanguageCode;
  setSubLang: (lang: LanguageCode) => void;
  onOpenLandscapeModal?: () => void;
}

const ZONES: { id: AudioZoneId; nameKey: string; style: string; gradient: string }[] = [
  { id: 'login', nameKey: 'zoneLogin', style: 'Ethereal Fantasy / Soft Synth Pad', gradient: 'from-indigo-900 to-purple-900' },
  { id: 'charSelect', nameKey: 'zoneCharSelect', style: 'Heroic Awakening / Brass & Strings', gradient: 'from-blue-900 to-indigo-900' },
  { id: 'village', nameKey: 'zoneVillage', style: 'Peaceful Acoustic / Lute & Flute', gradient: 'from-emerald-900 to-teal-900' },
  { id: 'forest', nameKey: 'zoneForest', style: 'Celtic Folk / Ancient Canopy', gradient: 'from-emerald-900 to-green-950' },
  { id: 'snow', nameKey: 'zoneSnow', style: 'Glacial Ambient / Bell Piano', gradient: 'from-sky-900 to-slate-900' },
  { id: 'desert', nameKey: 'zoneDesert', style: 'Mystical Sandstorm / Phrygian Strings', gradient: 'from-amber-900 to-yellow-950' },
  { id: 'dungeon', nameKey: 'zoneDungeon', style: 'Shadow Citadel / Dark Low Drone', gradient: 'from-slate-950 to-purple-950' },
  { id: 'castle', nameKey: 'zoneCastle', style: 'Imperial Royal March / Grand Pipe Organ', gradient: 'from-amber-900 to-purple-900' },
  { id: 'boss', nameKey: 'zoneBoss', style: 'Wrath of Titans / Fast Orchestral Pulse', gradient: 'from-rose-950 to-red-900' },
  { id: 'raid', nameKey: 'zoneRaid', style: 'Storm of Valors / Epic Choir & Drums', gradient: 'from-purple-950 to-rose-950' },
  { id: 'pvp', nameKey: 'zonePvP', style: 'Gladiator Clash / Percussive Rhythm', gradient: 'from-red-950 to-slate-900' },
  { id: 'guild', nameKey: 'zoneGuild', style: 'Bards & Ale / Warm Tavern Folk', gradient: 'from-amber-950 to-amber-900' },
  { id: 'market', nameKey: 'zoneMarket', style: 'Bustling Bazaar / Bright Ensemble', gradient: 'from-yellow-900 to-teal-900' },
];

const AMBIENTS: { id: AmbientSoundId; nameKey: string; icon: string }[] = [
  { id: 'birds', nameKey: 'ambBirds', icon: '🐦' },
  { id: 'wind', nameKey: 'ambWind', icon: '💨' },
  { id: 'river', nameKey: 'ambRiver', icon: '🌊' },
  { id: 'waves', nameKey: 'ambWaves', icon: '🌊' },
  { id: 'rain', nameKey: 'ambRain', icon: '🌧️' },
  { id: 'thunder', nameKey: 'ambThunder', icon: '🌩️' },
  { id: 'fireplace', nameKey: 'ambFireplace', icon: '🔥' },
  { id: 'insects', nameKey: 'ambInsects', icon: '🦗' },
  { id: 'waterfall', nameKey: 'ambWaterfall', icon: '💦' },
  { id: 'snowWind', nameKey: 'ambSnowWind', icon: '❄️' },
  { id: 'caveEcho', nameKey: 'ambCaveEcho', icon: '🦇' },
  { id: 'crickets', nameKey: 'ambCrickets', icon: '🌌' },
];

export const AudioMusicHub: React.FC<Props> = ({
  currentLang,
  activeZone,
  setActiveZone,
  voiceLang,
  setVoiceLang,
  subLang,
  setSubLang,
  onOpenLandscapeModal,
}) => {
  const t = getTranslation(currentLang);

  const [volumes, setVolumes] = useState<AudioVolumeState>(audioEngine.getVolumeState());
  const [activeAmbients, setActiveAmbients] = useState<Set<AmbientSoundId>>(
    new Set(['birds', 'wind'])
  );
  const [reverb, setReverb] = useState<ReverbPreset>('room');

  // 3D Spatial Audio Map state
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    audioEngine.playZoneMusic(activeZone);
  }, [activeZone]);

  const handleVolumeChange = (key: keyof AudioVolumeState, val: number) => {
    const updated = { ...volumes, [key]: val };
    setVolumes(updated);
    audioEngine.setVolumes(updated);
  };

  const handleToggleAmbient = (soundId: AmbientSoundId) => {
    const next = new Set(activeAmbients);
    const isActive = next.has(soundId);
    if (isActive) {
      next.delete(soundId);
      audioEngine.toggleAmbientSound(soundId, false);
    } else {
      next.add(soundId);
      audioEngine.toggleAmbientSound(soundId, true);
    }
    setActiveAmbients(next);
  };

  const handleReverbChange = (preset: ReverbPreset) => {
    setReverb(preset);
    audioEngine.setReverbPreset(preset);
  };

  const activeZoneObj = ZONES.find((z) => z.id === activeZone) || ZONES[0];

  return (
    <div className="space-y-8 text-[#E4E4E7]">
      {/* Active Soundtrack Hero Stage */}
      <div className="p-6 md:p-8 bg-[#0F1116] border border-[#00F0FF]/50 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#1A1C23] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-2xl">
              <Disc className="w-10 h-10 animate-spin text-[#00F0FF]" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold uppercase">
                  Adaptive Music Engine
                </span>
                <span className="text-xs text-[#64748B] font-mono uppercase">
                  {t.audioCrossfadeActive}
                </span>
              </div>
              <h2 className="text-2xl font-black italic tracking-tight text-white mt-1 uppercase">
                {(t as unknown as Record<string, string>)[activeZoneObj.nameKey] || activeZoneObj.id}
              </h2>
              <p className="text-xs text-[#64748B] font-mono mt-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>{activeZoneObj.style}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenLandscapeModal && (
              <button
                onClick={onOpenLandscapeModal}
                className="px-5 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0B0E] text-xs font-mono uppercase font-bold tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 animate-pulse" />
                <span>CHANGE LANDSCAPE</span>
              </button>
            )}

            <button
              onClick={() => {
                audioEngine.playZoneMusic(activeZone);
                audioEngine.playUISound('click');
              }}
              className="px-5 py-2.5 bg-[#1A1C23] hover:bg-[#2D303E] border border-[#00F0FF] text-white text-xs font-mono uppercase font-bold tracking-wider transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-[#00F0FF] animate-pulse" />
              <span>Restart Loop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Zone Selector & Volume Sliders (12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Zone Soundtrack Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-[#00F0FF]" />
            <span>{t.selectZone}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {ZONES.map((zone) => {
              const isSelected = activeZone === zone.id;
              const translatedName = (t as unknown as Record<string, string>)[zone.nameKey] || zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    setActiveZone(zone.id);
                    audioEngine.playUISound('click');
                  }}
                  className={`p-3.5 border text-left transition-all ${
                    isSelected
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[#0F1116] border-[#2D303E] hover:border-[#64748B] text-[#64748B] hover:text-[#E4E4E7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-white uppercase">{translatedName}</h4>
                    {isSelected && <Disc className="w-4 h-4 text-[#00F0FF] animate-spin" />}
                  </div>
                  <p className="text-[10px] text-[#64748B] font-mono mt-1 line-clamp-1">{zone.style}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Audio Volume Mixer & Accessibility (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#2D303E] pb-3">
              <Sliders className="w-5 h-5 text-[#00F0FF]" />
              <span>Audio Mixer</span>
            </h3>

            {/* Sliders */}
            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                  <span>{t.masterVolume}</span>
                  <span className="text-[#00F0FF] font-bold">{volumes.master}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes.master}
                  onChange={(e) => handleVolumeChange('master', Number(e.target.value))}
                  className="w-full accent-[#00F0FF] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                  <span>{t.musicVolume}</span>
                  <span className="text-emerald-400 font-bold">{volumes.music}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes.music}
                  onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                  <span>{t.ambientVolume}</span>
                  <span className="text-amber-400 font-bold">{volumes.ambient}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes.ambient}
                  onChange={(e) => handleVolumeChange('ambient', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                  <span>{t.voiceVolume}</span>
                  <span className="text-purple-400 font-bold">{volumes.voice}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes.voice}
                  onChange={(e) => handleVolumeChange('voice', Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                  <span>{t.uiVolume}</span>
                  <span className="text-rose-400 font-bold">{volumes.ui}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes.ui}
                  onChange={(e) => handleVolumeChange('ui', Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Voice vs Subtitle Language Separate Selectors */}
          <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#00F0FF]" />
              <span>Voice & Subtitle Languages</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#64748B] uppercase mb-1">{t.voiceOverLanguage}</label>
                <select
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 bg-[#1A1C23] border border-[#2D303E] text-white outline-none cursor-pointer focus:border-[#00F0FF]"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.englishName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1">{t.subtitleLanguage}</label>
                <select
                  value={subLang}
                  onChange={(e) => setSubLang(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 bg-[#1A1C23] border border-[#2D303E] text-white outline-none cursor-pointer focus:border-[#00F0FF]"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.englishName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Sound Layer Generator Toggles */}
      <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#00F0FF]" />
          <span>{t.ambientSounds}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
          {AMBIENTS.map((amb) => {
            const isActive = activeAmbients.has(amb.id);
            const translatedName = (t as unknown as Record<string, string>)[amb.nameKey] || amb.id;
            return (
              <button
                key={amb.id}
                onClick={() => handleToggleAmbient(amb.id)}
                className={`p-3 border text-center transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-white'
                }`}
              >
                <span className="text-lg">{amb.icon}</span>
                <span className="text-xs truncate uppercase">{translatedName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Spatial Audio Map Visualizer */}
      <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D303E] pb-3">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00F0FF]" />
            <span>{t.spatialAudio3D}</span>
          </h3>
          <p className="text-xs text-[#64748B] font-mono">{t.dragPlayerToExplore}</p>
        </div>

        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
            setPlayerPos({ x, y });
            audioEngine.playUISound('click');
          }}
          className="relative h-64 bg-[#0A0B0E] border border-[#2D303E] cursor-crosshair overflow-hidden"
        >
          {/* Spatial Sound Emitters */}
          <div className="absolute top-[20%] left-[25%] p-3 bg-[#1A1C23] border border-[#2D303E] text-[#00F0FF] flex items-center gap-1.5 text-xs font-mono uppercase">
            <span>💦</span> Waterfall
          </div>
          <div className="absolute top-[70%] left-[70%] p-3 bg-[#1A1C23] border border-[#2D303E] text-amber-300 flex items-center gap-1.5 text-xs font-mono uppercase">
            <span>🔥</span> Campfire
          </div>
          <div className="absolute top-[30%] left-[75%] p-3 bg-[#1A1C23] border border-[#2D303E] text-emerald-300 flex items-center gap-1.5 text-xs font-mono uppercase">
            <span>🐦</span> Birds Canopy
          </div>

          {/* Interactive Player Marker */}
          <div
            className="absolute w-8 h-8 bg-[#00F0FF] border-2 border-[#0A0B0E] shadow-[0_0_15px_rgba(0,240,255,0.8)] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
          >
            <MapPin className="w-5 h-5 text-[#0A0B0E]" />
          </div>
        </div>
      </div>
    </div>
  );
};
