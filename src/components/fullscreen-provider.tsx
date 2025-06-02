import React from "react";

interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: (element?: HTMLElement | null) => void;
  exitFullscreen: () => void;
}

const FullscreenContext = React.createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const targetRef = React.useRef<HTMLElement | null>(null);

  // Detectar cambios en el estado de pantalla completa
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = React.useCallback((element?: HTMLElement | null) => {
    try {
      const target = element || targetRef.current || document.documentElement;
      targetRef.current = target;
      
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if ((target as any).webkitRequestFullscreen) {
        (target as any).webkitRequestFullscreen();
      } else if ((target as any).mozRequestFullScreen) {
        (target as any).mozRequestFullScreen();
      } else if ((target as any).msRequestFullscreen) {
        (target as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }, []);

  const exitFullscreen = React.useCallback(() => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = React.useCallback((element?: HTMLElement | null) => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen(element);
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  const value = React.useMemo(() => ({
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen
  }), [isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen]);

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = React.useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};