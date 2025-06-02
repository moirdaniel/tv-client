import React from "react";
import { Channel, CategoryCount } from "../types/channel";
import { channels as initialChannels } from "../data/channels";
import { fetchChannels } from "../services/api";
import { safeLocalStorage, safeJsonParse, logError } from "../utils/error-handler";
import { useAuth } from "./auth-context";

// Definir estas constantes explícitamente al principio del archivo
const LAST_CHANNEL_KEY = "mt_media_last_channel";
const FAVORITES_KEY = "mt_media_favorites";

interface ChannelContextType {
  channels: Channel[];
  selectedChannel: Channel | null;
  selectedCategory: string;
  categories: CategoryCount[];
  orientation: 'portrait' | 'landscape';
  isLoading: boolean;
  error: string | null;
  favoriteChannels: Channel[];
  setSelectedChannel: (channel: Channel) => void;
  setSelectedCategory: (category: string) => void;
  getChannelsByCategory: (category: string) => Channel[];
  toggleFavorite: (channel: Channel) => void;
  isFavorite: (channelId: string) => boolean;
}

const ChannelContext = React.createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [channels, setChannels] = React.useState<Channel[]>(initialChannels);
  const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [favoriteChannels, setFavoriteChannels] = React.useState<Channel[]>([]);
  
  // Detectar cambios de orientación
  React.useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar favoritos desde localStorage
  React.useEffect(() => {
    try {
      // Crear clave específica para el usuario actual
      const userFavoritesKey = user ? `${FAVORITES_KEY}_${user.id}` : FAVORITES_KEY;
      
      const storedFavorites = safeLocalStorage.getItem(userFavoritesKey);
      if (storedFavorites) {
        const favoriteIds = safeJsonParse<string[]>(storedFavorites, []);
        const favChannels = channels.filter(channel => 
          favoriteIds.includes(channel._id)
        );
        setFavoriteChannels(favChannels);
      }
    } catch (error) {
      logError(error, "ChannelProvider.loadFavorites");
    }
  }, [channels, user]);

  // Cargar último canal seleccionado
  React.useEffect(() => {
    try {
      // Crear clave específica para el usuario actual
      const userLastChannelKey = user ? `${LAST_CHANNEL_KEY}_${user.id}` : LAST_CHANNEL_KEY;
      
      const storedChannelId = safeLocalStorage.getItem(userLastChannelKey);
      if (storedChannelId && channels.length > 0) {
        const lastChannel = channels.find(c => c._id === storedChannelId);
        if (lastChannel && lastChannel.enabled) {
          setSelectedChannel(lastChannel);
          return;
        }
      }
      
      // Si no hay canal guardado o no se encontró, seleccionar el primero habilitado
      if (channels.length > 0 && !selectedChannel) {
        const enabledChannels = channels.filter(c => c.enabled);
        if (enabledChannels.length > 0) {
          handleSelectChannel(enabledChannels[0]);
        }
      }
    } catch (error) {
      logError(error, "ChannelProvider.loadLastChannel");
    }
  }, [channels, user]);

  // Mejorar la función setSelectedChannel para asegurar que el canal esté habilitado
  const handleSelectChannel = React.useCallback((channel: Channel) => {
    if (channel && channel.enabled) {
      setSelectedChannel(channel);
      
      // Guardar el canal seleccionado en localStorage
      try {
        // Crear clave específica para el usuario actual
        const userLastChannelKey = user ? `${LAST_CHANNEL_KEY}_${user.id}` : LAST_CHANNEL_KEY;
        safeLocalStorage.setItem(userLastChannelKey, channel._id);
      } catch (error) {
        logError(error, "ChannelProvider.saveLastChannel");
      }
    }
  }, [user]);

  // Función para añadir/quitar de favoritos - Corregir la lógica para quitar favoritos
  const toggleFavorite = React.useCallback((channel: Channel) => {
    try {
      setFavoriteChannels(prev => {
        // Verificar si ya está en favoritos
        const isAlreadyFavorite = prev.some(c => c._id === channel._id);
        
        // Crear nueva lista de favoritos
        let newFavorites: Channel[];
        if (isAlreadyFavorite) {
          // Quitar de favoritos - CORREGIDO: estaba filtrando incorrectamente
          newFavorites = prev.filter(c => c._id !== channel._id);
        } else {
          // Añadir a favoritos
          newFavorites = [...prev, channel];
        }
        
        // Guardar en localStorage
        const favoriteIds = newFavorites.map(c => c._id);
        const userFavoritesKey = user ? `${FAVORITES_KEY}_${user.id}` : FAVORITES_KEY;
        safeLocalStorage.setItem(userFavoritesKey, JSON.stringify(favoriteIds));
        
        return newFavorites;
      });
    } catch (error) {
      logError(error, "ChannelProvider.toggleFavorite");
    }
  }, [user]);

  // Función para verificar si un canal es favorito
  const isFavorite = React.useCallback((channelId: string) => {
    return favoriteChannels.some(c => c._id === channelId);
  }, [favoriteChannels]);

  // Calculate categories and their counts
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    // Add ALL category with total count
    categoryMap.set("ALL", channels.length);
    
    // Add FAVOURITE category with count of favorites
    categoryMap.set("FAVOURITE", favoriteChannels.length);
    
    // Count channels per category
    channels.forEach(channel => {
      channel.category.forEach(cat => {
        const category = cat.toUpperCase();
        const currentCount = categoryMap.get(category) || 0;
        categoryMap.set(category, currentCount + 1);
      });
    });
    
    // Convert map to array of objects
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  }, [channels, favoriteChannels]);

  // Get channels by category
  const getChannelsByCategory = React.useCallback((category: string) => {
    if (category === "ALL") {
      return channels;
    }
    
    if (category === "FAVOURITE") {
      return favoriteChannels;
    }
    
    return channels.filter(channel => 
      channel.category.some(cat => cat.toUpperCase() === category)
    );
  }, [channels, favoriteChannels]);

  const value = {
    channels,
    selectedChannel,
    selectedCategory,
    categories,
    orientation,
    isLoading,
    error,
    favoriteChannels,
    setSelectedChannel: handleSelectChannel,
    setSelectedCategory,
    getChannelsByCategory,
    toggleFavorite,
    isFavorite
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannelContext = () => {
  const context = React.useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannelContext must be used within a ChannelProvider");
  }
  return context;
};