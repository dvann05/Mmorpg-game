export type AuthProvider = 'guest' | 'email' | 'google' | 'apple' | 'facebook' | 'discord';

export interface UserSession {
  id: string;
  deviceName: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  provider: AuthProvider;
  isGuest: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  avatarUrl?: string;
  renameTickets: number;
}

export type CharacterClass = 'Warrior' | 'Mage' | 'Archer' | 'Assassin' | 'Paladin';

export interface CharacterCustomization {
  hairStyle: number;
  hairColor: string;
  skinTone: string;
  outfitColor: string;
  weaponGlow: string;
}

export interface CharacterStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Character {
  id: string;
  name: string;
  characterClass: CharacterClass;
  level: number;
  serverName: string;
  customization: CharacterCustomization;
  stats: CharacterStats;
  lastPlayed: string;
  createdAt: string;
}

export interface CloudSaveData {
  timestamp: string;
  level: number;
  gold: number;
  inventoryCount: number;
  zone: string;
  playtimeMinutes: number;
  hash: string;
}

export interface CloudSaveConflict {
  hasConflict: boolean;
  serverSave?: CloudSaveData;
  localSave?: CloudSaveData;
}
