import React from "react";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const MusicView: React.FC = () => {
  // Este es un componente placeholder para la futura vista de música y radios online
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Música y Radios Online</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="bg-content1 shadow-md">
            <div className="h-48 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon icon="lucide:music" width={48} height={48} className="text-gray-600" />
              </div>
            </div>
            <CardBody>
              <h3 className="font-medium">Próximamente</h3>
              <p className="text-sm text-gray-400">
                Esta sección estará disponible próximamente con música y radios online.
              </p>
            </CardBody>
            <CardFooter>
              <Button color="primary" size="sm" disabled>
                Reproducir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicView;