// Utilidad para manejar errores y logging

// Función para manejar errores de forma segura
export const logError = (error: any, context: string = 'General') => {
  console.error(`[ERROR][${context}]`, error);
  
  // Opcional: enviar a un servicio de monitoreo
  // reportErrorToService(error, context);
};

// Función para logs informativos
export const logInfo = (message: string, context: string = 'General') => {
  console.info(`[INFO][${context}]`, message);
};

// Función para logs de advertencia
export const logWarning = (message: string, context: string = 'General') => {
  console.warn(`[WARNING][${context}]`, message);
};

// Wrapper seguro para localStorage
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logError(`Error al obtener ${key} de localStorage: ${error}`, 'safeLocalStorage');
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logError(`Error al guardar ${key} en localStorage: ${error}`, 'safeLocalStorage');
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logError(`Error al eliminar ${key} de localStorage: ${error}`, 'safeLocalStorage');
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      logError(error, 'safeLocalStorage.clear');
    }
  }
};

// Añadir la función safeJsonParse que falta
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logError(`Error al analizar JSON: ${error}`, 'safeJsonParse');
    return fallback;
  }
};

// Añadir la función safeFetch que falta
export const safeFetch = async <T>(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 10000,
  fallbackData: T
): Promise<T> => {
  try {
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Realizar la petición con el controlador de aborto
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    // Devolver los datos
    return await response.json();
  } catch (error) {
    // Si es un error de timeout
    if (error.name === 'AbortError') {
      logError(`La petición a ${url} excedió el tiempo límite de ${timeoutMs}ms`, 'safeFetch');
    } else {
      logError(`Error al realizar fetch a ${url}: ${error}`, 'safeFetch');
    }
    
    // Devolver datos de respaldo
    return fallbackData;
  }
};

// Añadir función para manejar errores de formato de hora
export const handleTimeFormatError = (error: any) => {
  console.error("Error al procesar el formato de hora:", error);
  
  // Intentar restaurar el formato predeterminado (24h)
  try {
    safeLocalStorage.setItem('settings', JSON.stringify({ 
      ...JSON.parse(safeLocalStorage.getItem('settings') || '{}'),
      use24HourFormat: true 
    }));
    console.log("Formato de hora restaurado a 24h");
  } catch (restoreError) {
    console.error("No se pudo restaurar el formato de hora:", restoreError);
  }
  
  // Devolver true para indicar que se usa formato 24h
  return true;
};

// Añadir función para manejar errores de tiempo
export const handleTimeError = (error: any, context: string = 'TimeError'): Date => {
  logError(`Error al procesar tiempo: ${error}`, context);
  
  // Devolver una fecha actual como fallback
  return new Date();
};

// Función para formatear tiempo de manera segura - mejorada con mejor manejo de errores
export const safeFormatTime = (date: Date | null | undefined, use24HourFormat: boolean = true, context: string = 'TimeFormat') => {
  try {
    // Verificar si date es válido
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      logWarning(`Fecha inválida: ${date}. Usando fecha actual como respaldo.`, context);
      date = new Date(); // Usar fecha actual como respaldo
    }
    
    if (use24HourFormat) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
  } catch (error) {
    logError(`Error al formatear tiempo: ${error}`, context);
    return use24HourFormat ? '00:00' : '12:00 AM';
  }
};

// Añadir función para manejar favoritos de manera segura
export const safeFavorites = {
  add: (userId: string, channelId: string): string[] => {
    try {
      const key = `mt_media_favorites_${userId}`;
      const storedFavorites = safeLocalStorage.getItem(key);
      const favorites = storedFavorites ? safeJsonParse<string[]>(storedFavorites, []) : [];
      
      if (!favorites.includes(channelId)) {
        favorites.push(channelId);
        safeLocalStorage.setItem(key, JSON.stringify(favorites));
      }
      
      return favorites;
    } catch (error) {
      logError(error, 'safeFavorites.add');
      return [];
    }
  },
  
  remove: (userId: string, channelId: string): string[] => {
    try {
      const key = `mt_media_favorites_${userId}`;
      const storedFavorites = safeLocalStorage.getItem(key);
      const favorites = storedFavorites ? safeJsonParse<string[]>(storedFavorites, []) : [];
      
      const newFavorites = favorites.filter(id => id !== channelId);
      safeLocalStorage.setItem(key, JSON.stringify(newFavorites));
      
      return newFavorites;
    } catch (error) {
      logError(error, 'safeFavorites.remove');
      return [];
    }
  },
  
  get: (userId: string): string[] => {
    try {
      const key = `mt_media_favorites_${userId}`;
      const storedFavorites = safeLocalStorage.getItem(key);
      return storedFavorites ? safeJsonParse<string[]>(storedFavorites, []) : [];
    } catch (error) {
      logError(error, 'safeFavorites.get');
      return [];
    }
  },
  
  toggle: (userId: string, channelId: string): string[] => {
    try {
      const favorites = safeFavorites.get(userId);
      
      if (favorites.includes(channelId)) {
        return safeFavorites.remove(userId, channelId);
      } else {
        return safeFavorites.add(userId, channelId);
      }
    } catch (error) {
      logError(error, 'safeFavorites.toggle');
      return [];
    }
  }
};