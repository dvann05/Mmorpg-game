export type AudioZoneId =
  | 'login'
  | 'charSelect'
  | 'village'
  | 'forest'
  | 'snow'
  | 'desert'
  | 'dungeon'
  | 'castle'
  | 'boss'
  | 'raid'
  | 'pvp'
  | 'guild'
  | 'market';

export type AmbientSoundId =
  | 'birds'
  | 'wind'
  | 'river'
  | 'waves'
  | 'rain'
  | 'thunder'
  | 'fireplace'
  | 'insects'
  | 'waterfall'
  | 'snowWind'
  | 'caveEcho'
  | 'crickets';

export type ReverbPreset = 'none' | 'room' | 'hall' | 'cave' | 'cathedral';

export interface AudioZoneConfig {
  id: AudioZoneId;
  nameKey: string;
  style: string;
  baseFreq: number; // Pitch tone base
  scale: number[]; // Scale intervals (Pentatonic / Major / Minor / Dorian)
  tempoBpm: number;
  reverbPreset: ReverbPreset;
  defaultAmbients: AmbientSoundId[];
  colorGradient: string;
  description: string;
}

export interface SpatialEmitter {
  id: string;
  type: AmbientSoundId;
  label: string;
  x: number; // 0..100
  y: number; // 0..100
  radius: number;
  iconName: string;
}

export interface AudioVolumeState {
  master: number; // 0..100
  music: number;  // 0..100
  ambient: number;// 0..100
  voice: number;  // 0..100
  ui: number;     // 0..100
}
