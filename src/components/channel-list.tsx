import React from "react";
import { useChannelContext } from "../context/channel-context";
import { useSettings } from "../context/settings-context";
import { Channel } from "../types/channel";
import { Icon } from "@iconify/react";
import { useKeyboardNavigation } from "./keyboard-navigation";
import { Input } from "@heroui/react";
import SearchBar from "./search-bar";

interface ChannelListProps {
  isActive?: boolean;
}

const ChannelList: React.FC = () => {
  const { selectedCategory, selectedChannel, setSelectedChannel, getChannelsByCategory, isFavorite, toggleFavorite } = useChannelContext();
  const { showChannelNumbers } = useSettings();
  const { activeSection, registerChannelChange } = useKeyboardNavigation();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [focusedChannelIndex, setFocusedChannelIndex] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Filtrar canales basados en la categoría seleccionada
  const channelsToDisplay = React.useMemo(() => {
    return getChannelsByCategory(selectedCategory);
  }, [selectedCategory, getChannelsByCategory]);

  // Registrar función para cambiar canal
  React.useEffect(() => {
    registerChannelChange((direction: number) => {
      setFocusedChannelIndex(prevIndex => {
        const newIndex = prevIndex + direction;
        // Navegación circular
        if (newIndex < 0) return channelsToDisplay.length - 1;
        if (newIndex >= channelsToDisplay.length) return 0;
        
        // Actualizar canal seleccionado
        const newChannel = channelsToDisplay[newIndex];
        setSelectedChannel(newChannel);
        
        return newIndex;
      });
    });
  }, [registerChannelChange, channelsToDisplay, setSelectedChannel]);

  // Filtrar canales basados en el término de búsqueda
  const filteredChannels = React.useMemo(() => {
    if (!searchTerm.trim()) return channelsToDisplay;
    
    return channelsToDisplay.filter(channel => 
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [channelsToDisplay, searchTerm]);
  
  // Referencia para el contenedor de la lista de canales
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  const selectedItemRef = React.useRef<HTMLDivElement>(null);
  
  // Efecto para hacer scroll al elemento seleccionado cuando cambia
  React.useEffect(() => {
    if (selectedChannel && listContainerRef.current && selectedItemRef.current) {
      // Obtener las dimensiones del contenedor y del elemento seleccionado
      const container = listContainerRef.current;
      const selectedItem = selectedItemRef.current;
      
      // Calcular la posición del elemento seleccionado relativa al contenedor
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedItem.getBoundingClientRect();
      
      // Verificar si el elemento está fuera de la vista visible
      const isAbove = selectedRect.top < containerRect.top;
      const isBelow = selectedRect.bottom > containerRect.bottom;
      
      if (isAbove) {
        // Si está por encima, hacer scroll hacia arriba
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (isBelow) {
        // Si está por debajo, hacer scroll hacia abajo
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [selectedChannel]);

  // Añadir función para manejar la búsqueda
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };
  
  return (
    <div className="channel-list h-full flex flex-col bg-gray-900">
      <div className="p-3 border-b border-gray-800">
        <SearchBar onSearch={handleSearch} placeholder="Buscar canales..." />
      </div>
      
      {/* Usar filteredChannels en lugar de channelsToDisplay para mostrar los resultados */}
      <div className="flex-1 overflow-y-auto" ref={listRef}>
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel) => (
            <ChannelItem 
              key={channel._id} 
              channel={channel} 
              isSelected={selectedChannel?._id === channel._id}
              isFavorite={isFavorite(channel._id)}
              onSelect={() => setSelectedChannel(channel)}
              onToggleFavorite={() => toggleFavorite(channel)}
              showNumber={showChannelNumbers}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Icon icon="lucide:tv-2" className="text-gray-500 mb-2" width={48} height={48} />
            <p className="text-gray-400">
              {searchTerm ? "No se encontraron canales" : "No hay canales en esta categoría"}
            </p>
            {selectedCategory === "FAVORITO" && !searchTerm && (
              <p className="text-gray-500 text-sm mt-2">
                Añade canales a favoritos haciendo clic en el ícono de estrella
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  showNumber?: boolean;
}

const ChannelItem = React.forwardRef<HTMLDivElement, ChannelItemProps>(({ 
  channel, 
  isSelected, 
  isFavorite,
  onSelect, 
  onToggleFavorite,
  showNumber = false
}, ref) => {
  // Evitar la propagación del evento al hacer clic en el botón de favoritos
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite();
  };

  // URL de imagen por defecto para canales sin logo
  const defaultLogoUrl = "https://static.vecteezy.com/system/resources/previews/007/688/855/large_2x/tv-logo-free-vector.jpg";

  return (
    <div 
      ref={ref}
      className={`flex items-center p-3 border-b border-gray-800 cursor-pointer channel-item ${
        isSelected ? 'bg-primary-500/20 border-l-4 border-l-primary-500' : 'hover:bg-gray-800/50'
      }`}
      onClick={onSelect}
    >
      <div className="w-12 h-12 mr-4 flex-shrink-0">
        <img 
          src={channel.logoUrl || defaultLogoUrl} 
          alt={channel.name} 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Si la imagen falla al cargar, usar la imagen por defecto
            (e.target as HTMLImageElement).src = defaultLogoUrl;
          }}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">
          {showNumber && <span className="text-gray-400 mr-2">{channel.id}</span>}
          {channel.name}
        </h3>
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
});

// Añadir displayName para el componente forwardRef
ChannelItem.displayName = 'ChannelItem';

export default ChannelList;