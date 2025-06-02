import { logError, logWarning } from "./error-handler";

/**
 * Configura manejadores de errores globales para la aplicación
 */
export const setupErrorHandlers = () => {
  // Capturar errores no manejados
  window.addEventListener('error', (event) => {
    logError({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }, 'GlobalErrorHandler');
    
    // No prevenir el comportamiento por defecto para que otros manejadores puedan procesarlo
    // event.preventDefault();
  });
  
  // Capturar promesas rechazadas no manejadas
  window.addEventListener('unhandledrejection', (event) => {
    logError({
      message: 'Unhandled Promise Rejection',
      reason: event.reason,
      stack: event.reason?.stack
    }, 'UnhandledPromiseRejection');
    
    // No prevenir el comportamiento por defecto para que otros manejadores puedan procesarlo
    // event.preventDefault();
  });
  
  // Sobrescribir console.error para mejorar el formato de los errores
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Llamar a la implementación original
    originalConsoleError.apply(console, args);
    
    // Opcional: Añadir lógica adicional como enviar a un servicio de monitoreo
    // if (args[0] && typeof args[0] === 'string' && args[0].includes('React error')) {
    //   reportToMonitoringService(args);
    // }
  };
  
  // Sobrescribir console.warn para mejorar el formato de las advertencias
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    // Llamar a la implementación original
    originalConsoleWarn.apply(console, args);
    
    // Opcional: Filtrar advertencias específicas
    // if (args[0] && typeof args[0] === 'string' && args[0].includes('deprecated')) {
    //   logDeprecationWarning(args);
    // }
  };
  
  // Log de inicialización
  console.info('[App] Manejadores de errores globales configurados');
};

/**
 * Función para crear un error personalizado con información adicional
 */
export class AppError extends Error {
  context: string;
  timestamp: Date;
  
  constructor(message: string, context: string = 'App') {
    super(message);
    this.name = 'AppError';
    this.context = context;
    this.timestamp = new Date();
    
    // Asegurar que la pila de llamadas sea correcta
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}