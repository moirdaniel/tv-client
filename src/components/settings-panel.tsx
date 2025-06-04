import React from "react";
import { Icon } from "@iconify/react";
import { Switch, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useSettings } from "../context/settings-context";
import { API_CONFIG, FEATURES } from "../config/app-config";

const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    showChannelNumbers, 
    setShowChannelNumbers,
    use24HourFormat,
    setUse24HourFormat,
    showClock,
    setShowClock,
    enableKeyboardNavigation,
    setEnableKeyboardNavigation,
    useLocalData,
    setUseLocalData
  } = useSettings();

  // Función para reiniciar la aplicación
  const handleRestart = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar la aplicación? Esto recargará la página.")) {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background text-foreground">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Configuración</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full"
            aria-label="Cerrar"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Apariencia</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <p>Mostrar números de canal</p>
                  <p className="text-sm text-gray-400">Muestra el número junto al nombre del canal</p>
                </div>
                <Switch 
                  isSelected={showChannelNumbers}
                  onValueChange={setShowChannelNumbers}
                  color="primary"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p>Mostrar reloj</p>
                  <p className="text-sm text-gray-400">Muestra el reloj en la barra superior</p>
                </div>
                <Switch 
                  isSelected={showClock}
                  onValueChange={setShowClock}
                  color="primary"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p>Formato 24 horas</p>
                  <p className="text-sm text-gray-400">Usa formato de 24 horas para el reloj</p>
                </div>
                <Switch 
                  isSelected={use24HourFormat}
                  onValueChange={setUse24HourFormat}
                  color="primary"
                />
              </div>
            </div>
            
            <Divider />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Datos y API</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <p>Usar datos locales</p>
                  <p className="text-sm text-gray-400">
                    {useLocalData 
                      ? "Usando datos locales" 
                      : `Conectado a API: ${API_CONFIG.baseUrl}`}
                  </p>
                </div>
                <Switch 
                  isSelected={useLocalData}
                  onValueChange={(value) => {
                    setUseLocalData(value);
                    // Mostrar mensaje de que se requiere reiniciar
                    alert("Este cambio requiere reiniciar la aplicación para aplicarse.");
                  }}
                  color="primary"
                />
              </div>
              
              <button
                onClick={handleRestart}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
              >
                Reiniciar aplicación
              </button>
            </div>
            
            <Divider />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Accesibilidad</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <p>Navegación por teclado</p>
                  <p className="text-sm text-gray-400">Permite navegar usando las teclas de flecha</p>
                </div>
                <Switch 
                  isSelected={enableKeyboardNavigation}
                  onValueChange={setEnableKeyboardNavigation}
                  color="primary"
                />
              </div>
            </div>
            
            <Divider />
            
            <div className="text-center text-sm text-gray-400">
              <p>Sitelco.TV v{import.meta.env.VITE_APP_VERSION || "1.0.0"}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPanel;