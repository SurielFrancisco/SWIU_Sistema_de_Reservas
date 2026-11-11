import type {
  FloorLayout,
  Restaurant,
  RestaurantLayout,
  TableInfo,
  TableStatus,
} from '@/features/restaurants/types';
import { apiFetch } from './client';
import type { ManagedRestaurant, RestaurantSchedule, Weekday } from '@/features/restaurants/types';

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
  horarios?: Array<{ diaSemana: number; aperturaMin: number; cierreMin: number }>;
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

const weekdays: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const defaultSchedule = (): RestaurantSchedule => ({
  monday: { enabled: false, open: '00:00', close: '00:00' },
  tuesday: { enabled: false, open: '00:00', close: '00:00' },
  wednesday: { enabled: false, open: '00:00', close: '00:00' },
  thursday: { enabled: false, open: '00:00', close: '00:00' },
  friday: { enabled: false, open: '00:00', close: '00:00' },
  saturday: { enabled: false, open: '00:00', close: '00:00' },
  sunday: { enabled: false, open: '00:00', close: '00:00' },
});

export function mapManagedRestaurant(api: ApiRestaurant, ownerEmail: string, image = ''): ManagedRestaurant {
  const schedule = defaultSchedule();
  for (const hour of api.horarios ?? []) {
    const day = weekdays[hour.diaSemana];
    if (day) schedule[day] = {
      enabled: true,
      open: `${String(Math.floor(hour.aperturaMin / 60)).padStart(2, '0')}:${String(hour.aperturaMin % 60).padStart(2, '0')}`,
      close: `${String(Math.floor(hour.cierreMin / 60)).padStart(2, '0')}:${String(hour.cierreMin % 60).padStart(2, '0')}`,
    };
  }
  return {
    ...mapRestaurant(api, image),
    ownerEmail,
    status: api.activo ? 'published' : 'draft',
    tableCount: api.pisos?.reduce((total, floor) => total + floor.areas.reduce((count, area) => count + area.mesas.length, 0), 0),
    layout: mapLayout(api),
    schedule,
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

export const getPublicRestaurant = (id: string) =>
  apiFetch<{ restaurante: ApiRestaurant }>(`/restaurants/${id}/public`);

export const updateTableStatus = (
  token: string,
  tableId: string,
  estado: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'OUT_OF_SERVICE',
  motivo?: string,
) =>
  apiFetch<{ mesa: ApiTable }>(`/tables/${tableId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ estado, motivo }),
  });

export const getReservationMethods = (id: string, token: string) =>
  apiFetch<{ modalidades: Array<{ codigo: string; activa: boolean }> }>(
    `/restaurants/${id}/reservation-methods`,
    { token },
  );
