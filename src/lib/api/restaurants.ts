import type {
  FloorLayout,
  Restaurant,
  RestaurantLayout,
  TableInfo,
  TableStatus,
} from '@/features/restaurants/types';
import { apiFetch } from './client';

interface ApiTable {
  id: string;
  etiqueta: string;
  capacidad: number;
  forma: string;
  estado: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'OUT_OF_SERVICE';
  areaId: string;
  area?: { nombre: string; piso?: { nombre: string } };
}

interface ApiFloor {
  id: string;
  nombre: string;
  orden: number;
  areas: Array<{ id: string; nombre: string; mesas: ApiTable[] }>;
}

export interface ApiRestaurant {
  id: string;
  nombre: string;
  tipoCocina: string;
  ubicacion: string;
  activo: boolean;
  zonaHoraria: string;
  pisos?: ApiFloor[];
}

const statusMap: Record<ApiTable['estado'], TableStatus> = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  OCCUPIED: 'occupied',
  OUT_OF_SERVICE: 'out-of-service',
};

const shapeMap: Record<string, TableInfo['shape']> = {
  cuadrada: 'square-4',
  redonda: 'round-4',
  rectangular: 'rect-6',
  grupal: 'large-group',
};

export function mapRestaurant(api: ApiRestaurant, image = ''): Restaurant {
  return {
    id: api.id,
    name: api.nombre,
    type: api.tipoCocina,
    location: api.ubicacion,
    rating: 0,
    image,
  };
}

export function mapLayout(api: ApiRestaurant): RestaurantLayout {
  const floors: FloorLayout[] = (api.pisos ?? []).map((floor) => {
    const tables = floor.areas.flatMap((area) =>
      area.mesas.map((table, index): TableInfo => ({
        id: table.id,
        label: table.etiqueta,
        capacity: table.capacidad,
        status: statusMap[table.estado],
        shape: shapeMap[table.forma.toLowerCase()] ?? 'square-4',
        position: { x: 16 + (index % 4) * 20, y: 22 + Math.floor(index / 4) * 22 },
        area: area.nombre,
        areaId: area.id,
      })),
    );
    return { id: floor.id, name: floor.nombre, tables };
  });

  return { id: api.id, floors };
}

export const getPublicRestaurants = () =>
  apiFetch<{ restaurantes: ApiRestaurant[] }>('/restaurants/public');

export const getRestaurants = (token: string) =>
  apiFetch<{ restaurantes: ApiRestaurant[] }>('/restaurants', { token });

export const getRestaurant = (id: string, token: string) =>
  apiFetch<{ restaurante: ApiRestaurant }>(`/restaurants/${id}`, { token });

export const getReservationMethods = (id: string, token: string) =>
  apiFetch<{ modalidades: Array<{ codigo: string; activa: boolean }> }>(
    `/restaurants/${id}/reservation-methods`,
    { token },
  );
