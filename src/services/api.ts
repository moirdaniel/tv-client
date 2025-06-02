import { Channel } from "../types/channel";
import { API_CONFIG } from "../config/app-config";
import { logError } from "../utils/error-handler";

// Función para obtener canales desde la API
export const fetchChannels = async (): Promise<Channel[]> => {
  try {
    // En una implementación real, esto sería una llamada a la API
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.channels}`);
    // if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    // return await response.json();
    
    // Por ahora, simulamos un retraso y devolvemos datos de ejemplo
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