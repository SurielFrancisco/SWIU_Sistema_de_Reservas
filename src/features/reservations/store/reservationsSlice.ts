import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getLocalDate } from '@/lib/date';
import type { ReservationDetails, ReservationDraft, ReservationsState } from '../types';

const createInitialDraft = (): ReservationDraft => ({
  restaurantId: null,
  floorId: null,
  selectedTableId: null,
  date: getLocalDate(),
  time: '19:00',
  guests: 2,
  durationMinutes: 120,
  preferences: '',
});

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
      } else if (state.draft.floorId !== action.payload.floorId) {
        state.draft.floorId = action.payload.floorId;
        state.draft.selectedTableId = null;
      }
    },
    selectTable: (state, action: PayloadAction<string | null>) => {
      state.draft.selectedTableId = action.payload;
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
  setDateTime,
  setDuration,
  setGuests,
  setPreferences,
} = reservationsSlice.actions;
export type { ReservationDetails } from '../types';
export default reservationsSlice.reducer;
