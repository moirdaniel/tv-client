import { Channel } from "../types/channel";
import { API_CONFIG } from "../config/app-config";
import { logError, safeFetch } from "../utils/error-handler";

// Obtener configuración de variables de ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://57.129.25.40:3001/api/channels";
const USE_LOCAL_DATA = import.meta.env.VITE_USE_LOCAL_DATA === "true";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

// Función para obtener canales desde la API
export const fetchChannels = async (): Promise<Channel[]> => {
  try {
    // Si está configurado para usar datos locales, devolver datos de ejemplo
    if (USE_LOCAL_DATA) {
      console.log("Usando datos locales para canales (configurado via VITE_USE_LOCAL_DATA)");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              "_id": "6838eef7b450735f1b8af246",
              "id": 5,
              "name": "VClassicTV",
              "url": "https://5eaccbab48461.streamlock.net:1936/8112/8112/playlist.m3u8",
              "logoUrl": "https://cdn.m3u.cl/logo/1160_VClassicTV.png",
              "enabled": true,
              "category": ["Musica"]
            },
            {
              "_id": "6838eef7b450735f1b8af247",
              "id": 6,
              "name": "EnerGeek FAN",
              "url": "https://wifispeed.trapemn.tv:1936/infantil/energeek-1/playlist.m3u8",
              "logoUrl": "https://img.heroui.chat/image/dashboard?w=200&h=200&u=1",
              "enabled": true,
              "category": ["ANIME"]
            }
          ]);
        }, 1000);
      });
    }
    
    // Si no usa datos locales, hacer petición a la API
    console.log(`Obteniendo canales desde API: ${API_URL}`);
    
    return await safeFetch<Channel[]>(
      API_URL,
      { 
        headers: { 'Accept': 'application/json' },
        method: 'GET'
      },
      API_TIMEOUT,
      [] // Valor por defecto en caso de error
    );
  } catch (error) {
    logError(error, 'fetchChannels');
    throw new Error('No se pudieron cargar los canales. Por favor, intente nuevamente más tarde.');
  }
};

// Función para obtener EPG (Guía Electrónica de Programas)
export const fetchEpg = async (channelId: string, date: string): Promise<any> => {
  try {
    // En una implementación real, esto sería una llamada a la API
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.epg}?channelId=${channelId}&date=${date}`);
    // if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    // return await response.json();
    
    // Por ahora, simulamos un retraso y devolvemos datos de ejemplo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Programa de ejemplo',
            description: 'Este es un programa de ejemplo',
            startTime: '2023-06-01T10:00:00Z',
            endTime: '2023-06-01T11:00:00Z',
            channelId: channelId
          }
        ]);
      }, 500);
    });
  } catch (error) {
    logError(error, 'fetchEpg');
    throw new Error('No se pudo cargar la guía de programación. Por favor, intente nuevamente más tarde.');
  }
};