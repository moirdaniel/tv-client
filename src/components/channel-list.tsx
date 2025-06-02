import React from "react";
import { useChannelContext } from "../context/channel-context";
import { useSettings } from "../context/settings-context";
import { Channel } from "../types/channel";
import { Icon } from "@iconify/react";
import { useKeyboardNavigation } from "./keyboard-navigation";

interface ChannelListProps {
  isActive?: boolean;
}

const ChannelList: React.FC = () => {
  const { selectedCategory, selectedChannel, setSelectedChannel, getChannelsByCategory, toggleFavorite, isFavorite } = useChannelContext();
  
  const channelsToDisplay = getChannelsByCategory(selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto channel-list">
      {channelsToDisplay.length > 0 ? (
        channelsToDisplay.map((channel) => (
          <ChannelItem 
            key={channel._id} 
            channel={channel} 
            isSelected={selectedChannel?._id === channel._id}
            isFavorite={isFavorite(channel._id)}
            onSelect={() => setSelectedChannel(channel)}
            onToggleFavorite={() => toggleFavorite(channel)}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <Icon icon="lucide:tv-2" className="text-gray-500 mb-2" width={48} height={48} />
          <p className="text-gray-400">No hay canales en esta categoría</p>
          {selectedCategory === "FAVOURITE" && (
            <p className="text-gray-500 text-sm mt-2">
              Añade canales a favoritos haciendo clic en el ícono de estrella
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  isSelected, 
  isFavorite,
  onSelect, 
  onToggleFavorite 
}) => {
  // Evitar la propagación del evento al hacer clic en el botón de favoritos
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite();
  };

  return (
    <div 
      className={`flex items-center p-3 border-b border-gray-800 cursor-pointer channel-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="w-12 h-12 mr-4 flex-shrink-0">
        <img 
          src={channel.logoUrl || `https://img.heroui.chat/image/dashboard?w=48&h=48&u=${channel.id}`} 
          alt={channel.name} 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">{channel.name}</h3>
      </div>
      <button 
        className="p-2 text-gray-400 hover:text-yellow-400 focus:outline-none"
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Icon 
          icon={isFavorite ? "lucide:star" : "lucide:star"} 
          className={isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} 
          width={20} 
          height={20} 
        />
      </button>
    </div>
  );
};

export default ChannelList;