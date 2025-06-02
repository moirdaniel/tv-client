import { logError, logWarning, safeFetch } from "../utils/error-handler";

// Interfaces para los datos del clima
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
}

export interface ForecastData {
  date: Date;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  icon: string;
}

// Función para obtener la ubicación actual con mejor manejo de errores
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }
    
    // Añadir timeout más corto para evitar bloqueos
    const timeoutId = setTimeout(() => {
      reject(new Error("Geolocation request timed out"));
    }, 5000);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve(position);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 30 * 60 * 1000 // 30 minutos
      }
    );
  });
};

// Función para obtener datos del clima usando OpenWeatherMap API con mejor manejo de errores
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  // Usar API key desde variables de entorno
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "bd5e378503939ddaee76f12ad7a97608";
  
  // Verificar si el widget está habilitado
  const isEnabled = import.meta.env.VITE_WEATHER_WIDGET_ENABLED === "true";
  if (!isEnabled) {
    throw new Error("Weather widget is disabled");
  }
  
  if (!API_KEY || API_KEY === "bd5e378503939ddaee76f12ad7a97608") {
    logWarning("Using default weather API key. Set VITE_WEATHER_API_KEY in your .env file.", "fetchWeatherData");
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  
  try {
    // Usar safeFetch en lugar de fetch directo para mejor manejo de errores
    const data = await safeFetch(
      url,
      { headers: { 'Accept': 'application/json' } },
      5000,
      null
    );
    
    if (!data) {
      throw new Error("Weather API returned empty data");
    }
    
    // Extraer la ciudad y país
    const location = data.name || "Desconocido";
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: getWeatherIcon(data.weather[0].id, data.weather[0].icon),
      location,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like)
    };
  } catch (error) {
    logError(error, "fetchWeatherData");
    throw error;
  }
};

// Función para obtener pronóstico de 5 días
export const fetchForecastData = async (lat: number, lon: number): Promise<ForecastData[]> => {
  const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // API key de ejemplo
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Procesar datos para obtener pronóstico diario (no por horas)
    const dailyForecasts: Record<string, ForecastData> = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toISOString().split('T')[0];
      
      if (!dailyForecasts[dateString]) {
        dailyForecasts[dateString] = {
          date,
          temperature: {
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].id, item.weather[0].icon)
        };
      } else {
        // Actualizar min/max si es necesario
        if (item.main.temp_min < dailyForecasts[dateString].temperature.min) {
          dailyForecasts[dateString].temperature.min = item.main.temp_min;
        }
        if (item.main.temp_max > dailyForecasts[dateString].temperature.max) {
          dailyForecasts[dateString].temperature.max = item.main.temp_max;
        }
      }
    });
    
    // Convertir a array y redondear temperaturas
    return Object.values(dailyForecasts).map(forecast => ({
      ...forecast,
      temperature: {
        min: Math.round(forecast.temperature.min),
        max: Math.round(forecast.temperature.max)
      }
    }));
  } catch (error) {
    logError(error, "fetchForecastData");
    throw error;
  }
};

// Función para mapear códigos de clima a iconos de Lucide
export const getWeatherIcon = (weatherId: number, iconCode: string): string => {
  // Verificar si es de día o de noche
  const isNight = iconCode.includes('n');
  
  // Mapear códigos de clima a iconos de Lucide
  if (weatherId >= 200 && weatherId < 300) {
    return "lucide:cloud-lightning"; // Tormenta
  } else if (weatherId >= 300 && weatherId < 400) {
    return "lucide:cloud-drizzle"; // Llovizna
  } else if (weatherId >= 500 && weatherId < 600) {
    return "lucide:cloud-rain"; // Lluvia
  } else if (weatherId >= 600 && weatherId < 700) {
    return "lucide:cloud-snow"; // Nieve
  } else if (weatherId >= 700 && weatherId < 800) {
    return "lucide:cloud-fog"; // Niebla
  } else if (weatherId === 800) {
    return isNight ? "lucide:moon" : "lucide:sun"; // Despejado
  } else if (weatherId > 800) {
    return isNight ? "lucide:cloud-moon" : "lucide:cloud-sun"; // Parcialmente nublado
  }
  
  return "lucide:cloud"; // Por defecto
};