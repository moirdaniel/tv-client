import { logError } from "./error-handler";

/**
 * Utility functions for toast notifications
 */

// Función para mostrar notificaciones toast
export const addToast = (options: {
  title: string;
  description?: string;
  timeout?: number;
  severity?: 'success' | 'warning' | 'danger' | 'info';
}) => {
  try {
    // Verificar si estamos en un entorno donde está disponible HeroUI
    if (typeof window !== 'undefined' && window.addToast) {
      window.addToast(options);
    } else {
      // Si no está disponible, usar console.log como fallback
      console.log(`%c[Toast] ${options.title}`, 
        `background: ${getToastColor(options.severity)}; color: white; padding: 2px 4px; border-radius: 3px;`, 
        options.description || '');
    }
  } catch (error) {
    logError(error, 'addToast');
    // Fallback a console.log si hay algún error
    console.log(`[Toast] ${options.title}: ${options.description || ''}`);
  }
};

// Helper para obtener el color según la severidad
const getToastColor = (severity?: 'success' | 'warning' | 'danger' | 'info'): string => {
  switch (severity) {
    case 'success': return '#17c964';
    case 'warning': return '#f5a524';
    case 'danger': return '#f31260';
    case 'info': return '#006FEE';
    default: return '#006FEE'; // Default to info/primary color
  }
};

// Declarar el tipo global para TypeScript
declare global {
  interface Window {
    addToast?: (options: {
      title: string;
      description?: string;
      timeout?: number;
      severity?: 'success' | 'warning' | 'danger' | 'info';
    }) => void;
  }
}