import React from "react";
import { useChannelContext } from "../context/channel-context";
import { Icon } from "@iconify/react";
import { useKeyboardNavigation } from "./keyboard-navigation";
import { useAuth } from "../context/auth-context";

const Sidebar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useChannelContext();
  const { activeSection, registerCategoryChange } = useKeyboardNavigation();
  const [focusedCategoryIndex, setFocusedCategoryIndex] = React.useState(0);
  
  // Referencia para el contenedor de categorías
  const categoriesContainerRef = React.useRef<HTMLDivElement>(null);
  // Mapa de referencias para cada categoría
  const categoryRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Usar directamente las categorías sin filtrar
  const filteredCategories = categories;

  // Registrar función para cambiar categoría - corregir el error de keyboardNavigation
  React.useEffect(() => {
    registerCategoryChange((direction: number) => {
      const currentIndex = categories.findIndex(c => c.name === selectedCategory);
      if (currentIndex === -1) return;
      
      let newIndex = currentIndex + direction;
      
      // Navegación circular
      if (newIndex < 0) newIndex = categories.length - 1;
      if (newIndex >= categories.length) newIndex = 0;
      
      setSelectedCategory(categories[newIndex].name);
    });
  }, [registerCategoryChange, categories, selectedCategory, setSelectedCategory]);
  
  // Actualizar el índice enfocado cuando cambia la categoría seleccionada
  React.useEffect(() => {
    const index = filteredCategories.findIndex(cat => cat.name === selectedCategory);
    if (index !== -1) {
      setFocusedCategoryIndex(index);
    }
  }, [selectedCategory, filteredCategories]);
  
  // Efecto para hacer scroll a la categoría seleccionada
  React.useEffect(() => {
    if (selectedCategory && categoriesContainerRef.current) {
      const categoryElement = categoryRefs.current.get(selectedCategory);
      
      if (categoryElement) {
        // Obtener las dimensiones del contenedor y del elemento seleccionado
        const container = categoriesContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const categoryRect = categoryElement.getBoundingClientRect();
        
        // Verificar si el elemento está fuera de la vista visible
        const isAbove = categoryRect.top < containerRect.top;
        const isBelow = categoryRect.bottom > containerRect.bottom;
        
        if (isAbove) {
          // Si está por encima, hacer scroll hacia arriba
          categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (isBelow) {
          // Si está por debajo, hacer scroll hacia abajo
          categoryElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }
  }, [selectedCategory]);
  
  // Función para guardar la referencia de cada categoría
  const setCategoryRef = (element: HTMLDivElement | null, categoryName: string) => {
    if (element) {
      categoryRefs.current.set(categoryName, element);
    }
  };

  return (
    <div className={`w-64 bg-background border-r border-gray-800 overflow-y-auto channel-list ${
      activeSection === 'sidebar' ? 'ring-2 ring-primary-500 ring-inset' : ''
    }`}>
      <div className="mt-2" ref={categoriesContainerRef}>
        {categories.map((category) => (
          <div
            key={category.name}
            ref={(el) => setCategoryRef(el, category.name)}
            className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
              selectedCategory === category.name 
                ? "bg-primary-500/20 border-l-4 border-l-primary-500" 
                : "hover:bg-gray-800"
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <div className="flex items-center">
              {category.name === "FAVORITO" && (
                <Icon 
                  icon="lucide:star" 
                  className="mr-2 text-yellow-400" 
                  width={16} 
                  height={16} 
                />
              )}
              {category.name === "TODOS" && ( // Añadir icono para TODOS
                <Icon 
                  icon="lucide:list" 
                  className="mr-2 text-gray-400" 
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