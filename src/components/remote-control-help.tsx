import React from "react";
import { Icon } from "@iconify/react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

interface RemoteControlHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

const RemoteControlHelp: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  return (
    <Modal 
      isOpen={isVisible} 
      onOpenChange={() => onClose()}
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
            <ModalHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Control Remoto - Ayuda</h2>
            </ModalHeader>
            
            <ModalBody>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Modo Normal</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <Icon icon="lucide:arrow-up-down" width={20} height={20} />
                      </div>
                      <span>Navegar por la lista de canales</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <Icon icon="lucide:arrow-left-right" width={20} height={20} />
                      </div>
                      <span>Navegar entre categorías y canales</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <span className="font-mono">Enter</span>
                      </div>
                      <span>Seleccionar canal o categoría</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Modo Pantalla Completa</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <Icon icon="lucide:arrow-up" width={20} height={20} />
                      </div>
                      <span>Canal anterior</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <Icon icon="lucide:arrow-down" width={20} height={20} />
                      </div>
                      <span>Canal siguiente</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <span className="font-mono">Esc</span>
                      </div>
                      <span>Salir de pantalla completa</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-md">
                  <p className="text-sm text-primary-500">
                    <strong>Nota:</strong> El volumen se controla directamente desde su dispositivo (TV o PC).
                  </p>
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