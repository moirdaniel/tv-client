import React from "react";
import { Icon } from "@iconify/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { useKeyboardNavigation } from "./keyboard-navigation";

const KeyboardHelp: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { registerHelpToggle } = useKeyboardNavigation();
  
  // Registrar la función de toggle para la ayuda
  React.useEffect(() => {
    registerHelpToggle(() => {
      onOpen();
    });
  }, [registerHelpToggle, onOpen]);
  
  return (
    <>
      {/* Botón oculto que será activado desde el menú */}
      <Button 
        variant="flat" 
        size="sm" 
        onPress={onOpen}
        className="hidden" // Ocultar el botón
        data-keyboard-help-trigger // Añadir un atributo para poder seleccionarlo
      >
        Atajos de teclado
      </Button>

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
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:keyboard" width={20} height={20} />
                  <span>Controles de teclado</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-default-500">
                    Esta aplicación está diseñada para ser controlada principalmente mediante teclado.
                    Utilice las siguientes teclas para navegar:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded">←</span>
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded">→</span>
                      </div>
                      <span>Cambiar entre categorías y canales</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded">↑</span>
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded">↓</span>
                      </div>
                      <span>Navegar por categorías o canales (según sección activa)</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-mono bg-gray-800 px-2 py-1 rounded">F</span>
                      <span>Pantalla completa</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-mono bg-gray-800 px-2 py-1 rounded">C</span>
                      <span>Mostrar/Ocultar menú lateral</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-mono bg-gray-800 px-2 py-1 rounded">ESC</span>
                      <span>Salir de pantalla completa / Volver</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-md">
                    <p className="text-sm text-primary-500">
                      <strong>Nota:</strong> Use las flechas izquierda/derecha para cambiar entre categorías y canales, 
                      y las flechas arriba/abajo para navegar dentro de la sección activa.
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
    </>
  );
};

export default KeyboardHelp;