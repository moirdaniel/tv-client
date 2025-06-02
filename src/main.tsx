import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import App from './App.tsx'
import './index.css'

// Verificar que el archivo main.tsx esté correctamente configurado
// Asegurarse de que el elemento root exista
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("No se encontró el elemento con id 'root'. Verifica el archivo index.html");
  // Crear el elemento si no existe
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

import { setupErrorHandlers } from "./utils/error-setup";
import ErrorBoundary from "./components/error-boundary";

// Configurar manejadores de errores globales
setupErrorHandlers();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HeroUIProvider>
        <ToastProvider/>
        <App />
      </HeroUIProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)