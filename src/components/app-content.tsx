import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import ChannelList from "./channel-list";
import VideoPlayer from "./video-player";
import { useChannelContext } from "../context/channel-context";
import { useKeyboardNavigation } from "./keyboard-navigation";
import { useAuth } from "../context/auth-context";
import RemoteControlHelp from "./remote-control-help";
import AppLoader from "./app-loader";

const AppContent = () => {
  const { selectedChannel, orientation, isLoading } = useChannelContext();
  const { activeSection, setActiveSection } = useKeyboardNavigation();
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
  
  // Obtener registerMenuToggle del contexto de navegación por teclado
  const { registerMenuToggle } = useKeyboardNavigation();
  
  // Registrar la función para alternar la visibilidad de la barra lateral
  React.useEffect(() => {
    if (registerMenuToggle) {
      registerMenuToggle(() => {
        setIsSidebarVisible(prev => !prev);
      });
    }
  }, [registerMenuToggle]);
  
  // Efecto para actualizar el título del documento
  React.useEffect(() => {
    if (selectedChannel) {
      document.title = `MT Media TV - ${selectedChannel.name}`;
    } else {
      document.title = "MT Media TV";
    }
  }, [selectedChannel]);
  
  // Mostrar el loader si está cargando
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4">Cargando canales...</p>
      </div>
    </div>;
  }
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && (
          <div className={`w-64 border-r border-gray-800 flex-shrink-0 overflow-hidden ${activeSection === 'sidebar' ? 'ring-2 ring-primary-500 ring-inset' : ''}`}>
            <Sidebar />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <ChannelList />
        </div>
        <div className={`${orientation === 'portrait' ? 'w-2/3' : 'w-[40%]'} bg-black flex-shrink-0`}>
          <VideoPlayer />
        </div>
      </div>
    </div>
  );
};

export default AppContent;