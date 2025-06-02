import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchProgramGuide, ProgramInfo } from "../services/program-api";
import { useChannelContext } from "../context/channel-context";
import { useSettings } from "../context/settings-context";

interface ProgramGuideProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ProgramGuide: React.FC<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}> = ({ isOpen, onOpenChange }) => {
  const { selectedChannel } = useChannelContext();
  const { use24HourFormat } = useSettings();
  const [programs, setPrograms] = React.useState<ProgramInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (isOpen && selectedChannel) {
      loadProgramGuide();
    }
  }, [isOpen, selectedChannel]);
  
  const loadProgramGuide = async () => {
    if (!selectedChannel) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const guide = await fetchProgramGuide(selectedChannel._id);
      setPrograms(guide);
    } catch (err) {
      console.error("Error loading program guide:", err);
      setError("No se pudo cargar la guía de programación");
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (use24HourFormat) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
  };
  
  const isCurrentProgram = (program: ProgramInfo) => {
    const now = new Date();
    const start = new Date(program.startTime);
    const end = new Date(program.endTime);
    
    return now >= start && now <= end;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="5xl"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/70 backdrop-blur-md",
        base: "bg-background border border-gray-800",
        header: "border-b border-gray-800",
        footer: "border-t border-gray-800",
        closeButton: "hover:bg-white/10"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Guía de Programación - {selectedChannel?.name}
            </ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner color="primary" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <Icon icon="lucide:alert-circle" className="text-danger mx-auto mb-2" width={32} height={32} />
                  <p className="text-danger">{error}</p>
                  <Button 
                    color="primary" 
                    variant="light" 
                    onPress={loadProgramGuide}
                    className="mt-4"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {programs.map((program) => (
                    <div 
                      key={program.id} 
                      className={`p-3 rounded-md ${isCurrentProgram(program) ? 'bg-primary-500/10 border border-primary-500' : 'bg-content2'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">
                          {program.title}
                          {isCurrentProgram(program) && (
                            <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                              EN VIVO
                            </span>
                          )}
                        </h3>
                        <span className="text-sm text-default-500">
                          {formatTime(program.startTime)} - {formatTime(program.endTime)}
                        </span>
                      </div>
                      {program.description && (
                        <p className="text-sm text-default-600">{program.description}</p>
                      )}
                      {program.genre && (
                        <div className="mt-2 flex items-center">
                          <Icon icon="lucide:tag" className="text-default-400 mr-1" width={14} height={14} />
                          <span className="text-xs text-default-400">{program.genre}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProgramGuide;