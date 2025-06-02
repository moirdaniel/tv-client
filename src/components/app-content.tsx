import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import ChannelList from "./channel-list";
import VideoPlayer from "./video-player";
import { useChannelContext } from "../context/channel-context";
import { useKeyboardNavigation } from "./keyboard-navigation";
import { useAuth } from "../context/auth-context";

const AppContent = () => {
  const { selectedChannel, orientation } = useChannelContext();
  const { activeSection, setActiveSection } = useKeyboardNavigation();
  const [showSidebar, setShowSidebar] = React.useState(true);
  const { isAuthenticated, isAuthEnabled, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  
  // Si la autenticación está habilitada y el usuario no está autenticado, mostrar pantalla de login
  React.useEffect(() => {
    if (isAuthEnabled && !isAuthenticated && !user) {
      setShowLoginModal(true);
    }
  }, [isAuthEnabled, isAuthenticated, user]);
  
  // Efecto para manejar clics en los componentes
  React.useEffect(() => {
    const handleSidebarClick = () => setActiveSection('sidebar');
    const handleChannelListClick = () => setActiveSection('channelList');
    const handleVideoPlayerClick = () => setActiveSection('videoPlayer');
    
    const sidebarElement = document.querySelector('.channel-list');
    const channelListElement = document.querySelector('.channel-list + .flex-1');
    const videoPlayerElement = document.querySelector('.video-player-container');
    
    if (sidebarElement) {
      sidebarElement.addEventListener('click', handleSidebarClick);
    }
    
    if (channelListElement) {
      channelListElement.addEventListener('click', handleChannelListClick);
    }
    
    if (videoPlayerElement) {
      videoPlayerElement.addEventListener('click', handleVideoPlayerClick);
    }
    
    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('click', handleSidebarClick);
      }
      
      if (channelListElement) {
        channelListElement.removeEventListener('click', handleChannelListClick);
      }
      
      if (videoPlayerElement) {
        videoPlayerElement.removeEventListener('click', handleVideoPlayerClick);
      }
    };
  }, [setActiveSection]);
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <ChannelList />
        </div>
        <div className="w-[40%] bg-black">
          <VideoPlayer />
        </div>
      </div>
      
      {/* Mostrar modal de login si es necesario */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
      
      {/* ... otros modales ... */}
    </div>
  );
};

export default AppContent;