import React from "react";
import { Icon } from "@iconify/react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";

interface OrientationHandlerProps {
  orientation: 'portrait' | 'landscape';
}

const OrientationHandler: React.FC<OrientationHandlerProps> = ({ orientation }) => {
  const [showModal, setShowModal] = React.useState(orientation === 'portrait');
  const [hasSeenMessage, setHasSeenMessage] = React.useState(false);

  React.useEffect(() => {
    // Verificar si el usuario ya ha visto el mensaje
    const orientationMessageSeen = localStorage.getItem('orientationMessageSeen');
    
    if (orientationMessageSeen === 'true') {
      setHasSeenMessage(true);
    }
    
    // Solo mostrar el modal si está en modo retrato y no ha visto el mensaje
    if (orientation === 'portrait' && !hasSeenMessage) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [orientation, hasSeenMessage]);

  const handleClose = () => {
    setShowModal(false);
    // Marcar que el usuario ya ha visto el mensaje
    localStorage.setItem('orientationMessageSeen', 'true');
    setHasSeenMessage(true);
  };

  return (
    <Modal 
      isOpen={showModal} 
      onOpenChange={setShowModal}
      hideCloseButton={false}
      placement="center"
      size="sm"
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
              Sugerencia de visualización
            </ModalHeader>
            <ModalBody className="text-center">
              <div className="flex justify-center mb-4">
                <Icon icon="lucide:smartphone-rotate" width={48} height={48} className="text-primary-400" />
              </div>
              <p className="mb-4 text-default-500">
                Para disfrutar mejor de los contenidos, puede girar su dispositivo a modo horizontal.
              </p>
              <div className="flex justify-center gap-2">
                <Button 
                  color="primary" 
                  variant="flat" 
                  onPress={handleClose} 
                  size="sm"
                >
                  Continuar así
                </Button>
                <Button 
                  variant="light" 
                  onPress={() => {
                    handleClose();
                    localStorage.setItem('alwaysUsePortrait', 'true');
                  }}
                  size="sm"
                >
                  No mostrar de nuevo
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OrientationHandler;