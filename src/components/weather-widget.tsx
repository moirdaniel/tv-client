import React from "react";
import { Icon } from "@iconify/react";
import { Spinner, Tooltip } from "@heroui/react";
import { logError, logWarning } from "../utils/error-handler";

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

// Variable de entorno para controlar la visibilidad del widget
const WEATHER_WIDGET_ENABLED = import.meta.env.VITE_WEATHER_WIDGET_ENABLED === "true";

const WeatherWidget: React.FC = () => {
  // Si el widget está desactivado, no renderizar nada
  if (!WEATHER_WIDGET_ENABLED) {
    return null;
  }

  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Simular datos de clima para evitar errores de API
        setTimeout(() => {
          setWeather({
            temperature: 22,
            condition: "Soleado",
            icon: "lucide:sun",
            location: "Santiago"
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        logError(err, "WeatherWidget");
        setError(true);
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center">
        <Spinner size="sm" color="default" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <Tooltip content="No se pudo obtener el clima">
        <div className="flex items-center text-gray-400">
          <Icon icon="lucide:cloud-off" width={20} height={20} />
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={`${weather.location}: ${weather.condition}`}>
      <div className="flex items-center">
        <Icon icon={weather.icon} width={24} height={24} className="text-primary-400" />
        <span className="ml-1 text-xl">{weather.temperature}°C</span>
      </div>
    </Tooltip>
  );
};

export default WeatherWidget;