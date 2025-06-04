import React from "react";

interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: (element?: HTMLElement) => void;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullscreenContext = React.createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  
  const toggleFullscreen = React.useCallback((element?: HTMLElement) => {
    if (!document.fullscreenElement) {
      // Si no hay elemento en pantalla completa, entrar en pantalla completa
      const targetElement = element || document.documentElement;
      if (targetElement.requestFullscreen) {
        targetElement.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error(`Error al intentar pantalla completa: ${err.message}`));
      }
    } else {
      // Si ya hay un elemento en pantalla completa, salir
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(`Error al salir de pantalla completa: ${err.message}`));
      }
    }
  }, []);
  
  // Detectar cambios en el estado de pantalla completa
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return (
    <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen, setIsFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = React.useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error("useFullscreen debe ser usado dentro de un FullscreenProvider");
  }
  return context;
};