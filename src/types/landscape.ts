export type LandscapeId =
  | 'cyber_city'
  | 'volcano_forge'
  | 'whispering_forest'
  | 'celestial_spire'
  | 'ancient_ruins'
  | 'frozen_peak'
  | 'storm_coast'
  | 'radiant_sanctuary'
  | 'abyssal_trench';

export type WeatherType =
  | 'clear'
  | 'rain'
  | 'snow'
  | 'embers'
  | 'cyber_grid'
  | 'fog'
  | 'sakura';

export type TimeOfDay = 'dawn' | 'noon' | 'twilight' | 'cyber_night' | 'eclipse';

export interface LandscapeConfig {
  id: LandscapeId;
  name: string;
  tagline: string;
  audioZoneId: string;
  gradient: string;
  accentColor: string;
  defaultWeather: WeatherType;
  defaultTime: TimeOfDay;
  description: string;
  icon: string;
}

export const LANDSCAPES: LandscapeConfig[] = [
  {
    id: 'cyber_city',
    name: 'NEON HORIZON',
    tagline: 'Futuristic Cyberpunk Metropolis',
    audioZoneId: 'pvp',
    gradient: 'from-[#0A0B0E] via-[#0F172A] to-[#0284C7]',
    accentColor: '#00F0FF',
    defaultWeather: 'cyber_grid',
    defaultTime: 'cyber_night',
    description: 'Towering neon monoliths with holographic laser grids, rain reflection highways, and glowing digital horizon.',
    icon: '🌆',
  },
  {
    id: 'volcano_forge',
    name: 'VOLCANIC FORGE',
    tagline: 'Molten Magma Peaks & Ash',
    audioZoneId: 'boss',
    gradient: 'from-[#0A0B0E] via-[#450A0A] to-[#B91C1C]',
    accentColor: '#EF4444',
    defaultWeather: 'embers',
    defaultTime: 'eclipse',
    description: 'Chasm of active molten lava, soaring basalt cliffs, floating fiery ash embers, and pulsing heat distortion.',
    icon: '🌋',
  },
  {
    id: 'whispering_forest',
    name: 'WHISPERING FOREST',
    tagline: 'Bioluminescent Emerald Canopy',
    audioZoneId: 'forest',
    gradient: 'from-[#0A0B0E] via-[#064E3B] to-[#059669]',
    accentColor: '#10B981',
    defaultWeather: 'fog',
    defaultTime: 'twilight',
    description: 'Ancient mega-trees wrapped in glowing runes, floating fairy spores, soft emerald mist, and tranquil canopy light.',
    icon: '🌲',
  },
  {
    id: 'celestial_spire',
    name: 'CELESTIAL SPIRE',
    tagline: 'Void Citadel & Aurora Borealis',
    audioZoneId: 'raid',
    gradient: 'from-[#0A0B0E] via-[#311042] to-[#7E22CE]',
    accentColor: '#A855F7',
    defaultWeather: 'clear',
    defaultTime: 'cyber_night',
    description: 'Floating crystalline islands suspended in deep space nebula, shimmering aurora waves, and starlight cascades.',
    icon: '🌌',
  },
  {
    id: 'ancient_ruins',
    name: 'DESERT SANCTUARY',
    tagline: 'Sun-Drenched Golden Pillars',
    audioZoneId: 'desert',
    gradient: 'from-[#0A0B0E] via-[#78350F] to-[#D97706]',
    accentColor: '#F59E0B',
    defaultWeather: 'clear',
    defaultTime: 'dawn',
    description: 'Endless golden dunes crowned by monumental ancient columns, floating glyphs, and warm desert horizon glow.',
    icon: '🏛️',
  },
  {
    id: 'frozen_peak',
    name: 'FROZEN SUMMIT',
    tagline: 'Glacial Ice Peaks & Aurora',
    audioZoneId: 'snow',
    gradient: 'from-[#0A0B0E] via-[#164E63] to-[#0284C7]',
    accentColor: '#38BDF8',
    defaultWeather: 'snow',
    defaultTime: 'dawn',
    description: 'Jagged crystal glacier cliffs, icy blizzard snowflakes, howling winds, and crisp blue diamond reflection.',
    icon: '❄️',
  },
  {
    id: 'storm_coast',
    name: 'STORM CRAG',
    tagline: 'Crashing Waves & Lightning',
    audioZoneId: 'dungeon',
    gradient: 'from-[#0A0B0E] via-[#1E293B] to-[#334155]',
    accentColor: '#6366F1',
    defaultWeather: 'rain',
    defaultTime: 'twilight',
    description: 'Surging oceanic tides against jagged obsidian rocks with rolling thunderheads and sudden lightning flashes.',
    icon: '⚡',
  },
  {
    id: 'radiant_sanctuary',
    name: 'RADIANT SHRINE',
    tagline: 'Cherry Blossom Mist & Torii',
    audioZoneId: 'village',
    gradient: 'from-[#0A0B0E] via-[#701A75] to-[#EC4899]',
    accentColor: '#F472B6',
    defaultWeather: 'sakura',
    defaultTime: 'noon',
    description: 'Sacred mountain shrine surrounded by pink cherry blossom petals drifting in gentle morning light.',
    icon: '⛩️',
  },
  {
    id: 'abyssal_trench',
    name: 'ABYSSAL CAVERN',
    tagline: 'Deep Sea Crystal Cavern',
    audioZoneId: 'castle',
    gradient: 'from-[#0A0B0E] via-[#0369A1] to-[#0D9488]',
    accentColor: '#14B8A6',
    defaultWeather: 'fog',
    defaultTime: 'twilight',
    description: 'Submerged glowing underwater trench with bioluminescent corals, drifting bubbles, and deep oceanic ambient pulse.',
    icon: '🌊',
  },
];
