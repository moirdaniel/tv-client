// Verificar si los tipos están correctamente definidos
export interface Channel {
  _id: string;
  id: number;
  name: string;
  url: string;
  logoUrl: string;
  enabled: boolean;
  category: string[];
}

export interface CategoryCount {
  name: string;
  count: number;
}