import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useKeyboardNavigation } from "./keyboard-navigation";

interface RemoteControlOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const RemoteControlOverlay: React.FC<RemoteControlOverlayProps> = ({ isVisible, onClose }) => {
  const { 
    registerChannelChange, 
    registerVolumeControl,
    registerMuteToggle,
    registerFullscreenToggle
  } = useKeyboardNavigation();
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-content1 rounded-lg p-6 max-w-xs w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Control Remoto</h3>
          <Button 
            isIconOnly 
            variant="light" 
            size="sm" 
            onPress={onClose}
          >
            <Icon icon="lucide:x" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="primary"
            variant="flat"
          >
            <Icon icon="lucide:chevron-up" className="text-2xl" />
            <span className="text-xs mt-1">Canal +</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="primary"
            variant="solid"
          >
            <Icon icon="lucide:power" className="text-2xl" />
            <span className="text-xs mt-1">Power</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="primary"
            variant="flat"
          >
            <Icon icon="lucide:volume-2" className="text-2xl" />
            <span className="text-xs mt-1">Vol +</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="primary"
            variant="flat"
          >
            <Icon icon="lucide:chevron-down" className="text-2xl" />
            <span className="text-xs mt-1">Canal -</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="primary"
            variant="flat"
          >
            <Icon icon="lucide:menu" className="text-2xl" />
            <span className="text-xs mt-1">Menú</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="primary"
            variant="flat"
          >
            <Icon icon="lucide:volume-1" className="text-2xl" />
            <span className="text-xs mt-1">Vol -</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="default"
            variant="flat"
          >
            <Icon icon="lucide:volume-x" className="text-2xl" />
            <span className="text-xs mt-1">Mute</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="default"
            variant="flat"
          >
            <Icon icon="lucide:home" className="text-2xl" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          
          <Button 
            className="aspect-square flex flex-col items-center justify-center"
            color="default"
            variant="flat"
          >
            <Icon icon="lucide:maximize" className="text-2xl" />
            <span className="text-xs mt-1">Fullscreen</span>
          </Button>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>También puede usar las teclas de dirección del teclado</p>
        </div>
      </div>
    </div>
  );
};

export default RemoteControlOverlay;