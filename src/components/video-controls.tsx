import React from "react";
import { Icon } from "@iconify/react";
import { Slider } from "@heroui/react";

interface VideoControlsProps {
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onVolumeChange: (change: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onChannelChange?: (direction: number) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  volume,
  isMuted,
  isFullscreen,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onChannelChange
}) => {
  const [showControls, setShowControls] = React.useState(false);
  const [controlsTimeout, setControlsTimeout] = React.useState<NodeJS.Timeout | null>(null);

  // Mostrar controles al mover el ratón y ocultarlos después de un tiempo
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  // Limpiar el timeout al desmontar
  React.useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return (
    <div 
      className="absolute inset-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
    >
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center flex-wrap gap-2">
              <button 
                onClick={() => onToggleMute()}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? (
                  <Icon icon="lucide:volume-x" width={24} height={24} />
                ) : (
                  <Icon icon="lucide:volume-2" width={24} height={24} />
                )}
              </button>
              
              <div className="flex items-center ml-2 w-24 min-w-[6rem]">
                <Slider
                  aria-label="Volumen"
                  size="sm"
                  color="foreground"
                  value={volume * 100}
                  onChange={(value) => {
                    const newVolume = (Array.isArray(value) ? value[0] : value) / 100;
                    onVolumeChange(newVolume - volume);
                  }}
                  className="max-w-md"
                  classNames={{
                    base: "max-w-md",
                    track: "bg-white/30",
                    filler: "bg-white"
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center flex-wrap gap-2">
              {onChannelChange && (
                <>
                  <button 
                    onClick={() => onChannelChange(-1)}
                    className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Canal anterior"
                  >
                    <Icon icon="lucide:chevron-up" width={24} height={24} />
                  </button>
                  <button 
                    onClick={() => onChannelChange(1)}
                    className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Canal siguiente"
                  >
                    <Icon icon="lucide:chevron-down" width={24} height={24} />
                  </button>
                </>
              )}
              
              <button 
                onClick={onToggleFullscreen}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? (
                  <Icon icon="lucide:minimize" width={24} height={24} />
                ) : (
                  <Icon icon="lucide:maximize" width={24} height={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoControls;