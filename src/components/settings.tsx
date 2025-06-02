import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSettings } from "../context/settings-context";

interface SettingsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onOpenChange }) => {
  const { 
    use24HourFormat, toggleTimeFormat,
    showChannelNumbers, toggleChannelNumbers,
    showAds, toggleAds,
    autoPlay, setAutoPlay,
    highQuality, setHighQuality,
    notifications, setNotifications,
    darkMode, toggleDarkMode,
    subtitles, setSubtitles
  } = useSettings();

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/70 backdrop-blur-md",
        base: "bg-background border border-gray-800",
        header: "border-b border-gray-800",
        footer: "border-t border-gray-800",
        closeButton: "hover:bg-white/10"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center">
                <Icon icon="lucide:settings" className="mr-2" />
                <span>Configuración</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visualización</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Formato de 24 horas</p>
                      <p className="text-sm text-gray-500">Mostrar hora en formato de 24 horas</p>
                    </div>
                    <Switch 
                      isSelected={use24HourFormat}
                      onValueChange={toggleTimeFormat}
                      defaultSelected={true} // Establecer como seleccionado por defecto
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mostrar números de canal</p>
                      <p className="text-sm text-gray-500">Mostrar el número junto al nombre del canal</p>
                    </div>
                    <Switch 
                      isSelected={showChannelNumbers}
                      onValueChange={toggleChannelNumbers}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mostrar publicidad</p>
                      <p className="text-sm text-gray-500">Mostrar anuncios en la aplicación</p>
                    </div>
                    <Switch 
                      isSelected={showAds}
                      onValueChange={toggleAds}
                    />
                  </div>
                </div>
                
                <Divider />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Reproducción</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Reproducción automática</p>
                      <p className="text-sm text-gray-500">Reproducir canales automáticamente</p>
                    </div>
                    <Switch 
                      isSelected={autoPlay}
                      onValueChange={setAutoPlay}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Alta calidad</p>
                      <p className="text-sm text-gray-500">Reproducir en la máxima calidad disponible</p>
                    </div>
                    <Switch 
                      isSelected={highQuality}
                      onValueChange={setHighQuality}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Subtítulos</p>
                      <p className="text-sm text-gray-500">Mostrar subtítulos cuando estén disponibles</p>
                    </div>
                    <Switch 
                      isSelected={subtitles}
                      onValueChange={setSubtitles}
                    />
                  </div>
                </div>
                
                <Divider />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Notificaciones</p>
                      <p className="text-sm text-gray-500">Recibir notificaciones de la aplicación</p>
                    </div>
                    <Switch 
                      isSelected={notifications}
                      onValueChange={setNotifications}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Modo oscuro</p>
                      <p className="text-sm text-gray-500">Cambiar entre tema claro y oscuro</p>
                    </div>
                    <Switch 
                      isSelected={darkMode}
                      onValueChange={toggleDarkMode}
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Settings;