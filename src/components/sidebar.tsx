import React from "react";
import { useChannelContext } from "../context/channel-context";
import { Icon } from "@iconify/react";
import { useKeyboardNavigation } from "./keyboard-navigation";
import { useAuth } from "../context/auth-context";

const Sidebar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useChannelContext();
  const { user } = useAuth();
  const { activeSection, keyboardNavigation } = useKeyboardNavigation();
  const [focusedCategoryIndex, setFocusedCategoryIndex] = React.useState(0);
  
  // Usar directamente las categorías sin filtrar
  const filteredCategories = categories;

  // Registrar función para cambiar categoría
  React.useEffect(() => {
    if (keyboardNavigation && typeof keyboardNavigation.registerCategoryChange === 'function') {
      keyboardNavigation.registerCategoryChange((direction: number) => {
        setFocusedCategoryIndex(prevIndex => {
          const newIndex = prevIndex + direction;
          // Navegación circular
          if (newIndex < 0) return filteredCategories.length - 1;
          if (newIndex >= filteredCategories.length) return 0;
          
          // Actualizar categoría seleccionada
          const newCategory = filteredCategories[newIndex];
          setSelectedCategory(newCategory.name);
          
          return newIndex;
        });
      });
    }
  }, [keyboardNavigation, filteredCategories, setSelectedCategory]);

  // Actualizar el índice enfocado cuando cambia la categoría seleccionada
  React.useEffect(() => {
    const index = filteredCategories.findIndex(cat => cat.name === selectedCategory);
    if (index !== -1) {
      setFocusedCategoryIndex(index);
    }
  }, [selectedCategory, filteredCategories]);

  return (
    <div className="w-64 bg-background border-r border-gray-800 overflow-y-auto channel-list">
      <div className="mt-2">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
              selectedCategory === category.name ? "active-category" : "hover:bg-gray-800"
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <div className="flex items-center">
              {category.name === "FAVOURITE" && (
                <Icon 
                  icon="lucide:star" 
                  className="mr-2 text-yellow-400" 
                  width={16} 
                  height={16} 
                />
              )}
              <span className="font-medium">{category.name}</span>
            </div>
            <span className="text-gray-400">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;