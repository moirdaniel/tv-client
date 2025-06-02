import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const NavMenu: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { path: "/", label: "TV en vivo", icon: "lucide:tv" },
    { path: "/movies", label: "Películas y Series", icon: "lucide:film" },
    { path: "/music", label: "Música y Radio", icon: "lucide:music" }
  ];
  
  return (
    <nav className="bg-content2 border-t border-gray-800">
      <div className="container mx-auto">
        <ul className="flex justify-around">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex flex-col items-center py-3 px-4 ${
                  isActive(item.path) 
                    ? "text-primary-500" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon icon={item.icon} width={24} height={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavMenu;