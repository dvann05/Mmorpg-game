export type LanguageCode =
  | 'en'
  | 'id'
  | 'ja'
  | 'ko'
  | 'zh-CN'
  | 'zh-TW'
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'
  | 'ru'
  | 'ar'
  | 'th'
  | 'vi';

export interface LanguageInfo {
  code: LanguageCode;
  name: string; // Native name
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  fontFamily?: string;
  dateFormat: string;
  currency: string;
  currencySymbol: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', englishName: 'English', flag: '🇺🇸', dir: 'ltr', dateFormat: 'MM/DD/YYYY', currency: 'USD', currencySymbol: '$' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', flag: '🇮🇩', dir: 'ltr', dateFormat: 'DD/MM/YYYY', currency: 'IDR', currencySymbol: 'Rp' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', flag: '🇯🇵', dir: 'ltr', dateFormat: 'YYYY/MM/DD', currency: 'JPY', currencySymbol: '¥' },
  { code: 'ko', name: '한국어', englishName: 'Korean', flag: '🇰🇷', dir: 'ltr', dateFormat: 'YYYY. MM. DD', currency: 'KRW', currencySymbol: '₩' },
  { code: 'zh-CN', name: '简体中文', englishName: 'Chinese (Simplified)', flag: '🇨🇳', dir: 'ltr', dateFormat: 'YYYY-MM-DD', currency: 'CNY', currencySymbol: '¥' },
  { code: 'zh-TW', name: '繁體中文', englishName: 'Chinese (Traditional)', flag: '🇹🇼', dir: 'ltr', dateFormat: 'YYYY/MM/DD', currency: 'TWD', currencySymbol: 'NT$' },
  { code: 'es', name: 'Español', englishName: 'Spanish', flag: '🇪🇸', dir: 'ltr', dateFormat: 'DD/MM/YYYY', currency: 'EUR', currencySymbol: '€' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese', flag: '🇧🇷', dir: 'ltr', dateFormat: 'DD/MM/YYYY', currency: 'BRL', currencySymbol: 'R$' },
  { code: 'fr', name: 'Français', englishName: 'French', flag: '🇫🇷', dir: 'ltr', dateFormat: 'DD/MM/YYYY', currency: 'EUR', currencySymbol: '€' },
  { code: 'de', name: 'Deutsch', englishName: 'German', flag: '🇩🇪', dir: 'ltr', dateFormat: 'DD.MM.YYYY', currency: 'EUR', currencySymbol: '€' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', flag: '🇷🇺', dir: 'ltr', dateFormat: 'DD.MM.YYYY', currency: 'RUB', currencySymbol: '₽' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', flag: '🇸🇦', dir: 'rtl', dateFormat: 'DD/MM/YYYY', currency: 'SAR', currencySymbol: 'ر.س' },
  { code: 'th', name: 'ไทย', englishName: 'Thai', flag: '🇹🇭', dir: 'ltr', dateFormat: 'DD/MM/YYYY', currency: 'THB', currencySymbol: '฿' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', flag: '🇻🇳', dir: 'ltr', dateFormat: 'DD/MM/YYYY', currency: 'VND', currencySymbol: '₫' },
];

export interface TranslationDictionary {
  // Common UI & Navigation
  appName: string;
  appSubtitle: string;
  navHome: string;
  navLogin: string;
  navCharacters: string;
  navAudio: string;
  navSecurity: string;
  navCloud: string;
  navSettings: string;

  // Language Modal & System
  selectLanguageTitle: string;
  selectLanguageDesc: string;
  confirmLanguage: string;
  changeLanguageAnytime: string;
  currentLanguage: string;
  voiceOverLanguage: string;
  subtitleLanguage: string;
  formattingPreview: string;
  sampleDate: string;
  sampleCurrency: string;
  sampleNumber: string;

  // Login System
  loginTitle: string;
  registerTitle: string;
  guestLogin: string;
  emailLabel: string;
  passwordLabel: string;
  rememberMe: string;
  forgotPassword: string;
  loginButton: string;
  registerButton: string;
  logoutButton: string;
  socialLoginOr: string;
  loginWithGoogle: string;
  loginWithApple: string;
  loginWithFacebook: string;
  loginWithDiscord: string;
  twoFactorAuth: string;
  enter2FACode: string;
  verify2FA: string;
  sendResetLink: string;
  resetPasswordTitle: string;
  enterVerificationCode: string;
  accountLockedTitle: string;
  accountLockedDesc: string;
  rateLimitWarning: string;
  guestNotice: string;

  // Session & Devices
  sessionManagement: string;
  activeDevices: string;
  currentDevice: string;
  revokeSession: string;
  revokeAllSessions: string;
  lastActive: string;
  ipAddress: string;

  // Characters
  characterSelectTitle: string;
  createCharacter: string;
  deleteCharacter: string;
  deleteConfirmationTitle: string;
  deleteConfirmationDesc: string;
  typeCharacterNameToConfirm: string;
  renameTicketTitle: string;
  useRenameTicket: string;
  newCharacterName: string;
  characterClass: string;
  level: string;
  stats: string;
  customizeAppearance: string;
  hairColor: string;
  outfitColor: string;
  weaponGlow: string;
  serverSelect: string;

  // Audio System
  audioSettingsTitle: string;
  masterVolume: string;
  musicVolume: string;
  ambientVolume: string;
  voiceVolume: string;
  uiVolume: string;
  currentZone: string;
  selectZone: string;
  musicStyle: string;
  ambientSounds: string;
  environmentalReverb: string;
  spatialAudio3D: string;
  dragPlayerToExplore: string;
  audioCrossfadeActive: string;

  // Audio Zones
  zoneLogin: string;
  zoneCharSelect: string;
  zoneVillage: string;
  zoneForest: string;
  zoneSnow: string;
  zoneDesert: string;
  zoneDungeon: string;
  zoneCastle: string;
  zoneBoss: string;
  zoneRaid: string;
  zonePvP: string;
  zoneGuild: string;
  zoneMarket: string;

  // Ambient Sounds
  ambBirds: string;
  ambWind: string;
  ambRiver: string;
  ambWaves: string;
  ambRain: string;
  ambThunder: string;
  ambFireplace: string;
  ambInsects: string;
  ambWaterfall: string;
  ambSnowWind: string;
  ambCaveEcho: string;
  ambCrickets: string;

  // Cloud Save
  cloudSaveTitle: string;
  syncStatus: string;
  synced: string;
  syncing: string;
  offlineMode: string;
  lastCloudBackup: string;
  forceBackupNow: string;
  conflictResolutionTitle: string;
  conflictResolutionDesc: string;
  serverSave: string;
  localSave: string;
  keepServerSave: string;
  keepLocalSave: string;

  // Security
  securityTitle: string;
  jwtTokenStatus: string;
  bcryptHashMethod: string;
  csrfProtected: string;
  rateLimitProtected: string;

  // General & Notifications
  saveSuccess: string;
  actionCancelled: string;
  close: string;
  confirm: string;
  cancel: string;
}
