import React from "react";

interface CastingContextType {
  isCastAvailable: boolean;
  isCasting: boolean;
  startCasting: (mediaUrl: string, title?: string, posterUrl?: string) => void;
  stopCasting: () => void;
}

const CastingContext = React.createContext<CastingContextType | undefined>(undefined);

export const CastingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCastAvailable, setIsCastAvailable] = React.useState(false);
  const [isCasting, setIsCasting] = React.useState(false);
  const [castSession, setCastSession] = React.useState<any>(null);

  // Simulación de disponibilidad de casting
  React.useEffect(() => {
    // En una implementación real, aquí verificaríamos si el API de Google Cast está disponible
    // y si hay dispositivos disponibles para transmitir
    const checkCastAvailability = () => {
      // Simulamos que el casting está disponible
      setIsCastAvailable(true);
      console.log("Casting availability checked: available");
    };

    // Simular un pequeño retraso para la detección
    const timer = setTimeout(checkCastAvailability, 2000);
    return () => clearTimeout(timer);
  }, []);

  const startCasting = React.useCallback((mediaUrl: string, title?: string, posterUrl?: string) => {
    try {
      // En una implementación real, aquí iniciaríamos la sesión de casting
      // usando la API de Google Cast
      console.log(`Starting cast session for: ${title || mediaUrl}`);
      
      // Simulamos una sesión de casting exitosa
      setIsCasting(true);
      setCastSession({
        mediaUrl,
        title,
        posterUrl,
        startTime: new Date().toISOString()
      });
      
      // Mostrar mensaje de éxito
      console.log("Cast session started successfully");
    } catch (error) {
      console.error("Error starting cast session:", error);
    }
  }, []);

  const stopCasting = React.useCallback(() => {
    try {
      // En una implementación real, aquí detendríamos la sesión de casting
      console.log("Stopping cast session");
      
      // Simulamos detener la sesión
      setIsCasting(false);
      setCastSession(null);
      
      console.log("Cast session stopped successfully");
    } catch (error) {
      console.error("Error stopping cast session:", error);
    }
  }, []);

  const value = React.useMemo(() => ({
    isCastAvailable,
    isCasting,
    startCasting,
    stopCasting
  }), [isCastAvailable, isCasting, startCasting, stopCasting]);

  return (
    <CastingContext.Provider value={value}>
      {children}
    </CastingContext.Provider>
  );
};

export const useCasting = () => {
  const context = React.useContext(CastingContext);
  if (context === undefined) {
    throw new Error('useCasting must be used within a CastingProvider');
  }
  return context;
};