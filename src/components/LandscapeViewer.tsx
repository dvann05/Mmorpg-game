import React, { useState, useEffect, useRef } from 'react';
import {
  LandscapeConfig,
  LandscapeId,
  WeatherType,
  TimeOfDay,
  LANDSCAPES,
} from '../types/landscape';
import {
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Flame,
  Sparkles,
  Sliders,
  Radio,
  Eye,
  Maximize2,
  Volume2,
  Layers,
  Wind,
  Compass,
} from 'lucide-react';

interface Props {
  currentLandscape: LandscapeConfig;
  onSelectLandscape: (landscape: LandscapeConfig) => void;
  activeWeather?: WeatherType;
  onChangeWeather?: (weather: WeatherType) => void;
  activeTime?: TimeOfDay;
  onChangeTime?: (time: TimeOfDay) => void;
  onSyncAudioZone?: (zoneId: string) => void;
  showControls?: boolean;
}

export const LandscapeViewer: React.FC<Props> = ({
  currentLandscape,
  onSelectLandscape,
  activeWeather,
  onChangeWeather,
  activeTime,
  onChangeTime,
  onSyncAudioZone,
  showControls = true,
}) => {
  const weather = activeWeather || currentLandscape.defaultWeather;
  const timeOfDay = activeTime || currentLandscape.defaultTime;

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [particleDensity, setParticleDensity] = useState<number>(40);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track mouse movement for parallax depth effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  // Canvas particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate weather particles
    const particles = Array.from({ length: particleDensity }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      rotation: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle layer depending on weather
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (weather === 'rain') {
          ctx.strokeStyle = currentLandscape.accentColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.speedX * 3, p.y + p.speedY * 4);
          ctx.stroke();
        } else if (weather === 'snow') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (weather === 'embers') {
          ctx.fillStyle = '#EF4444';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#F59E0B';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (weather === 'cyber_grid') {
          ctx.fillStyle = '#00F0FF';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00F0FF';
          ctx.fillRect(p.x, p.y, p.size * 2, p.size * 2);
        } else if (weather === 'sakura') {
          ctx.fillStyle = '#F472B6';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 2, p.size, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Clear / Sparkles
          ctx.fillStyle = currentLandscape.accentColor;
          ctx.shadowBlur = 6;
          ctx.shadowColor = currentLandscape.accentColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weather, particleDensity, currentLandscape]);

  // Map time of day overlay colors
  const timeOverlayMap: Record<TimeOfDay, string> = {
    dawn: 'from-amber-500/20 via-rose-500/10 to-transparent',
    noon: 'from-sky-400/20 via-blue-500/10 to-transparent',
    twilight: 'from-purple-900/30 via-pink-900/20 to-transparent',
    cyber_night: 'from-indigo-950/50 via-[#0A0B0E]/80 to-[#0A0B0E]',
    eclipse: 'from-red-950/60 via-black/80 to-black',
  };

  return (
    <div className="space-y-6">
      {/* Landscape Main Stage */}
      <div
        onMouseMove={handleMouseMove}
        className="relative h-80 sm:h-96 md:h-[420px] bg-[#0A0B0E] border border-[#2D303E] overflow-hidden group transition-all"
      >
        {/* Parallax Background Gradient Layer */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentLandscape.gradient} transition-all duration-700`}
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -15}px) scale(1.05)`,
          }}
        />

        {/* Time of Day Sky Filter */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${timeOverlayMap[timeOfDay]} pointer-events-none transition-all duration-500`}
        />

        {/* Parallax Horizon Mesh Graphic */}
        <div
          className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -8}px)`,
          }}
        />

        {/* Dynamic Glow Horizon Circle */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: currentLandscape.accentColor,
            transform: `translate(calc(-50% + ${(mousePos.x - 0.5) * 30}px), ${(mousePos.y - 0.5) * 20}px)`,
          }}
        />

        {/* Weather Particle Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Central Landscape Symbol & Banner */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
          <div
            className="w-20 h-20 border-2 shadow-2xl flex items-center justify-center text-4xl mb-3 backdrop-blur-md transition-all duration-500"
            style={{
              borderColor: currentLandscape.accentColor,
              backgroundColor: 'rgba(15, 17, 22, 0.7)',
              boxShadow: `0 0 25px ${currentLandscape.accentColor}40`,
            }}
          >
            {currentLandscape.icon}
          </div>

          <span
            className="px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-[0.3em] mb-1"
            style={{
              color: currentLandscape.accentColor,
              backgroundColor: `${currentLandscape.accentColor}20`,
              border: `1px solid ${currentLandscape.accentColor}40`,
            }}
          >
            {currentLandscape.tagline}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black italic tracking-tight text-white uppercase drop-shadow-lg">
            {currentLandscape.name}
          </h2>

          <p className="text-xs text-[#E4E4E7]/80 max-w-lg mt-2 font-mono leading-relaxed line-clamp-2 bg-[#0A0B0E]/60 px-4 py-2 border border-[#2D303E]">
            {currentLandscape.description}
          </p>
        </div>

        {/* Top Floating Overlay Badge */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#0A0B0E]/90 border border-[#2D303E] font-mono text-[10px] text-[#00F0FF] uppercase font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
            LANDSCAPE MODE
          </span>
          <span className="px-2.5 py-1 bg-[#0A0B0E]/90 border border-[#2D303E] font-mono text-[10px] text-[#64748B] uppercase">
            WEATHER: {weather.toUpperCase()}
          </span>
          <span className="px-2.5 py-1 bg-[#0A0B0E]/90 border border-[#2D303E] font-mono text-[10px] text-[#64748B] uppercase">
            TIME: {timeOfDay.toUpperCase()}
          </span>
        </div>

        {/* Bottom Floating Controls Quick Sync */}
        {onSyncAudioZone && (
          <div className="absolute bottom-4 right-4 z-30">
            <button
              onClick={() => onSyncAudioZone(currentLandscape.audioZoneId)}
              className="px-4 py-2 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0B0E] font-mono font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>SYNC BGM: {currentLandscape.audioZoneId.toUpperCase()}</span>
            </button>
          </div>
        )}
      </div>

      {/* Landscape Customizer Controls & Selectors */}
      {showControls && (
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2D303E] pb-4">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00F0FF]" />
                <span>ENVIRONMENT & WEATHER CONTROLS</span>
              </h3>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Customize landscape weather particle layers, time-of-day sky mood, and particle density.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#64748B]">PARTICLES:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={particleDensity}
                onChange={(e) => setParticleDensity(Number(e.target.value))}
                className="w-28 accent-[#00F0FF] cursor-pointer"
              />
              <span className="text-[#00F0FF] font-bold w-6">{particleDensity}</span>
            </div>
          </div>

          {/* Weather & Time Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Weather Selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#64748B] uppercase tracking-widest block">
                WEATHER LAYER
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {(
                  [
                    'clear',
                    'rain',
                    'snow',
                    'embers',
                    'cyber_grid',
                    'fog',
                    'sakura',
                  ] as WeatherType[]
                ).map((w) => {
                  const isActive = weather === w;
                  return (
                    <button
                      key={w}
                      onClick={() => onChangeWeather && onChangeWeather(w)}
                      className={`p-2 border text-center text-[10px] uppercase font-bold transition-all ${
                        isActive
                          ? 'bg-[#00F0FF] text-[#0A0B0E] border-[#00F0FF]'
                          : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-white'
                      }`}
                    >
                      {w.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day Selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#64748B] uppercase tracking-widest block">
                HORIZON TIME OF DAY
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['dawn', 'noon', 'twilight', 'cyber_night', 'eclipse'] as TimeOfDay[]).map(
                  (t) => {
                    const isActive = timeOfDay === t;
                    return (
                      <button
                        key={t}
                        onClick={() => onChangeTime && onChangeTime(t)}
                        className={`p-2 border text-center text-[10px] uppercase font-bold transition-all ${
                          isActive
                            ? 'bg-[#00F0FF] text-[#0A0B0E] border-[#00F0FF]'
                            : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-white'
                        }`}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Quick Change Landscape Selector Grid */}
          <div className="space-y-3 pt-2 border-t border-[#2D303E]">
            <label className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest block">
              SELECT & CHANGE LANDSCAPE (9 BIOMES)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
              {LANDSCAPES.map((ls) => {
                const isSelected = currentLandscape.id === ls.id;
                return (
                  <button
                    key={ls.id}
                    onClick={() => onSelectLandscape(ls)}
                    className={`p-3 border text-left font-mono transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-[#E4E4E7] hover:border-[#64748B]'
                    }`}
                  >
                    <span className="text-2xl p-1.5 bg-[#0A0B0E] border border-[#2D303E]">
                      {ls.icon}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold uppercase text-white truncate">
                        {ls.name}
                      </p>
                      <p className="text-[10px] text-[#64748B] truncate">
                        {ls.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
