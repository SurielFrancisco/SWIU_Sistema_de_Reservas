export type TableStatus = 'available' | 'reserved' | 'occupied' | 'out-of-service';
export type TableShape = 'square-2' | 'square-4' | 'round-4' | 'rect-6' | 'rect-8' | 'large-group';

export interface TableInfo {
  id: string;
  label: string;
  capacity: number;
  status: TableStatus;
  shape: TableShape;
  position: {
    x: number; // Porcentaje relativo al contenedor (0-100)
    y: number; // Porcentaje relativo al contenedor (0-100)
  };
  isAccessible?: boolean;
}

export interface ReservationState {
  selectedTableId: string | null;
  date: string;
  time: string;
  guests: number;
  area: string;
  preferences: string;
}
