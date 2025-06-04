import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/react";
import { useKeyboardNavigation } from "./keyboard-navigation";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Buscar canales..." 
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { registerSearchInput } = useKeyboardNavigation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Registrar el input para la navegación por teclado
  React.useEffect(() => {
    if (inputRef.current) {
      registerSearchInput(inputRef.current);
    }
    
    return () => {
      registerSearchInput(null);
    };
  }, [registerSearchInput]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-900 text-white border-gray-700"
          startContent={
            <Icon icon="lucide:search" className="text-gray-400" width={18} height={18} />
          }
          endContent={
            searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-white"
              >
                <Icon icon="lucide:x" width={16} height={16} />
              </button>
            )
          }
        />
      </div>
    </form>
  );
};

export default SearchBar;