import type { ReservationDetails } from './types';

interface ReservationSlot {
  restaurantId: string;
  floorId: string;
  tableId: string;
  date: string;
  time: string;
  durationMinutes: number;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const overlaps = (start: number, duration: number, otherStart: number, otherDuration: number) =>
  start < otherStart + otherDuration && otherStart < start + duration;

export const isTableReserved = (reservations: ReservationDetails[], slot: ReservationSlot) =>
  reservations.some(
    (reservation) =>
      reservation.status === 'upcoming' &&
      reservation.restaurantId === slot.restaurantId &&
      reservation.floorId === slot.floorId &&
      reservation.tableId === slot.tableId &&
      reservation.date === slot.date &&
      overlaps(
        toMinutes(slot.time),
        slot.durationMinutes,
        toMinutes(reservation.time),
        reservation.durationMinutes,
      ),
  );
