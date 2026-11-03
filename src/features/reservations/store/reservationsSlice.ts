import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getLocalDate, getNextReservationSlot } from '@/lib/date';
import type { ReservationDetails, ReservationDraft, ReservationsState } from '../types';
import type { ReservationMethod } from '@/features/restaurants/types';

const createInitialDraft = (): ReservationDraft => {
  const nextSlot = getNextReservationSlot();

  return {
    restaurantId: null,
    floorId: null,
    selectedTableId: null,
    reservationMethod: 'automatic-free',
    selectedZone: null,
    date: nextSlot.date,
    time: nextSlot.time,
    guests: 2,
    durationMinutes: 120,
    preferences: '',
  };
};

const initialState: ReservationsState = {
  draft: createInitialDraft(),
  reservations: [],
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    initializeDraft: (state, action: PayloadAction<{ restaurantId: string; floorId: string }>) => {
      if (state.draft.restaurantId !== action.payload.restaurantId) {
        state.draft = { ...createInitialDraft(), ...action.payload };
      } else {
        const nextSlot = getNextReservationSlot();
        const currentStart = new Date(`${state.draft.date}T${state.draft.time}`);
        const nextStart = new Date(`${nextSlot.date}T${nextSlot.time}`);

        if (Number.isNaN(currentStart.getTime()) || currentStart < new Date()) {
          state.draft.date = nextSlot.date;
          state.draft.time = nextSlot.time;
        } else if (currentStart < nextStart && state.draft.date === getLocalDate()) {
          state.draft.date = nextSlot.date;
          state.draft.time = nextSlot.time;
        }

        if (state.draft.floorId !== action.payload.floorId) {
          state.draft.floorId = action.payload.floorId;
          state.draft.selectedTableId = null;
        }
      }
    },
    selectTable: (state, action: PayloadAction<string | null>) => {
      state.draft.selectedTableId = action.payload;
    },
    setReservationMethod: (state, action: PayloadAction<ReservationMethod>) => {
      state.draft.reservationMethod = action.payload;
      state.draft.selectedZone = null;
      state.draft.selectedTableId = null;
    },
    setReservationZone: (state, action: PayloadAction<string | null>) => {
      state.draft.selectedZone = action.payload;
      state.draft.selectedTableId = null;
    },
    setDateTime: (state, action: PayloadAction<{ date: string; time: string }>) => {
      state.draft.date = action.payload.date;
      state.draft.time = action.payload.time;
    },
    setGuests: (state, action: PayloadAction<number>) => {
      state.draft.guests = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.draft.durationMinutes = action.payload;
    },
    setPreferences: (state, action: PayloadAction<string>) => {
      state.draft.preferences = action.payload;
    },
    addReservation: (state, action: PayloadAction<ReservationDetails>) => {
      state.reservations.push(action.payload);
      state.draft.selectedTableId = null;
    },
    cancelReservation: (state, action: PayloadAction<string>) => {
      const reservation = state.reservations.find((item) => item.id === action.payload);
      if (reservation) reservation.status = 'cancelled';
    },
    hydrateReservations: (state, action: PayloadAction<ReservationDetails[]>) => {
      state.reservations = action.payload;
    },
  },
});

export const {
  addReservation,
  cancelReservation,
  hydrateReservations,
  initializeDraft,
  selectTable,
  setReservationMethod,
  setReservationZone,
  setDateTime,
  setDuration,
  setGuests,
  setPreferences,
} = reservationsSlice.actions;
export type { ReservationDetails } from '../types';
export default reservationsSlice.reducer;
