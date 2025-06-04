import React from "react";
import { safeLocalStorage } from "../utils/error-handler";

interface SettingsContextType {
  showChannelNumbers: boolean;
  setShowChannelNumbers: (value: boolean) => void;
  use24HourFormat: boolean;
  setUse24HourFormat: (value: boolean) => void;
  showClock: boolean;
  setShowClock: (value: boolean) => void;
  enableKeyboardNavigation: boolean;
  setEnableKeyboardNavigation: (value: boolean) => void;
  useLocalData: boolean;
  setUseLocalData: (value: boolean) => void;
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

const SETTINGS_KEYS = {
  SHOW_CHANNEL_NUMBERS: 'settings_show_channel_numbers',
  AUTO_PLAY: 'settings_auto_play',
  HIGH_QUALITY: 'settings_high_quality',
  SUBTITLES: 'settings_subtitles',
  SHOW_ADS: 'settings_show_ads',
  USE_24_HOUR_FORMAT: 'settings_use_24_hour_format',
  DARK_MODE: 'settings_dark_mode',
  NOTIFICATIONS: 'settings_notifications'
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
  
  // Añadir estado para controlar el uso de datos locales vs API
  const [useLocalData, setUseLocalData] = React.useState<boolean>(() => {
    try {
      const savedValue = safeLocalStorage.getItem('useLocalData');
      // Si no hay valor guardado, usar el valor de la variable de ambiente
      if (savedValue === null) {
        return import.meta.env.VITE_USE_LOCAL_DATA === "true";
      }
      return savedValue === 'true';
    } catch (error) {
      console.error('Error loading useLocalData setting:', error);
      return import.meta.env.VITE_USE_LOCAL_DATA === "true";
    }
  });
  
  // Guardar la configuración de datos locales en localStorage
  React.useEffect(() => {
    try {
      safeLocalStorage.setItem('useLocalData', useLocalData.toString());
    } catch (error) {
      console.error('Error saving useLocalData setting:', error);
    }
  }, [useLocalData]);
  
  // Eliminar estas funciones duplicadas ya que están en el objeto settings
  // const setShowChannelNumbers = (show: boolean) => {
  //   setSettings(prev => ({ ...prev, showChannelNumbers: show }));
  // };
  
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
  
  // Eliminar esta duplicación - ya existe en el objeto settings
  // const [showChannelNumbers, setShowChannelNumbers] = React.useState(() => 
  //   safeLocalStorage.getItem(SETTINGS_KEYS.SHOW_CHANNEL_NUMBERS, 'true') === 'true'
  // );
  
  const toggleChannelNumbers = () => {
    // Modificar para usar el estado settings en lugar del estado duplicado
    setSettings(prev => ({ ...prev, showChannelNumbers: !prev.showChannelNumbers }));
  };
  
  const value = {
    ...settings,
    // Eliminar setShowChannelNumbers ya que no se usa directamente
    setAutoPlay,
    setHighQuality,
    setSubtitles,
    setShowAds,
    toggleTimeFormat,
    toggleDarkMode,
    setNotifications,
    // Usar showChannelNumbers desde settings
    toggleChannelNumbers
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