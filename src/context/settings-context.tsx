import React from "react";
import { safeLocalStorage } from "../utils/error-handler";

interface SettingsContextType {
  showChannelNumbers: boolean;
  setShowChannelNumbers: (show: boolean) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  highQuality: boolean;
  setHighQuality: (highQuality: boolean) => void;
  subtitles: boolean;
  setSubtitles: (subtitles: boolean) => void;
  showAds: boolean;
  setShowAds: (showAds: boolean) => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

const defaultSettings = {
  showChannelNumbers: true,
  autoPlay: true,
  highQuality: true,
  subtitles: false,
  showAds: false,
  use24HourFormat: true, // Cambiado a true para usar formato 24h por defecto
  darkMode: true,
  notifications: true
};

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cargar configuraciones desde localStorage o usar valores predeterminados
  const loadSettings = () => {
    const savedSettings = safeLocalStorage.getItem('settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Error parsing settings:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  };
  
  const [settings, setSettings] = React.useState(loadSettings);
  
  // Guardar configuraciones en localStorage cuando cambien
  React.useEffect(() => {
    safeLocalStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  
  const setShowChannelNumbers = (show: boolean) => {
    setSettings(prev => ({ ...prev, showChannelNumbers: show }));
  };
  
  const setAutoPlay = (autoPlay: boolean) => {
    setSettings(prev => ({ ...prev, autoPlay }));
  };
  
  const setHighQuality = (highQuality: boolean) => {
    setSettings(prev => ({ ...prev, highQuality }));
  };
  
  const setSubtitles = (subtitles: boolean) => {
    setSettings(prev => ({ ...prev, subtitles }));
  };
  
  const setShowAds = (showAds: boolean) => {
    setSettings(prev => ({ ...prev, showAds }));
  };
  
  // Añadir funciones para manejar el formato de hora, modo oscuro y notificaciones
  const toggleTimeFormat = () => {
    setSettings(prev => ({ ...prev, use24HourFormat: !prev.use24HourFormat }));
  };
  
  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };
  
  const setNotifications = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, notifications: enabled }));
  };
  
  const value = {
    ...settings,
    setShowChannelNumbers,
    setAutoPlay,
    setHighQuality,
    setSubtitles,
    setShowAds,
    toggleTimeFormat,
    toggleDarkMode,
    setNotifications
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};