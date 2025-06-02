import React from "react";
import { Card } from "@heroui/react";
import { ADS_CONFIG } from "../config/app-config";

interface AdBannerProps {
  placement: 'player' | 'sidebar' | 'header';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ placement, className = "" }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Simular carga de anuncio
  React.useEffect(() => {
    if (!ADS_CONFIG.enabled) return;
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Si los anuncios están desactivados, no mostrar nada
  if (!ADS_CONFIG.enabled) {
    return null;
  }
  
  // Determinar tamaño según ubicación
  let height = "h-16";
  let content = "Espacio publicitario";
  
  switch (placement) {
    case 'player':
      height = "h-20";
      content = "Publicidad";
      break;
    case 'sidebar':
      height = "h-24";
      content = "Anuncio";
      break;
    case 'header':
      height = "h-12";
      content = "Publicidad";
      break;
  }
  
  return (
    <Card className={`${height} w-full flex items-center justify-center bg-gray-900/50 ${className}`}>
      {isLoaded ? (
        <div className="text-center text-gray-400">
          <p>{content}</p>
          <p className="text-xs">Espacio reservado para publicidad</p>
        </div>
      ) : (
        <div className="animate-pulse text-gray-500">Cargando anuncio...</div>
      )}
    </Card>
  );
};

export default AdBanner;
