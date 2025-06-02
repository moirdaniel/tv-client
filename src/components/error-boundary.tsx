import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error capturado en ErrorBoundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#000a1f] text-white p-4">
          <div className="bg-[#5a0a22] text-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
            <p className="mb-4">La aplicación ha encontrado un error inesperado.</p>
            <div className="bg-[#3a0515] p-3 rounded overflow-auto max-h-40 mb-4">
              <pre className="text-sm text-white">{this.state.error?.toString()}</pre>
            </div>
            <Button
              color="danger"
              variant="solid"
              onPress={() => window.location.reload()}
              className="w-full"
            >
              <Icon icon="lucide:refresh-cw" className="mr-2" />
              Recargar aplicación
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;