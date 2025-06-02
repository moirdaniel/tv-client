import React from "react";
import { Alert } from "@heroui/react";
import { Icon } from "@iconify/react";

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert
        color={isOnline ? "success" : "danger"}
        isVisible={showAlert}
        onVisibleChange={setShowAlert}
        isClosable
      >
        <div className="flex items-center gap-2">
          <Icon 
            icon={isOnline ? "lucide:wifi" : "lucide:wifi-off"} 
            width={20} 
            height={20} 
          />
          <div>
            <p className="font-medium">
              {isOnline ? "Conexión restablecida" : "Sin conexión"}
            </p>
            <p className="text-sm">
              {isOnline 
                ? "La conexión a internet ha sido restablecida." 
                : "No hay conexión a internet. Algunas funciones pueden no estar disponibles."}
            </p>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;