import React from "react";
import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface ErrorNotificationProps {
  title?: string;
  message: string;
  error?: Error | null;
  showDetails?: boolean;
  onRetry?: () => void;
  onClose?: () => void;
  variant?: "toast" | "inline" | "fullscreen";
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  title = "Algo salió mal",
  message,
  error = null,
  showDetails = false,
  onRetry,
  onClose,
  variant = "inline"
}) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Fullscreen variant (for critical errors)
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#000a1f] text-white p-4 z-50">
        <Card className="bg-[#5a0a22] text-white border-none shadow-xl max-w-lg w-full">
          <div className="p-6">
            <div className="flex items-start">
              <div className="mr-4">
                <div className="bg-[#3a0515] p-3 rounded-full">
                  <Icon icon="lucide:alert-triangle" width={28} height={28} />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="mb-4">{message}</p>
                
                {showDetails && error && (
                  <div className="bg-[#3a0515] p-3 rounded overflow-auto max-h-40 mb-4">
                    <pre className="text-sm text-white">{error.toString()}</pre>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  {onRetry && (
                    <Button
                      color="danger"
                      variant="solid"
                      onPress={onRetry}
                      className="w-full sm:w-auto"
                      startContent={<Icon icon="lucide:refresh-cw" />}
                    >
                      Reintentar
                    </Button>
                  )}
                  
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => window.location.reload()}
                    className="w-full sm:w-auto"
                  >
                    Recargar aplicación
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  // Inline variant (for component-level errors)
  if (variant === "inline") {
    return (
      <Card className="bg-[#5a0a22] text-white border-none shadow-md w-full">
        <div className="p-4">
          <div className="flex items-center">
            <Icon icon="lucide:alert-circle" className="mr-3" width={24} height={24} />
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            
            <div className="flex gap-2">
              {onRetry && (
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={onRetry}
                  aria-label="Reintentar"
                >
                  <Icon icon="lucide:refresh-cw" width={18} height={18} />
                </Button>
              )}
              
              {onClose && (
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  size="sm"
                  onPress={onClose}
                  aria-label="Cerrar"
                >
                  <Icon icon="lucide:x" width={18} height={18} />
                </Button>
              )}
            </div>
          </div>
          
          {showDetails && error && (
            <div className="bg-[#3a0515] p-2 rounded mt-2 overflow-auto max-h-32">
              <pre className="text-xs text-white">{error.toString()}</pre>
            </div>
          )}
        </div>
      </Card>
    );
  }
  
  // Toast variant (for non-critical errors)
  return (
    <div className="bg-[#5a0a22] text-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <Icon icon="lucide:alert-circle" className="mr-3 mt-0.5" width={20} height={20} />
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm opacity-90">{message}</p>
          </div>
          
          {onClose && (
            <Button
              isIconOnly
              color="danger"
              variant="light"
              size="sm"
              onPress={onClose}
              aria-label="Cerrar"
            >
              <Icon icon="lucide:x" width={16} height={16} />
            </Button>
          )}
        </div>
      </div>
      
      {(onRetry || showDetails) && (
        <div className="border-t border-[#3a0515] bg-[#4a0a1d] px-4 py-2 flex justify-between items-center">
          {onRetry && (
            <Button
              color="danger"
              variant="light"
              size="sm"
              onPress={onRetry}
              startContent={<Icon icon="lucide:refresh-cw" width={16} height={16} />}
            >
              Reintentar
            </Button>
          )}
          
          <Button
            color="danger"
            variant="light"
            size="sm"
            onPress={handleGoBack}
          >
            Volver atrás
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorNotification;