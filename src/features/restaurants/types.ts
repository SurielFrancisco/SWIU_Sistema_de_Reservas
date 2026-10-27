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
}
