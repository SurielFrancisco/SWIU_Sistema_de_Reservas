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
}

export interface ReservationDraft {
  restaurantId: string | null;
  floorId: string | null;
  selectedTableId: string | null;
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
