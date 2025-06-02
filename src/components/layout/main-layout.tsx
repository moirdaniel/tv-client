import React from "react";
import Header from "../header";
import { useKeyboardNavigation } from "../../components/keyboard-navigation";
import { useChannelContext } from "../../context/channel-context";
import AppLoader from "../app-loader";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isLoading } = useChannelContext();
  
  if (isLoading) {
    return <AppLoader isLoading={isLoading} />;
  }
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;