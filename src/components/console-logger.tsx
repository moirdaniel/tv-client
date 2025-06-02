import React from "react";

const ConsoleLogger: React.FC = () => {
  React.useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Sobrescribir console.log para agregar timestamp
    console.log = function(...args) {
      const timestamp = new Date().toISOString();
      originalConsoleLog.apply(console, [`[${timestamp}]`, ...args]);
    };
    
    // Sobrescribir console.error para agregar timestamp
    console.error = function(...args) {
      const timestamp = new Date().toISOString();
      originalConsoleError.apply(console, [`[${timestamp}] ERROR:`, ...args]);
    };
    
    // Sobrescribir console.warn para agregar timestamp
    console.warn = function(...args) {
      const timestamp = new Date().toISOString();
      originalConsoleWarn.apply(console, [`[${timestamp}] WARNING:`, ...args]);
    };
    
    return () => {
      // Restaurar las funciones originales al desmontar
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);
  
  return null; // Este componente no renderiza nada
};

export default ConsoleLogger;