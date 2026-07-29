import React from 'react';
import {
  LandscapeConfig,
  WeatherType,
  TimeOfDay,
  LANDSCAPES,
} from '../types/landscape';
import { LandscapeViewer } from './LandscapeViewer';
import { X, Compass, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLandscape: LandscapeConfig;
  onSelectLandscape: (landscape: LandscapeConfig) => void;
  activeWeather: WeatherType;
  onChangeWeather: (weather: WeatherType) => void;
  activeTime: TimeOfDay;
  onChangeTime: (time: TimeOfDay) => void;
  onSyncAudioZone: (zoneId: string) => void;
}

export const LandscapeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLandscape,
  onSelectLandscape,
  activeWeather,
  onChangeWeather,
  activeTime,
  onChangeTime,
  onSyncAudioZone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#0F1116] border border-[#00F0FF]/50 p-6 md:p-8 shadow-2xl text-[#E4E4E7] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D303E] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1A1C23] border border-[#00F0FF] text-[#00F0FF]">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <span>CHANGE LANDSCAPE & ENVIRONMENT</span>
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              </h2>
              <p className="text-xs text-[#64748B] font-mono">
                Select from 9 procedural landscape biomes, adjust weather, horizon lighting, and sync background audio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-[#64748B] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-6 custom-scrollbar">
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

        {/* Footer */}
        <div className="pt-4 mt-6 border-t border-[#2D303E] flex justify-between items-center font-mono uppercase text-xs">
          <span className="text-[#64748B]">
            ACTIVE: <strong className="text-[#00F0FF]">{currentLandscape.name}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0B0E] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            APPLY & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
