import React from "react";
import { Icon } from "@iconify/react";
import ErrorBoundary from "./components/error-boundary";
import { SettingsProvider } from "./context/settings-context";
import { AuthProvider } from "./context/auth-context";
import { ChannelProvider } from "./context/channel-context";
import { KeyboardNavigationProvider } from "./components/keyboard-navigation";
import AppContent from "./components/app-content";
import Login from "./components/login";
import AppLoader from "./components/app-loader";
import ConsoleLogger from "./components/console-logger";
import { FullscreenProvider } from "./components/fullscreen-provider";
import { CastingProvider } from "./components/casting-provider";

function App() {
  const [isAppLoading, setIsAppLoading] = React.useState(true);
  const [appError, setAppError] = React.useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const requireLogin = false; // Configuración para requerir inicio de sesión
  
  // Simular carga de la aplicación
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleRetry = () => {
    setIsAppLoading(true);
    setAppError(null);
  };
  
  if (isAppLoading || appError) {
    return <AppLoader isLoading={isAppLoading} error={appError} onRetry={handleRetry} />;
  }
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <ChannelProvider>
            <FullscreenProvider>
              <CastingProvider>
                <KeyboardNavigationProvider>
                  {!isLoggedIn && requireLogin ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <AppContent />
                  )}
                  <ConsoleLogger />
                </KeyboardNavigationProvider>
              </CastingProvider>
            </FullscreenProvider>
          </ChannelProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;