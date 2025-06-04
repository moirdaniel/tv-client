// Utilidades para manejo seguro de errores

// Función para manejar errores de tiempo
export const handleTimeError = (error: any, source: string): Date => {
  console.error(`Error en ${source}:`, error);
  return new Date(); // Devolver la fecha actual como fallback
};

// Función para formatear tiempo de manera segura
export const safeFormatTime = (date: Date, use24HourFormat: boolean, source: string): string => {
  try {
    if (use24HourFormat) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
  } catch (error) {
    console.error(`Error en ${source}:`, error);
    return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  }
};

// Wrapper seguro para localStorage
export const safeLocalStorage = {
  getItem: (key: string, defaultValue: string = ''): string => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.error(`Error al leer localStorage[${key}]:`, error);
      return defaultValue;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error al escribir localStorage[${key}]:`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar localStorage[${key}]:`, error);
    }
  }
};

// Función para parsear JSON de manera segura
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error al parsear JSON:', error);
    return defaultValue;
  }
}

// Función para registrar errores de manera consistente
export function logError(error: any, source: string): void {
  console.error(`Error en ${source}:`, error);
  // Aquí se podría implementar lógica adicional como enviar a un servicio de monitoreo
}

// Función para verificar si un elemento es un input
export function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

// Añadir función safeFetch que faltaba
export async function safeFetch<T>(
  url: string, 
  options: RequestInit = {}, 
  timeout: number = 10000,
  fallbackValue: T | null = null
): Promise<T> {
  try {
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Hacer la petición con el controlador de aborto
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    // Parsear la respuesta como JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Si hay un valor de fallback, devolverlo
    if (fallbackValue !== null) {
      logError(error, `safeFetch(${url})`);
      return fallbackValue;
    }
    
    // Si no hay valor de fallback, propagar el error
    throw error;
  }
}

// Añadir funciones de log que faltaban
export function logWarning(message: string, source: string): void {
  console.warn(`Advertencia en ${source}: ${message}`);
}

export function logInfo(message: string, source: string): void {
  console.info(`Info en ${source}: ${message}`);
}

// Función para enfocar el input de búsqueda de manera segura
export function focusSearchInput(): void {
  try {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar" i], input[placeholder*="search" i]');
    if (searchInput instanceof HTMLInputElement) {
      searchInput.focus();
    }
  } catch (error) {
    console.error('Error al enfocar input de búsqueda:', error);
  }
}