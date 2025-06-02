// Crear archivo de configuración
export const APP_INFO = {
  name: "MT Media TV",
  version: "1.0.0",
  description: "Aplicación de streaming de TV en vivo",
  developer: "MT Media",
  website: "https://mtmedia.tv"
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  enabled: false, // Desactivar autenticación por defecto
  defaultUser: 'admin',
  defaultPassword: 'admin123'
};

// Configuración de publicidad
export const ADS_CONFIG = {
  enabled: false, // Desactivar publicidad por defecto
  refreshInterval: 300, // 5 minutos
  positions: ['player', 'sidebar', 'banner']
};

// Configuración de API
export const API_CONFIG = {
  baseUrl: 'https://api.mtmedia.tv',
  timeout: 10000, // 10 segundos
  retries: 3,
  endpoints: {
    channels: '/channels',
    epg: '/epg',
    auth: '/auth'
  }
};

// Configuración de reproductor
export const PLAYER_CONFIG = {
  autoPlay: true,
  muted: false,
  defaultVolume: 0.8,
  bufferTime: 5, // segundos
  qualityLevels: ['auto', 'high', 'medium', 'low']
};