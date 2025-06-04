import React from "react";

interface KeyboardNavigationContextType {
  activeSection: 'sidebar' | 'channelList' | 'videoPlayer';
  setActiveSection: React.Dispatch<React.SetStateAction<'sidebar' | 'channelList' | 'videoPlayer'>>;
  isKeyboardNavigationEnabled: boolean;
  setKeyboardNavigationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  registerVolumeControl: (callback: (volumeChange: number) => void) => ((volumeChange: number) => void);
  registerMuteToggle: (callback: () => void) => (() => void);
  registerFullscreenToggle: (callback: () => void) => (() => void);
  registerChannelChange: (callback: (direction: number) => void) => ((direction: number) => void);
  registerCategoryChange: (callback: (direction: number) => void) => ((direction: number) => void);
  registerMenuToggle: (callback: () => void) => (() => void);
  registerHelpToggle: (callback: () => void) => (() => void);
  registerSearchInput: (ref: HTMLInputElement | null) => (HTMLInputElement | null);
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const KeyboardNavigationContext = React.createContext<KeyboardNavigationContextType | undefined>(undefined);

export const KeyboardNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = React.useState<'sidebar' | 'channelList' | 'videoPlayer'>('sidebar');
  const [isKeyboardNavigationEnabled, setKeyboardNavigationEnabled] = React.useState<boolean>(true);
  
  // Asegurarnos de que todas las refs estén inicializadas correctamente
  const volumeControlRef = React.useRef<(volumeChange: number) => void>(() => {});
  const muteToggleRef = React.useRef<() => void>(() => {});
  const fullscreenToggleRef = React.useRef<() => void>(() => {});
  const channelChangeRef = React.useRef<(direction: number) => void>(() => {});
  const categoryChangeRef = React.useRef<(direction: number) => void>(() => {});
  const menuToggleRef = React.useRef<() => void>(() => {});
  const helpToggleRef = React.useRef<() => void>(() => {});
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  
  // Asegurarnos de que todas las funciones de registro estén correctamente definidas
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
  
  const registerMenuToggle = React.useCallback((callback: () => void) => {
    menuToggleRef.current = callback;
  }, []);
  
  const registerHelpToggle = React.useCallback((callback: () => void) => {
    helpToggleRef.current = callback;
  }, []);
  
  const registerSearchInput = React.useCallback((ref: HTMLInputElement | null) => {
    searchInputRef.current = ref;
  }, []);
  
  // Manejar eventos de teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verificar si el elemento activo es un input para evitar conflictos
      if (document.activeElement && isInputElement(document.activeElement)) {
        return;
      }
      
      if (!isKeyboardNavigationEnabled) return;
      
      // Evitar que las teclas de flecha hagan scroll
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (activeSection === 'sidebar') {
            categoryChangeRef.current(-1);
          } else if (activeSection === 'channelList') {
            channelChangeRef.current(-1);
          } else if (activeSection === 'videoPlayer') {
            // En el reproductor, flecha arriba cambia canal hacia atrás
            channelChangeRef.current(-1);
          }
          break;
        case 'ArrowDown':
          if (activeSection === 'sidebar') {
            categoryChangeRef.current(1);
          } else if (activeSection === 'channelList') {
            channelChangeRef.current(1);
          } else if (activeSection === 'videoPlayer') {
            // En el reproductor, flecha abajo cambia canal hacia adelante
            channelChangeRef.current(1);
          }
          break;
        case 'ArrowLeft':
          // Navegación entre secciones con flecha izquierda
          if (activeSection === 'channelList') {
            setActiveSection('sidebar');
          } else if (activeSection === 'videoPlayer') {
            setActiveSection('channelList');
          } else if (activeSection === 'sidebar') {
            // Si ya estamos en sidebar, controlar volumen
            volumeControlRef.current(-0.1);
          }
          break;
        case 'ArrowRight':
          // Navegación entre secciones con flecha derecha
          if (activeSection === 'sidebar') {
            setActiveSection('channelList');
          } else if (activeSection === 'channelList') {
            setActiveSection('videoPlayer');
          } else if (activeSection === 'videoPlayer') {
            // Si ya estamos en videoPlayer, controlar volumen
            volumeControlRef.current(0.1);
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
        case '/':
          if (searchInputRef.current) {
            e.preventDefault();
            searchInputRef.current.focus();
          }
          break;
        case 'h':
        case 'H':
          helpToggleRef.current();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isKeyboardNavigationEnabled, activeSection, setActiveSection]);
  
  // Asegurarse de que todas las funciones estén incluidas en el valor del contexto
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
    registerMenuToggle,
    registerHelpToggle,
    registerSearchInput,
    searchInputRef
  }), [
    activeSection, 
    setActiveSection, 
    isKeyboardNavigationEnabled, 
    setKeyboardNavigationEnabled,
    registerVolumeControl,
    registerMuteToggle,
    registerFullscreenToggle,
    registerChannelChange,
    registerCategoryChange,
    registerMenuToggle,
    registerHelpToggle,
    registerSearchInput
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