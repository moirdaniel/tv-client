import React from "react";
import Sidebar from "../components/sidebar";
import ChannelList from "../components/channel-list";
import VideoPlayer from "../components/video-player";
import { useChannelContext } from "../context/channel-context";
import { useKeyboardNavigation } from "../components/keyboard-navigation";

const TVView: React.FC = () => {
  const { orientation } = useChannelContext();
  const { activeSection, setActiveSection } = useKeyboardNavigation();
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
  
  return (
    <div className="flex h-full overflow-hidden">
      {isSidebarVisible && (
        <div 
          className={`${orientation === 'portrait' ? 'w-1/3' : 'w-64'} border-r border-gray-800 flex-shrink-0 overflow-hidden`}
        >
          <Sidebar isActive={activeSection === 'sidebar'} />
        </div>
      )}
      <div 
        className="flex-1 overflow-hidden"
      >
        <ChannelList isActive={activeSection === 'channels'} />
      </div>
      <div 
        className={`${orientation === 'portrait' ? 'w-2/3' : 'w-[40%]'} bg-black flex-shrink-0`}
      >
        <VideoPlayer />
      </div>
    </div>
  );
};

export default TVView;