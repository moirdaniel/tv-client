// Configuración general de la aplicación

// Configuración de la API
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://57.129.25.40:3001/api",
  useLocalData: import.meta.env.VITE_USE_LOCAL_DATA === "true",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  endpoints: {
    channels: "/channels",
    epg: "/epg",
    programs: "/programs"
  }
};

// Configuración de características
export const FEATURES = {
  movies: import.meta.env.VITE_FEATURE_MOVIES === "true",
  music: import.meta.env.VITE_FEATURE_MUSIC === "true",
  news: import.meta.env.VITE_FEATURE_NEWS === "true",
  weather: import.meta.env.VITE_FEATURE_WEATHER === "true",
  favorites: import.meta.env.VITE_FEATURE_FAVORITES === "true",
  history: import.meta.env.VITE_FEATURE_HISTORY === "true",
  search: import.meta.env.VITE_FEATURE_SEARCH === "true"
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  enabled: import.meta.env.VITE_AUTH_ENABLED === "true",
  defaultUser: import.meta.env.VITE_DEFAULT_USER || "guest",
  defaultPassword: import.meta.env.VITE_DEFAULT_PASSWORD || "guest"
};

// Configuración de publicidad
export const ADS_CONFIG = {
  enabled: import.meta.env.VITE_ADS_ENABLED === "true",
  provider: import.meta.env.VITE_ADS_PROVIDER || "local",
  refreshRate: Number(import.meta.env.VITE_ADS_REFRESH_RATE || 300000)
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "Sitelco.TV",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  description: import.meta.env.VITE_APP_DESCRIPTION || "Aplicación de streaming de TV en vivo"
};

// Configuración de analíticas
export const ANALYTICS_CONFIG = {
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
  provider: import.meta.env.VITE_ANALYTICS_PROVIDER || "none"
};