export type TableStatus = 'available' | 'reserved' | 'occupied' | 'out-of-service';
export type TableShape = 'square-2' | 'square-4' | 'round-4' | 'rect-6' | 'rect-8' | 'large-group';

export interface TableInfo {
  id: string;
  label: string;
  capacity: number;
  status: TableStatus;
  shape: TableShape;
  position: { x: number; y: number };
  area?: string;
  isAccessible?: boolean;
}

export interface FloorLayout {
  id: string;
  name: string;
  tables: TableInfo[];
  areas?: RestaurantArea[];
}

export interface RestaurantLayout {
  id: string;
  floors: FloorLayout[];
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  image: string;
}

export type ReservationMethod =
  | 'automatic-free'
  | 'zone-free'
  | 'table-free'
  | 'automatic-fixed-fee'
  | 'table-fixed-fee'
  | 'per-person-fee'
  | 'zone-table-fee'
  | 'table-deposit'
  | 'refundable-guarantee'
  | 'members-only';

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface RestaurantHours {
  enabled: boolean;
  open: string;
  close: string;
}

export type RestaurantSchedule = Record<Weekday, RestaurantHours>;

export interface RestaurantArea {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
}

export interface PaymentOption {
  restaurantName: string;
  deposit: number;
}

export interface ManagedRestaurant extends Restaurant {
  ownerEmail: string;
  status: 'draft' | 'published';
  layout: RestaurantLayout;
  tableCount?: number;
  schedule?: RestaurantSchedule;
  reservationMethods?: ReservationMethod[];
}
