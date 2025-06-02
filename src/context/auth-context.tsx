import React from "react";
import { safeLocalStorage, safeJsonParse, logError } from "../utils/error-handler";

// Configuración de autenticación
export const AUTH_CONFIG = {
  enabled: import.meta.env.VITE_AUTH_ENABLED === 'true',
  defaultUser: import.meta.env.VITE_DEFAULT_USER || 'guest',
  defaultPassword: import.meta.env.VITE_DEFAULT_PASSWORD || 'guest'
};

interface User {
  id: string;
  username: string;
  displayName: string;
  isGuest: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthEnabled: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "mt_media_auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const isAuthEnabled = AUTH_CONFIG.enabled;
  
  // Cargar usuario desde localStorage al iniciar
  React.useEffect(() => {
    const storedUser = safeLocalStorage.getItem(STORAGE_KEY);
    
    if (storedUser) {
      try {
        const parsedUser = safeJsonParse<User | null>(storedUser, null);
        if (parsedUser) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          return; // Si hay usuario guardado, no crear usuario invitado
        }
      } catch (error) {
        logError(error, "AuthProvider.init");
        // Si hay error, limpiar el localStorage
        safeLocalStorage.removeItem(STORAGE_KEY);
      }
    }
    
    // Si no hay usuario almacenado o hubo un error, crear usuario invitado
    loginAsGuest();
  }, []);
  
  // Función para iniciar sesión como invitado - mejorada para generar ID único
  const loginAsGuest = () => {
    const guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const guestUser: User = {
      id: guestId,
      username: "guest",
      displayName: "Invitado",
      isGuest: true
    };
    
    setUser(guestUser);
    setIsAuthenticated(true);
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
  };
  
  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem(STORAGE_KEY);
    
    // Iniciar sesión como invitado automáticamente después de cerrar sesión
    loginAsGuest();
  };
  
  // Función para iniciar sesión
  const login = async (username: string, password: string): Promise<boolean> => {
    // Implementación simple para demo
    if (username === AUTH_CONFIG.defaultUser && password === AUTH_CONFIG.defaultPassword) {
      const userId = `user-${Date.now()}`;
      const loggedInUser: User = {
        id: userId,
        username: username,
        displayName: "Usuario",
        isGuest: false
      };
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      return true;
    }
    
    return false;
  };
  
  const value = {
    isAuthenticated,
    isAuthEnabled,
    user,
    login,
    logout,
    loginAsGuest
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};