import React from "react";
import { Icon } from "@iconify/react";
import { logError } from "../utils/error-handler";

interface NewsItem {
  id: string;
  text: string;
  type: 'news' | 'finance' | 'alert';
  icon?: string;
}

const NewsTicker: React.FC = () => {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);
  const tickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Obtener noticias y datos financieros
        const newsData = await fetchNewsData();
        const financeData = await fetchFinanceData();
        
        // Combinar datos
        const combinedData = [...newsData, ...financeData];
        setNews(combinedData);
      } catch (err) {
        logError(err, "NewsTicker");
        setError(true);
        
        // Usar datos de ejemplo si falla
        setNews(getSampleData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
    
    // Actualizar cada 15 minutos
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Función para obtener noticias
  const fetchNewsData = async (): Promise<NewsItem[]> => {
    // En una implementación real, esto llamaría a una API de noticias
    // Como ejemplo, usamos datos estáticos
    return [
      { 
        id: 'news-1', 
        text: 'Últimas noticias: Gobierno anuncia nuevas medidas económicas',
        type: 'news',
        icon: 'lucide:newspaper'
      },
      { 
        id: 'news-2', 
        text: 'Alerta meteorológica: Se esperan lluvias intensas en la zona central',
        type: 'alert',
        icon: 'lucide:alert-triangle'
      },
      { 
        id: 'news-3', 
        text: 'Deportes: La selección nacional se prepara para el próximo partido',
        type: 'news',
        icon: 'lucide:trophy'
      }
    ];
  };
  
  // Función para obtener datos financieros
  const fetchFinanceData = async (): Promise<NewsItem[]> => {
    try {
      // En una implementación real, esto llamaría a una API financiera
      // Como ejemplo, usamos datos estáticos
      return [
        { 
          id: 'finance-1', 
          text: 'USD/CLP: $850.25 (+0.5%)',
          type: 'finance',
          icon: 'lucide:dollar-sign'
        },
        { 
          id: 'finance-2', 
          text: 'EUR/CLP: €920.75 (-0.2%)',
          type: 'finance',
          icon: 'lucide:euro'
        },
        { 
          id: 'finance-3', 
          text: 'IPSA: 5.842,15 (+0.3%)',
          type: 'finance',
          icon: 'lucide:bar-chart-2'
        }
      ];
    } catch (error) {
      logError(error, "fetchFinanceData");
      return [];
    }
  };
  
  // Datos de ejemplo para cuando falla la carga
  const getSampleData = (): NewsItem[] => {
    return [
      { 
        id: 'sample-1', 
        text: 'USD/CLP: $850.25 | EUR/CLP: €920.75 | Últimas noticias: Gobierno anuncia nuevas medidas económicas',
        type: 'news',
        icon: 'lucide:info'
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-8">
        <div className="animate-pulse bg-gray-700 h-4 w-3/4 rounded"></div>
      </div>
    );
  }

  if (error || news.length === 0) {
    return null;
  }

  return (
    <div 
      ref={tickerRef}
      className="w-full overflow-hidden h-8 bg-gray-800/50 rounded-md flex items-center"
    >
      <div className="whitespace-nowrap flex items-center animate-[marquee_20s_linear_infinite]">
        {news.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex items-center px-4">
              {item.icon && (
                <Icon 
                  icon={item.icon} 
                  width={16} 
                  height={16} 
                  className={`mr-2 ${item.type === 'alert' ? 'text-warning-500' : item.type === 'finance' ? 'text-primary-500' : 'text-white'}`} 
                />
              )}
              <span className={`${item.type === 'alert' ? 'text-warning-500 font-medium' : ''}`}>
                {item.text}
              </span>
            </div>
            {index < news.length - 1 && (
              <div className="h-2 w-2 rounded-full bg-gray-500 mx-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;