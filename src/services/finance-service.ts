import { logError } from "../utils/error-handler";

export interface ExchangeRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  icon: string;
}

export interface StockIndex {
  code: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Función para obtener tasas de cambio
export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  try {
    // En una implementación real, esto llamaría a una API financiera
    // Como ejemplo, usamos datos estáticos
    return [
      {
        code: "USD",
        name: "Dólar estadounidense",
        rate: 850.25,
        change: 4.25,
        icon: "lucide:dollar-sign"
      },
      {
        code: "EUR",
        name: "Euro",
        rate: 920.75,
        change: -1.84,
        icon: "lucide:euro"
      },
      {
        code: "GBP",
        name: "Libra esterlina",
        rate: 1080.50,
        change: 2.30,
        icon: "lucide:pound-sterling"
      }
    ];
  } catch (error) {
    logError(error, "fetchExchangeRates");
    throw error;
  }
};

// Función para obtener índices bursátiles
export const fetchStockIndices = async (): Promise<StockIndex[]> => {
  try {
    // En una implementación real, esto llamaría a una API financiera
    // Como ejemplo, usamos datos estáticos
    return [
      {
        code: "IPSA",
        name: "Índice de Precio Selectivo de Acciones",
        value: 5842.15,
        change: 17.53,
        changePercent: 0.3
      },
      {
        code: "S&P500",
        name: "Standard & Poor's 500",
        value: 4532.78,
        change: 12.45,
        changePercent: 0.27
      },
      {
        code: "NASDAQ",
        name: "NASDAQ Composite",
        value: 14356.32,
        change: -23.87,
        changePercent: -0.17
      }
    ];
  } catch (error) {
    logError(error, "fetchStockIndices");
    throw error;
  }
};

// Función para formatear valores monetarios
export const formatCurrency = (value: number, currency: string = "CLP"): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(value);
};

// Función para formatear cambios porcentuales
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};