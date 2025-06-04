import React from "react";
import { Button, Card, Divider } from "@heroui/react";
import ErrorNotification from "./error-notification";

const ErrorNotificationDemo: React.FC = () => {
  const [showToast, setShowToast] = React.useState(false);
  const [showInline, setShowInline] = React.useState(false);
  const [showFullscreen, setShowFullscreen] = React.useState(false);
  
  const sampleError = new Error("Este es un ejemplo de error para demostración");
  
  const handleRetry = () => {
    console.log("Intentando nuevamente...");
    // Simular un reintento
    setTimeout(() => {
      alert("Reintento simulado completado");
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Demostración de Notificaciones de Error</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Variantes disponibles</h2>
          <p className="text-sm mb-4">
            El componente ErrorNotification tiene tres variantes para diferentes situaciones de error:
          </p>
          
          <div className="space-y-4">
            <Button 
              color="danger" 
              onPress={() => setShowToast(true)}
              className="w-full"
            >
              Mostrar Toast Error
            </Button>
            
            <Button 
              color="danger" 
              onPress={() => setShowInline(true)}
              className="w-full"
            >
              Mostrar Inline Error
            </Button>
            
            <Button 
              color="danger" 
              onPress={() => setShowFullscreen(true)}
              className="w-full"
            >
              Mostrar Fullscreen Error
            </Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Cómo usar</h2>
          <p className="text-sm mb-2">
            Importa el componente y úsalo en cualquier parte de tu aplicación:
          </p>
          
          <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto mb-4">
            {`import ErrorNotification from "./components/error-notification";

// Para errores no críticos (toast)
<ErrorNotification 
  message="No se pudo cargar el contenido"
  onRetry={handleRetry}
  onClose={() => setShowError(false)}
/>

// Para errores de componente (inline)
<ErrorNotification 
  variant="inline"
  title="Error de carga"
  message="No se pudieron cargar los canales"
  onRetry={handleRetry}
/>

// Para errores críticos (fullscreen)
<ErrorNotification 
  variant="fullscreen"
  title="Error crítico"
  message="La aplicación ha encontrado un error inesperado"
  error={error}
  showDetails={true}
  onRetry={handleRetry}
/>`}
          </pre>
        </Card>
      </div>
      
      {showToast && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Toast Error</h2>
          <div className="max-w-md">
            <ErrorNotification
              title="Error de conexión"
              message="No se pudo conectar con el servidor. Verifica tu conexión a internet."
              onRetry={handleRetry}
              onClose={() => setShowToast(false)}
            />
          </div>
        </div>
      )}
      
      {showInline && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Inline Error</h2>
          <ErrorNotification
            variant="inline"
            title="Error al cargar canales"
            message="No se pudieron cargar los canales. Intenta nuevamente más tarde."
            error={sampleError}
            showDetails={true}
            onRetry={handleRetry}
            onClose={() => setShowInline(false)}
          />
        </div>
      )}
      
      {showFullscreen && (
        <ErrorNotification
          variant="fullscreen"
          title="Error crítico de aplicación"
          message="La aplicación ha encontrado un error inesperado y no puede continuar."
          error={sampleError}
          showDetails={true}
          onRetry={() => {
            handleRetry();
            setShowFullscreen(false);
          }}
        />
      )}
    </div>
  );
};

export default ErrorNotificationDemo;