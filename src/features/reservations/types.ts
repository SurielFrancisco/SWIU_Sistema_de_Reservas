import type { ReservationMethod } from '@/features/restaurants/types';

export type ReservationStatus = 'upcoming' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'not-paid';

export interface ReservationDetails {
  id: string;
  restaurantId: string;
  floorId: string;
  tableId: string;
  tableLabel: string;
  date: string;
  time: string;
  durationMinutes: number;
  guests: number;
  customerName: string;
  status: ReservationStatus;
  paymentStatus?: PaymentStatus;
  depositAmount?: number;
  reservationMethod?: ReservationMethod;
}

export interface ReservationDraft {
  restaurantId: string | null;
  floorId: string | null;
  selectedTableId: string | null;
  reservationMethod: ReservationMethod;
  selectedZone: string | null;
  date: string;
  time: string;
  guests: number;
  durationMinutes: number;
  preferences: string;
}

export interface ReservationsState {
  draft: ReservationDraft;
  reservations: ReservationDetails[];
}
