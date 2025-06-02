import React from "react";
import { Button, Input, Checkbox, Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/auth-context";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
        onLogin();
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
    onLogin();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold">MT Media TV</h1>
          <p className="text-default-500">Inicie sesión para continuar</p>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="bg-danger-100 text-danger p-2 rounded-md mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
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
          </div>
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button 
            color="primary" 
            variant="flat" 
            onPress={handleGuestLogin}
            isDisabled={isLoading}
          >
            Continuar como invitado
          </Button>
          <Button 
            color="primary" 
            onPress={handleLogin}
            isLoading={isLoading}
          >
            Iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;