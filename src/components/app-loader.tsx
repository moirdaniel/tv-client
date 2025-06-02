import React from "react";
import { Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

interface AppLoaderProps {
  isLoading: boolean;
  error: string | null;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
        <div className="bg-danger-100 text-danger-700 p-4 rounded-lg max-w-lg w-full">
          <h2 className="text-xl font-bold mb-2">Error al cargar la aplicación</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-danger-600 hover:bg-danger-700 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <div className="mb-4">
        <Spinner size="lg" color="primary" />
      </div>
      <h2 className="text-xl font-medium mb-2">Cargando MT Media TV</h2>
      <p className="text-gray-400">Preparando tu experiencia de TV...</p>
    </div>
  );
};

export default AppLoader;