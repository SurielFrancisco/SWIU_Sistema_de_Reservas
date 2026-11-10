import type { ReservationDetails } from '@/features/reservations/types';
import type { ReservationMethod } from '@/features/restaurants/types';
import { apiFetch } from './client';

const methodMap: Record<ReservationMethod, 'AUTO_FREE' | 'ZONE_FREE' | 'TABLE_FREE'> = {
  'automatic-free': 'AUTO_FREE',
  'zone-free': 'ZONE_FREE',
  'table-free': 'TABLE_FREE',
  'automatic-fixed-fee': 'AUTO_FREE',
  'table-fixed-fee': 'TABLE_FREE',
  'per-person-fee': 'AUTO_FREE',
  'zone-table-fee': 'ZONE_FREE',
  'table-deposit': 'TABLE_FREE',
  'refundable-guarantee': 'TABLE_FREE',
  'members-only': 'TABLE_FREE',
};

interface ApiReservation {
  id: string;
  restauranteId: string;
  inicio: string;
  duracionMin: number;
  personas: number;
  estado: string;
  condiciones?: { modalidad?: string };
  mesas: Array<{ mesaId: string; mesa?: { etiqueta: string } }>;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('en-CA').format(date),
    time: new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date),
  };
};

export function mapReservation(api: ApiReservation): ReservationDetails {
  const formatted = formatDate(api.inicio);
  const backendMethod = api.condiciones?.modalidad;
  const reservationMethod = (Object.keys(methodMap) as ReservationMethod[]).find(
    (method) => methodMap[method] === backendMethod,
  );
  return {
    id: api.id,
    restaurantId: api.restauranteId,
    floorId: '',
    tableId: api.mesas[0]?.mesaId ?? '',
    tableLabel: api.mesas[0]?.mesa?.etiqueta ?? 'Asignada automáticamente',
    date: formatted.date,
    time: formatted.time,
    durationMinutes: api.duracionMin,
    guests: api.personas,
    customerName: '',
    status: api.estado === 'CANCELLED' ? 'cancelled' : api.estado === 'COMPLETED' ? 'completed' : 'upcoming',
    reservationMethod,
  };
}

export const getMyReservations = (token: string) =>
  apiFetch<{ reservas: ApiReservation[] }>('/reservations/mine', { token });

export const createReservation = (
  token: string,
  input: {
    restauranteId: string;
    modalidad: ReservationMethod;
    fecha: string;
    hora: string;
    duracion: number;
    personas: number;
    areaId?: string;
    mesaId?: string;
  },
) =>
  apiFetch<{ reserva: ApiReservation }>('/reservations', {
    method: 'POST',
    token,
    body: JSON.stringify({ ...input, modalidad: methodMap[input.modalidad] }),
  });
