import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface RemoteControlHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

const RemoteControlHelp: React.FC<RemoteControlHelpProps> = ({ isVisible, onClose }) => {
  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Ayuda de Control Remoto
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Icon icon="lucide:arrow-left" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">Flecha Izquierda</p>
                    <p className="text-sm text-gray-500">Navegar al menú de categorías</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Icon icon="lucide:arrow-right" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">Flecha Derecha</p>
                    <p className="text-sm text-gray-500">Navegar a la lista de canales o al reproductor</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Icon icon="lucide:arrow-up" width={24} height={24} />
                    <Icon icon="lucide:arrow-down" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">Flechas Arriba/Abajo</p>
                    <p className="text-sm text-gray-500">Navegar entre categorías o canales</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Icon icon="lucide:volume-x" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">Tecla M</p>
                    <p className="text-sm text-gray-500">Silenciar/Activar sonido</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <Icon icon="lucide:maximize" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">Tecla F</p>
                    <p className="text-sm text-gray-500">Pantalla completa</p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RemoteControlHelp;