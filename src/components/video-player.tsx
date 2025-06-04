import React from "react";
import ReactPlayer from "react-player";
import { useChannelContext } from "../context/channel-context";
import { useSettings } from "../context/settings-context";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useKeyboardNavigation } from "./keyboard-navigation";
import { useFullscreen } from "./fullscreen-provider";
import { useCasting } from "./casting-provider";
import { handleTimeError, safeFormatTime } from "../utils/error-handler";

const VideoPlayer: React.FC = () => {
  const { selectedChannel, orientation, channels, setSelectedChannel } = useChannelContext();
  const { showAds, autoPlay, highQuality, subtitles, use24HourFormat } = useSettings();
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [volume, setVolume] = React.useState(0.8);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showControls, setShowControls] = React.useState(false);
  const { isFullscreen, toggleFullscreen, setIsFullscreen } = useFullscreen();
  const { isCastAvailable, isCasting, startCasting, stopCasting } = useCasting();
  const videoContainerRef = React.useRef<HTMLDivElement>(null);
  const controlsTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  
  const { 
    registerVolumeControl, 
    registerMuteToggle, 
    registerFullscreenToggle, 
    registerChannelChange,
    activeSection 
  } = useKeyboardNavigation();
  
  // Registrar funciones de control
  React.useEffect(() => {
    registerVolumeControl((volumeChange: number) => {
      setVolume(prev => {
        const newVolume = Math.min(1, Math.max(0, prev + volumeChange));
        if (newVolume > 0 && isMuted) {
          setIsMuted(false);
        }
        return newVolume;
      });
    });
    
    registerMuteToggle(() => {
      setIsMuted(prev => !prev);
    });
    
    registerFullscreenToggle(() => {
      handleToggleFullscreen();
    });
  }, [registerVolumeControl, registerMuteToggle, registerFullscreenToggle, isMuted]);
  
  // Añadir función para cambiar de canal
  const changeChannel = (direction: number) => {
    if (!selectedChannel || channels.length === 0) return;
    
    const currentIndex = channels.findIndex(c => c._id === selectedChannel._id);
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex + direction;
    
    // Circular navigation
    if (newIndex < 0) newIndex = channels.length - 1;
    if (newIndex >= channels.length) newIndex = 0;
    
    setSelectedChannel(channels[newIndex]);
  };
  
  // Añadir función para controlar el volumen
  const handleVolumeChange = (change: number) => {
    setVolume(prev => {
      const newVolume = Math.min(1, Math.max(0, prev + change));
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
      return newVolume;
    });
  };
  
  // Añadir función para silenciar/activar el sonido
  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  // Función para mostrar/ocultar controles
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };
  
  // Detectar cambios en el estado de pantalla completa
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      // Usar la función del contexto en lugar de una función local
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreen]);
  
  // Aplicar configuración de reproducción automática
  React.useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay, selectedChannel]);
  
  // Actualizar la hora actual cada minuto
  React.useEffect(() => {
    // Inicializar la hora actual
    setCurrentTime(new Date());
    
    // Configurar el intervalo para actualizar cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []);
  
  // Reemplazar la función formatTime con la versión segura
  const formatTime = (date: Date) => {
    try {
      return safeFormatTime(date, use24HourFormat, 'VideoPlayer.formatTime');
    } catch (error) {
      // En caso de error, usar formato 24h como fallback
      return safeFormatTime(new Date(), true, 'VideoPlayer.formatTime.fallback');
    }
  };
  
  // Calcular hora de inicio y fin para la programación de manera segura
  const startTime = React.useMemo(() => {
    try {
      return new Date(currentTime);
    } catch (error) {
      return handleTimeError(error, 'VideoPlayer.startTime');
    }
  }, [currentTime]);
  
  const endTime = React.useMemo(() => {
    try {
      const end = new Date(currentTime);
      end.setHours(end.getHours() + 1);
      return end;
    } catch (error) {
      const fallback = new Date();
      fallback.setHours(fallback.getHours() + 1);
      return handleTimeError(error, 'VideoPlayer.endTime');
    }
  }, [currentTime]);
  
  // Registrar función para cambiar de canal
  React.useEffect(() => {
    registerChannelChange((direction: number) => {
      changeChannel(direction);
    });
  }, [registerChannelChange, channels, selectedChannel, setSelectedChannel]);
  
  // Optimizar para pantalla completa en dispositivos móviles
  React.useEffect(() => {
    // Detectar si es un dispositivo móvil
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Si es un dispositivo móvil y está en modo landscape, intentar pantalla completa automáticamente
    if (isMobileDevice && orientation === 'landscape' && !isFullscreen) {
      // Esperar un momento para que el usuario interactúe primero (los navegadores requieren interacción)
      const autoFullscreenTimeout = setTimeout(() => {
        // Mostrar un mensaje sugiriendo pantalla completa
        const shouldAutoFullscreen = localStorage.getItem('autoFullscreen') !== 'false';
        
        if (shouldAutoFullscreen) {
          // Intentar entrar en pantalla completa después de una interacción del usuario
          const handleUserInteraction = () => {
            handleToggleFullscreen();
            document.removeEventListener('click', handleUserInteraction);
          };
          
          document.addEventListener('click', handleUserInteraction, { once: true });
        }
      }, 3000);
      
      return () => clearTimeout(autoFullscreenTimeout);
    }
  }, [orientation, isFullscreen]);
  
  // Add casting toggle function
  const handleCastToggle = () => {
    if (isCasting) {
      stopCasting();
    } else if (selectedChannel) {
      startCasting(selectedChannel.url, selectedChannel.name, selectedChannel.logoUrl);
    }
  };
  
  // Corregir la función toggleFullscreen para usar correctamente el ref del contenedor
  const handleToggleFullscreen = () => {
    if (videoContainerRef.current) {
      toggleFullscreen(videoContainerRef.current);
    } else {
      toggleFullscreen();
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div 
        ref={videoContainerRef}
        className={`video-player-container relative ${orientation === 'portrait' ? 'h-full' : 'flex-1'} ${isFullscreen ? 'bg-black w-screen h-screen z-50' : ''} ${activeSection === 'videoPlayer' ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {selectedChannel ? (
          <ReactPlayer
            url={selectedChannel.url}
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            width="100%"
            height="100%"
            controls={false}
            config={{
              file: {
                forceHLS: true,
                attributes: {
                  quality: highQuality ? 'high' : 'medium',
                  crossOrigin: 'anonymous',
                  playsInline: true, // Añadir para mejor soporte en iOS
                }
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-gray-400">Seleccione un canal para ver</p>
          </div>
        )}
        
        {/* Añadir indicador de orientación cuando esté en modo portrait */}
        {orientation === 'portrait' && !isFullscreen && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-full p-2 animate-pulse">
            <Icon icon="lucide:smartphone-rotate" width={24} height={24} className="text-white" />
          </div>
        )}
        
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-4">
            <div className="flex flex-wrap justify-center items-center gap-4 px-2">
              <div className="flex flex-col items-center">
                <button 
                  className="text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => changeChannel(-1)}
                  title="Canal anterior"
                >
                  <Icon icon="lucide:chevron-up" width={24} height={24} />
                </button>
                <span className="text-xs text-white">Anterior</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  className="text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => changeChannel(1)}
                  title="Canal siguiente"
                >
                  <Icon icon="lucide:chevron-down" width={24} height={24} />
                </button>
                <span className="text-xs text-white">Siguiente</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  className="text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => handleVolumeChange(-0.1)}
                  title="Bajar volumen"
                >
                  <Icon icon="lucide:volume-1" width={24} height={24} />
                </button>
                <span className="text-xs text-white text-center">Volumen -</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  className="text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => handleToggleMute()}
                  title={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  <Icon 
                    icon={isMuted ? "lucide:volume-x" : "lucide:volume-2"} 
                    width={24} 
                    height={24} 
                  />
                </button>
                <span className="text-xs text-white text-center">Silenciar</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  className="text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => handleVolumeChange(0.1)}
                  title="Subir volumen"
                >
                  <Icon icon="lucide:volume-2" width={24} height={24} />
                </button>
                <span className="text-xs text-white text-center">Volumen +</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  className="text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={handleToggleFullscreen}
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  <Icon 
                    icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"} 
                    width={24} 
                    height={24} 
                  />
                </button>
                <span className="text-xs text-white text-center">
                  {isFullscreen ? "Minimizar" : "Maximizar"}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  className={`text-white mb-1 p-2 hover:bg-white/10 rounded-full transition-colors ${!isCastAvailable && !isCasting ? 'opacity-50' : ''}`}
                  onClick={handleCastToggle}
                  disabled={!isCastAvailable && !isCasting}
                  title={isCasting ? "Detener transmisión" : "Transmitir a dispositivo"}
                >
                  <Icon 
                    icon={isCasting ? "lucide:cast-connected" : "lucide:cast"} 
                    width={24} 
                    height={24} 
                  />
                </button>
                <span className="text-xs text-white text-center">Transmitir</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-black p-4">
        <div className="text-white">
          <div className="flex justify-between mb-2">
            <span className="text-lg">
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
            <span className="text-lg">Programa en vivo</span>
          </div>
          <p className="text-gray-400">Transmisión en directo del contenido seleccionado.</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;