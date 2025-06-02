// Importar las funciones de manejo de errores al principio del archivo
import { logError, safeFetch, logWarning, logInfo } from "../utils/error-handler";

// API para obtener información de programación
const PROGRAM_API_URL = import.meta.env.VITE_PROGRAM_API_URL || "https://api.example.com/programs";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_PROGRAM_DATA === "true";

// Validate API URL and log appropriate messages
const validateApiUrl = () => {
  if (USE_MOCK_DATA) {
    logInfo("Using mock program data (configured via VITE_USE_MOCK_PROGRAM_DATA)", "program-api");
    return false;
  }
  
  if (!PROGRAM_API_URL || PROGRAM_API_URL === "https://api.example.com/programs") {
    logWarning(
      "Program API URL not configured or using default value. " +
      "Set VITE_PROGRAM_API_URL in your .env file. " +
      "Using mock data instead.", 
      "program-api"
    );
    return false;
  }
  
  if (!PROGRAM_API_URL.startsWith('http')) {
    logWarning(
      `Invalid Program API URL format: "${PROGRAM_API_URL}". ` +
      "URL should start with http:// or https://. " +
      "Using mock data instead.",
      "program-api"
    );
    return false;
  }
  
  return true;
};

// Check API URL on module load
const isApiUrlValid = validateApiUrl();

// Tipos para la información de programación
export interface ProgramInfo {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  genre?: string;
  rating?: string;
  thumbnail?: string;
}

// Datos de ejemplo para cuando no hay API disponible
const mockProgramData: Record<string, ProgramInfo> = {
  "default": {
    id: "mock-1",
    channelId: "any",
    title: "Programa en vivo",
    description: "Transmisión en directo del contenido seleccionado.",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
  }
};

// Función para obtener información del programa actual con mejor manejo de errores
export const fetchProgramInfo = async (channelId: string): Promise<ProgramInfo> => {
  // Si está configurado para usar datos de ejemplo o la URL no es válida, devolver inmediatamente
  if (USE_MOCK_DATA || !isApiUrlValid) {
    return mockProgramData[channelId] || mockProgramData.default;
  }
  
  try {
    return await safeFetch<ProgramInfo>(
      `${PROGRAM_API_URL}/${channelId}/current`,
      { headers: { 'Accept': 'application/json' } },
      API_TIMEOUT,
      mockProgramData[channelId] || mockProgramData.default
    );
  } catch (error) {
    logError(error, "fetchProgramInfo");
    return mockProgramData[channelId] || mockProgramData.default;
  }
};

// Función para obtener la guía de programación completa con mejor manejo de errores
export const fetchProgramGuide = async (channelId: string): Promise<ProgramInfo[]> => {
  // Si está configurado para usar datos de ejemplo o la URL no es válida, devolver datos de ejemplo
  if (USE_MOCK_DATA || !isApiUrlValid) {
    logInfo("Generating mock program guide data", "fetchProgramGuide");
    return generateMockProgramGuide(channelId);
  }
  
  try {
    return await safeFetch<ProgramInfo[]>(
      `${PROGRAM_API_URL}/${channelId}/guide`,
      { headers: { 'Accept': 'application/json' } },
      API_TIMEOUT,
      generateMockProgramGuide(channelId) // Use generated mock data as fallback
    );
  } catch (error) {
    logError(error, "fetchProgramGuide");
    return generateMockProgramGuide(channelId);
  }
};

// Helper function to generate mock program guide
const generateMockProgramGuide = (channelId: string): ProgramInfo[] => {
  const now = new Date();
  const guide: ProgramInfo[] = [];
  
  for (let i = 0; i < 24; i++) {
    const startTime = new Date(now);
    startTime.setHours(i, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(i + 1, 0, 0, 0);
    
    guide.push({
      id: `mock-${i}`,
      channelId,
      title: `Programa ${i + 1}`,
      description: `Descripción del programa ${i + 1}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      genre: i % 2 === 0 ? "Entretenimiento" : "Noticias"
    });
  }
  
  return guide;
};