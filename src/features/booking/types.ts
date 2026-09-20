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
  area?: string; // e.g. "Junto a la ventana"
  isAccessible?: boolean;
}

export interface FloorLayout {
  id: string;
  name: string; // e.g. "Planta Baja", "Rooftop"
  tables: TableInfo[];
}

export interface RestaurantLayout {
  id: string;
  floors: FloorLayout[];
}

export interface ReservationDetails {
  id: string;
  tableId: string;
  tableLabel: string;
  date: string;
  time: string;
  guests: number;
  customerName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface ReservationState {
  selectedTableId: string | null;
  date: string;
  time: string;
  guests: number;
  area: string;
  preferences: string;
  reservations: ReservationDetails[];
}
