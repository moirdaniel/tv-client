import React from "react";

interface KeyboardNavigationContextType {
  activeSection: 'sidebar' | 'channelList' | 'videoPlayer';
  setActiveSection: (section: 'sidebar' | 'channelList' | 'videoPlayer') => void;
  isKeyboardNavigationEnabled: boolean;
  setKeyboardNavigationEnabled: (enabled: boolean) => void;
  registerVolumeControl: (callback: (volumeChange: number) => void) => void;
  registerMuteToggle: (callback: () => void) => void;
  registerFullscreenToggle: (callback: () => void) => void;
  registerChannelChange: (callback: (direction: number) => void) => void;
  registerCategoryChange: (callback: (direction: number) => void) => void;
  keyboardNavigation: any;
}

const KeyboardNavigationContext = React.createContext<KeyboardNavigationContextType | undefined>(undefined);

export const KeyboardNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = React.useState<'sidebar' | 'channelList' | 'videoPlayer'>('sidebar');
  const [isKeyboardNavigationEnabled, setKeyboardNavigationEnabled] = React.useState<boolean>(true);
  
  const volumeControlRef = React.useRef<(volumeChange: number) => void>(() => {});
  const muteToggleRef = React.useRef<() => void>(() => {});
  const fullscreenToggleRef = React.useRef<() => void>(() => {});
  const channelChangeRef = React.useRef<(direction: number) => void>(() => {});
  const categoryChangeRef = React.useRef<(direction: number) => void>(() => {});
  
  // Manejar eventos de teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isKeyboardNavigationEnabled) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault(); // Prevenir scroll
          if (activeSection === 'sidebar') {
            categoryChangeRef.current(-1);
          } else if (activeSection === 'channelList') {
            channelChangeRef.current(-1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault(); // Prevenir scroll
          if (activeSection === 'sidebar') {
            categoryChangeRef.current(1);
          } else if (activeSection === 'channelList') {
            channelChangeRef.current(1);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (activeSection === 'channelList') {
            setActiveSection('sidebar');
          } else if (activeSection === 'videoPlayer') {
            setActiveSection('channelList');
          } else if (activeSection === 'sidebar') {
            volumeControlRef.current(-0.1); // Si ya estamos en sidebar, controlar volumen
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (activeSection === 'sidebar') {
            setActiveSection('channelList');
          } else if (activeSection === 'channelList') {
            setActiveSection('videoPlayer');
          } else if (activeSection === 'videoPlayer') {
            volumeControlRef.current(0.1); // Si ya estamos en videoPlayer, controlar volumen
          }
          break;
        case 'm':
        case 'M':
          muteToggleRef.current();
          break;
        case 'f':
        case 'F':
          fullscreenToggleRef.current();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isKeyboardNavigationEnabled, activeSection]);
  
  const registerVolumeControl = React.useCallback((callback: (volumeChange: number) => void) => {
    volumeControlRef.current = callback;
  }, []);
  
  const registerMuteToggle = React.useCallback((callback: () => void) => {
    muteToggleRef.current = callback;
  }, []);
  
  const registerFullscreenToggle = React.useCallback((callback: () => void) => {
    fullscreenToggleRef.current = callback;
  }, []);
  
  const registerChannelChange = React.useCallback((callback: (direction: number) => void) => {
    channelChangeRef.current = callback;
  }, []);
  
  const registerCategoryChange = React.useCallback((callback: (direction: number) => void) => {
    categoryChangeRef.current = callback;
  }, []);
  
  const value = React.useMemo(() => ({
    activeSection,
    setActiveSection,
    isKeyboardNavigationEnabled,
    setKeyboardNavigationEnabled,
    registerVolumeControl,
    registerMuteToggle,
    registerFullscreenToggle,
    registerChannelChange,
    registerCategoryChange,
    keyboardNavigation: {
      registerChannelChange,
      registerCategoryChange
    }
  }), [
    activeSection, 
    isKeyboardNavigationEnabled, 
    registerVolumeControl, 
    registerMuteToggle, 
    registerFullscreenToggle,
    registerChannelChange,
    registerCategoryChange
  ]);
  
  return (
    <KeyboardNavigationContext.Provider value={value}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};

export const useKeyboardNavigation = () => {
  const context = React.useContext(KeyboardNavigationContext);
  if (context === undefined) {
    throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationProvider');
  }
  return context;
};