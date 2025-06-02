import { logError } from "../utils/error-handler";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt: Date;
  category: 'general' | 'business' | 'technology' | 'sports' | 'entertainment' | 'health' | 'science';
  icon?: string;
}

// Función para obtener noticias
export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    // En una implementación real, esto llamaría a una API de noticias
    // Como ejemplo, usamos datos estáticos
    return [
      {
        id: "news-1",
        title: "Gobierno anuncia nuevas medidas económicas",
        summary: "El Ministerio de Hacienda presentó un paquete de medidas para reactivar la economía",
        source: "Diario Financiero",
        publishedAt: new Date(),
        category: "business",
        icon: "lucide:briefcase"
      },
      {
        id: "news-2",
        title: "Alerta meteorológica: Se esperan lluvias intensas",
        summary: "La Dirección Meteorológica emitió una alerta por precipitaciones en la zona central",
        source: "El Mercurio",
        publishedAt: new Date(),
        category: "general",
        icon: "lucide:cloud-rain"
      },
      {
        id: "news-3",
        title: "La selección nacional se prepara para el próximo partido",
        summary: "El equipo nacional realizó su último entrenamiento antes del partido clasificatorio",
        source: "La Tercera",
        publishedAt: new Date(),
        category: "sports",
        icon: "lucide:trophy"
      },
      {
        id: "news-4",
        title: "Nueva tecnología promete revolucionar la industria energética",
        summary: "Investigadores desarrollaron un sistema que aumenta la eficiencia de paneles solares",
        source: "Revista Tecnología",
        publishedAt: new Date(),
        category: "technology",
        icon: "lucide:zap"
      }
    ];
  } catch (error) {
    logError(error, "fetchNews");
    throw error;
  }
};

// Función para obtener noticias destacadas para el ticker
export const fetchTickerNews = async (): Promise<{id: string, text: string, type: string, icon?: string}[]> => {
  try {
    const news = await fetchNews();
    
    // Convertir noticias a formato de ticker
    return news.map(item => ({
      id: item.id,
      text: item.title,
      type: item.category === 'business' ? 'finance' : 'news',
      icon: item.icon
    }));
  } catch (error) {
    logError(error, "fetchTickerNews");
    return [
      { 
        id: 'fallback-1', 
        text: 'No se pudieron cargar las noticias más recientes',
        type: 'news',
        icon: 'lucide:info'
      }
    ];
  }
};