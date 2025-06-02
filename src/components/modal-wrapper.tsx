import React from "react";
import { Modal, ModalProps } from "@heroui/react";

// Componente wrapper para aplicar estilos consistentes a todos los modales
export const StyledModal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <Modal 
      {...props}
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/70 backdrop-blur-md",
        base: "bg-background border border-gray-800",
        header: "border-b border-gray-800",
        footer: "border-t border-gray-800",
        closeButton: "hover:bg-white/10",
        ...props.classNames
      }}
    >
      {children}
    </Modal>
  );
};

export default StyledModal;