import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface AboutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      classNames={{
        base: "bg-background border border-gray-800",
        header: "border-b border-gray-800",
        body: "py-6",
        closeButton: "hover:bg-gray-800"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:info" width={20} height={20} />
                <span>Acerca de MT Media TV</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="https://img.heroui.chat/image/dashboard?w=96&h=96&u=mttv-logo" 
                    alt="MT Media TV Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">MT Media TV</h3>
                <p className="text-default-500">Versión 1.0.0</p>
              </div>
              
              <div className="space-y-4">
                <p>
                  MT Media TV es una aplicación de streaming que permite ver canales de televisión en vivo desde cualquier dispositivo.
                </p>
                
                <div>
                  <h4 className="font-medium mb-1">Desarrollado por</h4>
                  <p className="text-default-500">MT Media Team</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Contacto</h4>
                  <p className="text-default-500">support@mtmedia.tv</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">© 2024 MT Media</h4>
                  <p className="text-default-500">Todos los derechos reservados</p>
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

export default AboutDialog;