import { Channel } from "../types/channel";

/**
 * Obtiene todas las categorías únicas de los canales
 */
export const getUniqueCategories = (channels: Channel[]): string[] => {
  const categoriesSet = new Set<string>();
  
  channels.forEach(channel => {
    channel.category.forEach(cat => {
      categoriesSet.add(cat.toUpperCase());
    });
  });
  
  return Array.from(categoriesSet).sort();
};

/**
 * Filtra canales por categoría
 */
export const filterChannelsByCategory = (
  channels: Channel[], 
  category: string, 
  favorites: string[] = []
): Channel[] => {
  if (category === "ALL") {
    return channels;
  }
  
  if (category === "FAVOURITE") {
    return channels.filter(channel => favorites.includes(channel._id));
  }
  
  return channels.filter(channel => 
    channel.category.some(cat => cat.toUpperCase() === category)
  );
};

/**
 * Ordena canales por nombre alfabéticamente
 */
export const sortChannelsByName = (channels: Channel[]): Channel[] => {
  return [...channels].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Ordena canales por número de canal
 */
export const sortChannelsById = (channels: Channel[]): Channel[] => {
  return [...channels].sort((a, b) => a.id - b.id);
};