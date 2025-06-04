import React from "react";
import { logError } from "../utils/error-handler";

interface CastingContextType {
  isCastAvailable: boolean;
  isCasting: boolean;
  startCasting: (url: string, title: string, image?: string) => void;
  stopCasting: () => void;
}

const CastingContext = React.createContext<CastingContextType | undefined>(undefined);

export const CastingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCastAvailable, setIsCastAvailable] = React.useState(false);
  const [isCasting, setIsCasting] = React.useState(false);
  
  // Comprobar si el navegador soporta Chromecast
  React.useEffect(() => {
    // Verificar si la API de Chrome Cast está disponible
    if (window.chrome && window.chrome.cast) {
      setIsCastAvailable(true);
    } else {
      // Intentar detectar si la API se cargará más tarde
      window.__onGCastApiAvailable = (isAvailable: boolean) => {
        setIsCastAvailable(isAvailable);
      };
    }
  }, []);
  
  // Función para iniciar la transmisión
  const startCasting = React.useCallback((url: string, title: string, image?: string) => {
    try {
      // Aquí iría la implementación real de Chromecast
      console.log(`Iniciando transmisión de: ${title}`);
      console.log(`URL: ${url}`);
      console.log(`Imagen: ${image || 'No disponible'}`);
      
      // Simulamos que la transmisión ha comenzado
      setIsCasting(true);
    } catch (error) {
      logError(error, "startCasting");
    }
  }, []);
  
  // Función para detener la transmisión
  const stopCasting = React.useCallback(() => {
    try {
      // Aquí iría la implementación real para detener Chromecast
      console.log("Deteniendo transmisión");
      
      // Simulamos que la transmisión ha terminado
      setIsCasting(false);
    } catch (error) {
      logError(error, "stopCasting");
    }
  }, []);
  
  return (
    <CastingContext.Provider value={{ isCastAvailable, isCasting, startCasting, stopCasting }}>
      {children}
    </CastingContext.Provider>
  );
};

export const useCasting = () => {
  const context = React.useContext(CastingContext);
  if (context === undefined) {
    throw new Error("useCasting debe ser usado dentro de un CastingProvider");
  }
  return context;
};

// Añadir la definición de window.__onGCastApiAvailable
declare global {
  interface Window {
    chrome?: {
      cast?: any;
    };
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
  }
}