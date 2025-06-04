import React from "react";
import { Icon } from "@iconify/react";

interface OrientationHandlerProps {
  orientation: 'portrait' | 'landscape';
}

const OrientationHandler: React.FC<OrientationHandlerProps> = ({ orientation }) => {
  const [showMessage, setShowMessage] = React.useState(orientation === 'portrait');
  
  // Actualizar el estado cuando cambia la orientación
  React.useEffect(() => {
    setShowMessage(orientation === 'portrait');
  }, [orientation]);
  
  // Si está en landscape, no mostrar nada
  if (orientation === 'landscape' || !showMessage) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white p-4">
      <div className="animate-bounce mb-6">
        <Icon icon="lucide:smartphone-rotate" width={64} height={64} />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Gira tu dispositivo</h2>
      <p className="text-center mb-6">
        Para una mejor experiencia, te recomendamos usar el modo horizontal.
      </p>
      <button 
        className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md"
        onClick={() => setShowMessage(false)}
      >
        Continuar en modo vertical
      </button>
    </div>
  );
};

export default OrientationHandler;