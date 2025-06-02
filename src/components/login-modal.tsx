import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/auth-context";
import { AUTH_CONFIG } from "../config/app-config";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginAsGuest } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(username, password);
      
      if (success) {
        onClose();
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intente nuevamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGuestLogin = () => {
    loginAsGuest();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center">
                <Icon icon="lucide:tv" className="mr-2 text-primary" />
                <span>Iniciar sesión en Sitelco.TV</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="bg-danger-100 text-danger p-2 rounded-md mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <Input
                label="Usuario"
                placeholder="Ingrese su nombre de usuario"
                value={username}
                onValueChange={setUsername}
                startContent={<Icon icon="lucide:user" />}
                isDisabled={isLoading}
                autoComplete="username"
              />
              
              <Input
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                value={password}
                onValueChange={setPassword}
                type="password"
                startContent={<Icon icon="lucide:lock" />}
                isDisabled={isLoading}
                autoComplete="current-password"
              />
              
              <div className="flex justify-between items-center">
                <Checkbox 
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  isDisabled={isLoading}
                >
                  Recordarme
                </Checkbox>
                <Button variant="light" size="sm">¿Olvidó su contraseña?</Button>
              </div>
            </ModalBody>
            <ModalFooter>
              {!AUTH_CONFIG.enabled && (
                <Button 
                  color="primary" 
                  variant="flat" 
                  onPress={handleGuestLogin}
                  isDisabled={isLoading}
                >
                  Continuar como invitado
                </Button>
              )}
              <Button 
                color="primary" 
                onPress={handleLogin}
                isLoading={isLoading}
              >
                Iniciar sesión
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
