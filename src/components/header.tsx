import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { safeLocalStorage } from "../utils/error-handler";
import { WeatherData, fetchWeatherData, getCurrentPosition } from "../services/weather-service";
import { useSettings } from "../context/settings-context";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import Settings from "./settings";
import { safeFormatTime } from "../utils/error-handler";
import { useAuth } from "../context/auth-context";

const Header: React.FC = () => {
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = React.useState<string | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [showSettings, setShowSettings] = React.useState(false);
  const { use24HourFormat, toggleTimeFormat } = useSettings();
  const { user, logout, loginAsGuest } = useAuth();
  
  // Cargar datos del clima
  React.useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setIsLoadingWeather(true);
        
        // Intentar cargar datos guardados primero
        const savedWeatherData = safeLocalStorage.getItem('weatherData');
        const savedTimestamp = safeLocalStorage.getItem('weatherTimestamp');
        
        // Verificar si los datos guardados son recientes (menos de 30 minutos)
        if (savedWeatherData && savedTimestamp) {
          const timestamp = parseInt(savedTimestamp, 10);
          const now = Date.now();
          
          if (now - timestamp < 30 * 60 * 1000) {
            // Usar datos guardados si son recientes
            const parsedData = JSON.parse(savedWeatherData);
            setWeatherData(parsedData);
            setIsLoadingWeather(false);
            return;
          }
        }
        
        // Si no hay datos guardados o son antiguos, obtener nuevos datos
        const position = await getCurrentPosition();
        const data = await fetchWeatherData(
          position.coords.latitude,
          position.coords.longitude
        );
        
        // Guardar los nuevos datos
        setWeatherData(data);
        safeLocalStorage.setItem('weatherData', JSON.stringify(data));
        safeLocalStorage.setItem('weatherTimestamp', Date.now().toString());
      } catch (error) {
        console.error("Error loading weather data:", error);
        setWeatherError("No se pudo cargar la información del clima");
      } finally {
        setIsLoadingWeather(false);
      }
    };
    
    loadWeatherData();
  }, []);
  
  // Actualizar la hora actual cada minuto
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto
    
    return () => clearInterval(timer);
  }, []);
  
  // Formatear la hora según el formato seleccionado (12h o 24h)
  // Añadir manejo de errores
  const formattedTime = React.useMemo(() => {
    return safeFormatTime(currentTime, use24HourFormat, 'Header.formattedTime');
  }, [currentTime, use24HourFormat]);
  
  const month = currentTime.toLocaleString('es', { month: 'long' });
  const day = currentTime.getDate();
  const year = currentTime.getFullYear();

  return (
    <header className="bg-background h-16 flex items-center justify-between px-4 border-b border-gray-800">
      <div className="flex items-center">
        <button className="mr-4 text-white">
          <Icon icon="lucide:chevron-left" width={24} height={24} />
        </button>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">MT Media</h1>
        </div>
        <div className="h-8 w-[1px] bg-gray-700 mx-4"></div>
        <span className="text-xl">TV En Vivo</span>
      </div>
      
      <div className="flex items-center">
        {isLoadingWeather ? (
          <div className="flex items-center mr-4">
            <Icon icon="lucide:loader" className="animate-spin mr-1" width={16} height={16} />
            <span className="text-sm">Cargando clima...</span>
          </div>
        ) : weatherData ? (
          <div className="flex items-center mr-4">
            <Icon icon={weatherData.icon} className="text-white mr-1" width={20} height={20} />
            <span className="text-lg font-medium">{weatherData.temperature}°C</span>
            <span className="text-sm text-gray-400 ml-1">{weatherData.location}</span>
          </div>
        ) : null}
        
        <span className="text-xl mr-2">
          {formattedTime}
        </span>
        <span className="text-xl mr-4">
          {`${month} ${day}, ${year}`}
        </span>
        
        {/* Añadir información del usuario en el header */}
        <div className="flex items-center mr-4">
          <Button 
            variant="light" 
            className="text-white flex items-center"
            endContent={<Icon icon="lucide:chevron-down" width={16} height={16} />}
          >
            <Icon icon="lucide:user" className="mr-2" width={16} height={16} />
            <span>{user?.displayName || 'Invitado'}</span>
          </Button>
        </div>
        
        <div className="flex ml-2">
          <Dropdown>
            <DropdownTrigger>
              <Button 
                isIconOnly
                variant="light"
                className="text-white"
              >
                <Icon icon="lucide:more-vertical" width={24} height={24} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Opciones">
              <DropdownItem 
                key="time-format" 
                startContent={
                  <Icon 
                    icon={use24HourFormat ? "lucide:clock-24" : "lucide:clock"} 
                    width={18} 
                    height={18} 
                  />
                }
                description={use24HourFormat ? "Cambiar a formato 12 horas" : "Cambiar a formato 24 horas"}
                onPress={toggleTimeFormat}
              >
                Formato de hora: {use24HourFormat ? "24h" : "12h"}
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                startContent={<Icon icon="lucide:settings" width={18} height={18} />}
                description="Configuración de la aplicación"
                onPress={() => setShowSettings(true)}
              >
                Configuración
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      
      {/* Modal de configuración */}
      <Settings isOpen={showSettings} onOpenChange={setShowSettings} />
    </header>
  );
};

export default Header;